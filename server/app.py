from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from models.generate import generate_music
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi import Request
import uvicorn
import uuid
import os

app = FastAPI(title="AI Music Composer API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "generated")
os.makedirs(OUTPUT_DIR, exist_ok=True)

class GenerateRequest(BaseModel):
    genre: str = "Classical"
    bpm: int = 90
    length_seconds: int = 30
    creativity: float = 0.5
    instrument: str = "piano"
    num_notes: int = 128


@app.post("/api/generate")
async def api_generate(request: Request, req: GenerateRequest):
    try:
        song_id = str(uuid.uuid4())
        midi_filename = f"{song_id}.mid"
        wav_filename = f"{song_id}.wav"
        midi_path = os.path.join(OUTPUT_DIR, midi_filename)
        wav_path = os.path.join(OUTPUT_DIR, wav_filename)
        midi_file, wav_file = generate_music(req.dict(), midi_path=midi_path, wav_path=wav_path)
        base = str(request.base_url).rstrip('/')
        midi_url = f"{base}/generated/{midi_filename}"
        wav_url = f"{base}/generated/{wav_filename}" if wav_file else ""
        return JSONResponse({"id": song_id, "midi": midi_url, "wav": wav_url, "royalty_free": True})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/download/midi/{song_id}")
def download_midi(song_id: str):
    path = os.path.join(OUTPUT_DIR, f"{song_id}.mid")
    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail="Not found")
    return FileResponse(path, media_type='audio/midi', filename=f"{song_id}.mid")


@app.get("/generated/{file_path:path}")
def serve_generated_file(file_path: str):
    """Serve generated MIDI/WAV files with proper media types and streaming."""
    full_path = os.path.join(OUTPUT_DIR, file_path)
    
    # Security check: ensure file is within OUTPUT_DIR
    if not os.path.abspath(full_path).startswith(os.path.abspath(OUTPUT_DIR)):
        raise HTTPException(status_code=403, detail="Access denied")
    
    if not os.path.exists(full_path):
        raise HTTPException(status_code=404, detail="File not found")
    
    # Determine media type
    if file_path.endswith('.wav'):
        media_type = 'audio/wav'
    elif file_path.endswith('.mid') or file_path.endswith('.midi'):
        media_type = 'audio/midi'
    else:
        media_type = 'application/octet-stream'
    
    return FileResponse(
        full_path, 
        media_type=media_type,
        filename=os.path.basename(file_path)
    )


# Serve generated files - this is now handled by the /generated/{file_path} endpoint
# app.mount("/generated", StaticFiles(directory=OUTPUT_DIR), name="generated")


@app.get("/api/status")
def status():
    return {"status": "ok"}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
