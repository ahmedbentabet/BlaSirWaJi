"""
main.py - FastAPI application entry point for BlaSirWaJi.
"""
from __future__ import annotations

import os
from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from .llm_router import route_document

load_dotenv()


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("\u2728 BlaSirWaJi API starting...")
    yield
    print("\u2728 BlaSirWaJi API shutting down...")


app = FastAPI(
    title="BlaSirWaJi API",
    description="Moroccan administrative document routing powered by Gemma 4",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class RouteRequest(BaseModel):
    document_name: str = Field(..., description="Name of the Moroccan document in Arabic")
    lat: float = Field(..., description="User latitude")
    lng: float = Field(..., description="User longitude")


@app.get("/")
async def root():
    return {"status": "ok", "app": "BlaSirWaJi", "version": "1.0.0"}


@app.post("/api/route-document")
async def route_document_endpoint(request: RouteRequest):
    """
    Main endpoint: takes document name + coordinates,
    calls Gemma 4 with function tools, returns structured workflow.
    """
    result = route_document(
        document_name=request.document_name,
        lat=request.lat,
        lng=request.lng,
    )
    return result
