from __future__ import annotations

import os
import json
from datetime import date
from typing import Any, Dict, List, Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from bwa_backend import app as langgraph_app

app = FastAPI(title="Blog Writing Agent API")

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify the actual origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class BlogRequest(BaseModel):
    topic: str
    as_of: Optional[str] = None

class BlogResponse(BaseModel):
    status: str
    data: Optional[Dict[str, Any]] = None
    error: Optional[str] = None

@app.post("/generate-blog")
async def generate_blog(request: BlogRequest):
    try:
        as_of_date = request.as_of or date.today().isoformat()
        
        inputs = {
            "topic": request.topic.strip(),
            "mode": "",
            "needs_research": False,
            "queries": [],
            "evidence": [],
            "plan": None,
            "as_of": as_of_date,
            "recency_days": 7,
            "sections": [],
            "merged_md": "",
            "md_with_placeholders": "",
            "image_specs": [],
            "final": "",
        }
        
        # We'll use invoke for simplicity in this first version
        # If we want streaming, we can use a WebSocket or Server-Sent Events
        result = langgraph_app.invoke(inputs)
        
        # Pydantic models in the result need to be converted to dicts
        # The result itself is a dict (State TypedDict)
        
        def serialize(obj):
            if hasattr(obj, "model_dump"):
                return obj.model_dump()
            if isinstance(obj, list):
                return [serialize(item) for item in obj]
            if isinstance(obj, dict):
                return {k: serialize(v) for k, v in obj.items()}
            return obj

        serialized_result = serialize(result)
        
        return {"status": "success", "data": serialized_result}
    except Exception as e:
        print(f"Error generating blog: {e}")
        return {"status": "error", "error": str(e)}

@app.get("/health")
async def health():
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
