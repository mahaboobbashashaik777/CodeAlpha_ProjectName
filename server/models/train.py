import os
import glob
from music21 import converter, note, chord
import numpy as np
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Embedding, LSTM, Dense, Dropout
from tensorflow.keras.callbacks import ModelCheckpoint, EarlyStopping, TensorBoard


def load_midi_files(midi_folder):
    notes = []
    for f in glob.glob(os.path.join(midi_folder, '**', '*.mid'), recursive=True):
        try:
            midi = converter.parse(f)
            parts = midi.parts.stream()
            notes_to_parse = parts.recurse()
            for element in notes_to_parse:
                if isinstance(element, note.Note):
                    notes.append(str(element.pitch))
                elif isinstance(element, chord.Chord):
                    notes.append('.'.join(str(n) for n in element.normalOrder))
        except Exception:
            continue
    return notes


def prepare_sequences(notes, seq_length=100):
    pitchnames = sorted(set(notes))
    note_to_int = dict((note, number) for number, note in enumerate(pitchnames))
    network_input = []
    network_output = []
    for i in range(0, len(notes) - seq_length):
        seq_in = notes[i:i + seq_length]
        seq_out = notes[i + seq_length]
        network_input.append([note_to_int[n] for n in seq_in])
        network_output.append(note_to_int[seq_out])

    network_input = np.array(network_input)
    network_output = np.array(network_output)
    return network_input, network_output, len(pitchnames)


def build_model(vocab_size, seq_length=100, embedding_dim=100):
    model = Sequential()
    model.add(Embedding(vocab_size, embedding_dim, input_length=seq_length))
    model.add(LSTM(512, return_sequences=True))
    model.add(Dropout(0.3))
    model.add(LSTM(512))
    model.add(Dense(256, activation='relu'))
    model.add(Dropout(0.3))
    model.add(Dense(vocab_size, activation='softmax'))
    model.compile(loss='sparse_categorical_crossentropy', optimizer='adam')
    return model


if __name__ == '__main__':
    midi_folder = os.path.join(os.path.dirname(__file__), '..', 'dataset')
    notes = load_midi_files(midi_folder)
    if not notes:
        print('No MIDI files found in dataset folder. Place MIDI files under server/dataset/')
        exit(1)
    seq_length = 100
    X, y, vocab = prepare_sequences(notes, seq_length=seq_length)
    model = build_model(vocab, seq_length=seq_length)
    callbacks = [
        ModelCheckpoint('model_weights.h5', save_best_only=True),
        EarlyStopping(patience=10),
        TensorBoard(log_dir='./logs')
    ]
    model.fit(X, y, epochs=50, batch_size=64, callbacks=callbacks)
