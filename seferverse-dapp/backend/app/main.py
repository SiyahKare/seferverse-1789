import os
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from .utils.log import log
from .routes import deployments

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(
    title="SeferVerse Backend",
    description="Backend API for SeferVerse 1789",
    version="1.0.0"
)

# Configure CORS
origins = os.getenv("ALLOWED_ORIGINS", "").split(",") if os.getenv("ALLOWED_ORIGINS") else []
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins if origins else ["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(deployments.router)

# Global exception handler for 404
@app.exception_handler(404)
async def not_found_exception_handler(request: Request, exc):
    log(f"404 Not Found: {request.url}")
    return JSONResponse(
        status_code=404,
        content={"error": "Resource not found"}
    )

# Global exception handler for 500
@app.exception_handler(500)
async def internal_exception_handler(request: Request, exc):
    log(f"500 Internal Server Error: {request.url} - {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={"error": "Internal server error"}
    )

# Request logging middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    log(f"{request.method} {request.url}")
    response = await call_next(request)
    return response

# Startup event
@app.on_event("startup")
async def startup_event():
    port = int(os.getenv("BACKEND_PORT", 8000))
    log(f"Server starting on port {port}")

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("BACKEND_PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
