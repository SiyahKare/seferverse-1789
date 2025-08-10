import json
import os
import asyncio
import hashlib
from typing import Dict, Any, List, Optional
from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import StreamingResponse
from dotenv import load_dotenv
from ..utils.log import log
from pathlib import Path

# Load environment variables
load_dotenv()

router = APIRouter()
DEFAULT_DEPLOYMENTS_PATH = str(
    Path(__file__).resolve().parents[3] / "seferverse-blockchain" / "deployments.json"
)
DEPLOYMENTS_PATH = os.getenv("DEPLOYMENTS_PATH", DEFAULT_DEPLOYMENTS_PATH)

@router.get("/deployments")
async def get_deployments():
    """Get deployments from the blockchain deployments.json file."""
    log("GET /deployments")
    try:
        with open(DEPLOYMENTS_PATH, 'r') as f:
            deployments = json.load(f)
            return deployments
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="deployments.json not found")
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Invalid JSON in deployments file")

def _parse_allowed_origins() -> Optional[List[str]]:
    raw = os.getenv("ALLOWED_ORIGINS", "").strip()
    if not raw:
        return None
    return [o.strip() for o in raw.split(",") if o.strip()]


def _compute_diffs(prev: Optional[Dict[str, Any]], curr: Optional[Dict[str, Any]]) -> List[Dict[str, Any]]:
    events: List[Dict[str, Any]] = []
    prev = prev or {}
    curr = curr or {}
    # removals and updates/adds per network/contract
    prev_networks = set(prev.keys())
    curr_networks = set(curr.keys())
    # Removed networks
    for net in prev_networks - curr_networks:
        for name in prev.get(net, {}).keys():
            events.append({"type": "removed", "network": net, "name": name})
    # Added networks or within existing
    for net in curr_networks:
        prev_contracts = prev.get(net, {}) or {}
        curr_contracts = curr.get(net, {}) or {}
        prev_names = set(prev_contracts.keys())
        curr_names = set(curr_contracts.keys())
        # Removed contracts within existing networks
        for name in prev_names - curr_names:
            events.append({"type": "removed", "network": net, "name": name})
        # Added
        for name in curr_names - prev_names:
            events.append({"type": "added", "network": net, "name": name, "data": curr_contracts[name]})
        # Updated
        for name in curr_names & prev_names:
            if prev_contracts[name] != curr_contracts[name]:
                events.append({"type": "updated", "network": net, "name": name, "data": curr_contracts[name]})
    return events


@router.get("/deployments/stream")
async def stream_deployments(request: Request):
    """Server-Sent Events (SSE): deployments.json değiştikçe yayın yapar.
    Basit güvenlik: opsiyonel token ve origin kontrolü.
    """
    # Origin kontrolü (opsiyonel)
    allowed = _parse_allowed_origins()
    origin = request.headers.get("origin")
    if allowed is not None and origin not in allowed:
        raise HTTPException(status_code=403, detail="Origin not allowed")

    # Token kontrolü (opsiyonel)
    expected = os.getenv("STREAM_TOKEN", "").strip()
    provided = request.query_params.get("token", "")
    if expected and provided != expected:
        raise HTTPException(status_code=401, detail="Unauthorized stream")

    log("SSE /deployments/stream connected")

    async def event_generator():
        last_hash: Optional[str] = None
        last_payload: Optional[Dict[str, Any]] = None
        # İlk yayında full snapshot gönder
        try:
            with open(DEPLOYMENTS_PATH, 'rb') as f:
                content = f.read()
            last_hash = hashlib.sha256(content).hexdigest()
            last_payload = json.loads(content.decode('utf-8'))
        except Exception:
            last_hash = None
            last_payload = None
        initial = json.dumps({"type": "full", "hash": last_hash, "deployments": last_payload})
        # İstemciye yeniden bağlanma aralığı tavsiyesi (ms)
        yield "retry: 3000\n\n"
        yield f"data: {initial}\n\n"

        while True:
            try:
                with open(DEPLOYMENTS_PATH, 'rb') as f:
                    content = f.read()
                current_hash = hashlib.sha256(content).hexdigest()
                if current_hash != last_hash:
                    try:
                        payload = json.loads(content.decode('utf-8'))
                    except Exception:
                        payload = None
                    diffs = _compute_diffs(last_payload, payload)
                    last_payload = payload
                    last_hash = current_hash
                    if diffs:
                        for ev in diffs:
                            ev_out = {"type": ev.get("type"), "hash": current_hash, **{k: v for k, v in ev.items() if k != 'type'}}
                            yield f"data: {json.dumps(ev_out)}\n\n"
                    else:
                        # Fallback: değişiklik yoksa en azından hash yayınla
                        yield f"data: {json.dumps({"type": "noop", "hash": current_hash})}\n\n"
                else:
                    # keep-alive
                    yield ": ping\n\n"
            except FileNotFoundError:
                yield f"data: {json.dumps({"type": "full", "hash": None, "deployments": None})}\n\n"
            except Exception as e:
                log(f"SSE error: {e}")
                yield f"data: {json.dumps({"type": "error", "error": str(e)})}\n\n"
            await asyncio.sleep(2)

    return StreamingResponse(event_generator(), media_type="text/event-stream", headers={
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
    })

@router.get("/health")
async def health_check():
    """Health check endpoint."""
    log("GET /health")
    return {"status": "ok"}
