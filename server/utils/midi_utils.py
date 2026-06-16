from music21 import stream, note, tempo, midi
import pretty_midi
import numpy as np
import os


def sequence_to_midi(sequence, path, bpm=90):
    """Generate MIDI file from note sequence."""
    try:
        s = stream.Stream()
        s.append(tempo.MetronomeMark(number=bpm))
        quarter_len = 0.25
        for n in sequence:
            if isinstance(n, int):
                s.append(note.Note(n, quarterLength=quarter_len))
            else:
                s.append(note.Rest(quarterLength=quarter_len))
        mf = midi.translate.streamToMidiFile(s)
        mf.open(path, 'wb')
        mf.write()
        mf.close()
        if os.path.exists(path):
            size = os.path.getsize(path)
            print(f'✓ MIDI created: {path} ({size} bytes)')
    except Exception as e:
        print(f'✗ Error creating MIDI: {e}')
        raise


def midi_to_wav(midi_path, wav_path, sf2_path=None):
    """
    Convert MIDI to WAV using pretty_midi synthesis. 
    Falls back to simple square-wave synthesis if FluidSynth not available.
    """
    try:
        pm = pretty_midi.PrettyMIDI(midi_path)
        try:
            # Try FluidSynth (requires system dependency)
            audio = pm.fluidsynth(fs=44100)
            print(f'✓ Using FluidSynth for WAV synthesis')
        except Exception as e:
            print(f'⚠ FluidSynth not available ({type(e).__name__}), using fallback synthesis')
            # Fallback: simple synthesizer
            audio = synthesize_from_midi(pm, fs=44100)
        
        # Save WAV
        try:
            import soundfile as sf
            sf.write(wav_path, audio, 44100)
            print(f'✓ WAV created: {wav_path}')
        except ImportError:
            print(f'⚠ soundfile not available, WAV not saved')
    except Exception as e:
        print(f'✗ Error converting MIDI to WAV: {e}')


def synthesize_from_midi(pm, fs=44100):
    """
    Simple fallback synthesizer: create audio from MIDI notes.
    """
    duration = pm.get_end_time()
    audio = np.zeros(int(duration * fs))
    
    for instrument in pm.instruments:
        for note_obj in instrument.notes:
            start_idx = int(note_obj.start * fs)
            end_idx = int(note_obj.end * fs)
            duration_samples = end_idx - start_idx
            
            if duration_samples > 0:
                # Generate sine wave at the note frequency
                freq = 440 * (2 ** ((note_obj.pitch - 69) / 12))
                t = np.arange(duration_samples) / fs
                # Simple sine wave with envelope
                envelope = np.exp(-t * 2)  # Decay
                wave = 0.3 * envelope * np.sin(2 * np.pi * freq * t)
                audio[start_idx:end_idx] += wave
    
    # Normalize
    max_val = np.max(np.abs(audio))
    if max_val > 0:
        audio = audio / max_val * 0.95
    
    return audio.astype(np.float32)


if __name__ == '__main__':
    # simple local test
    sequence_to_midi([60,62,64,65,67,69,71,72], 'test.mid')
