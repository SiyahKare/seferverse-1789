from datetime import datetime

def log(msg: str) -> None:
    """Log a message with ISO timestamp."""
    timestamp = datetime.utcnow().isoformat()
    print(f"[{timestamp}] {msg}")
