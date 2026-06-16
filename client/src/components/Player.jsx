import React, { useState } from 'react'

export default function Player({file}){
  const [loading, setLoading] = useState(false)
  
  if(!file) return <div className="text-gray-400">No generated track yet</div>
  
  const isWav = file.endsWith('.wav')
  const isMidi = file.endsWith('.mid')
  
  const handleAudioPlay = () => {
    setLoading(true)
  }
  
  const handleAudioCanPlay = () => {
    setLoading(false)
  }
  
  return (
    <div>
      <h3 className="text-lg font-medium mb-2">Preview</h3>
      <div className="mb-4 text-sm text-gray-300">✓ Royalty-Free Generated Music</div>
      {isWav ? (
        <div>
          {loading && <p className="text-xs text-yellow-400 mb-2">Loading audio...</p>}
          <audio 
            controls 
            src={file} 
            className="w-full bg-black rounded"
            onPlay={handleAudioPlay}
            onCanPlay={handleAudioCanPlay}
            onError={(e) => {
              console.error('Audio error:', e)
              setLoading(false)
            }}
            controlsList="nodownload"
          />
          <div className="mt-3 flex gap-2">
            <a href={file} download className="text-xs px-2 py-1 bg-indigo-600 rounded">
              Download WAV
            </a>
          </div>
        </div>
      ) : isMidi ? (
        <div>
          <p className="text-sm text-gray-400 mb-2">MIDI Format</p>
          <a href={file} download className="inline-block px-3 py-2 bg-indigo-600 rounded">
            Download MIDI
          </a>
        </div>
      ) : (
        <div className="text-sm">No audio available</div>
      )}
    </div>
  )
}
