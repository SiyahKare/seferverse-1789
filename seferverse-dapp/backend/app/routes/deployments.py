import json
import os
from fastapi import APIRouter, HTTPException
from dotenv import load_dotenv
from ..utils.log import log

# Load environment variables
load_dotenv()

router = APIRouter()
DEPLOYMENTS_PATH = os.getenv("DEPLOYMENTS_PATH", "../../seferverse-blockchain/deployments.json")

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

@router.get("/health")
async def health_check():
    """Health check endpoint."""
    log("GET /health")
    return {"status": "ok"}
