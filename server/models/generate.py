import os
import random
import logging
from typing import Tuple
from utils.midi_utils import sequence_to_midi, midi_to_wav

logger = logging.getLogger(__name__)

MODEL_DIR = os.path.join(os.path.dirname(__file__), "..", "models_saved")
if not os.path.exists(MODEL_DIR):
    os.makedirs(MODEL_DIR, exist_ok=True)


def generate_music(params: dict, midi_path: str, wav_path: str) -> Tuple[str, str]:
    """
    Lightweight placeholder generator:
    - If a trained model exists, load and sample (not implemented here)
    - Otherwise create a short random melody and save as MIDI
    Returns paths to midi and wav (wav may be empty if conversion not available)
    """
    genre = params.get("genre", "Classical")
    num_notes = int(params.get("num_notes", 128))
    bpm = int(params.get("bpm", 90))

    # create a random sequence of pitch numbers within piano range
    num_pitches = max(8, min(num_notes, 256))
    seq = [random.randint(48, 84) for _ in range(num_pitches)]
    
    logger.info(f'Generating {genre} music: {num_pitches} notes at {bpm} BPM')
    sequence_to_midi(seq, midi_path, bpm=bpm)

    wav_out = ""
    try:
        midi_to_wav(midi_path, wav_path)
        wav_out = wav_path
    except Exception as e:
        logger.warning(f'WAV conversion skipped: {e}')
        wav_out = ""

    return midi_path, wav_out
