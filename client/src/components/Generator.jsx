import React, {useState} from 'react'

const genres = ['Classical','Jazz','Piano','Lo-fi','Ambient','Electronic']

export default function Generator({onGenerated}){
  const [genre,setGenre]=useState('Classical')
  const [bpm,setBpm]=useState(90)
  const [length,setLength]=useState(30)
  const [loading,setLoading]=useState(false)

  async function generate(){
    setLoading(true)
    const res = await fetch('/api/generate',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({genre, bpm, length_seconds:length, creativity:0.5, instrument:'piano', num_notes:128})
    })
    const data = await res.json()
    setLoading(false)
    onGenerated(data)
  }

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-2xl font-semibold">Generate Music</h2>
        <p className="text-sm text-gray-400">Select genre and parameters</p>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        {genres.map(g => (
          <button key={g} onClick={()=>setGenre(g)} className={`p-3 rounded ${g===genre? 'bg-indigo-600':'bg-neutral-800'}`}>{g}</button>
        ))}
      </div>
      <div className="space-y-3 mb-4">
        <label className="block">BPM
          <input type="range" min="40" max="200" value={bpm} onChange={e=>setBpm(e.target.value)} className="w-full" />
        </label>
        <label className="block">Length (seconds)
          <input type="number" value={length} onChange={e=>setLength(e.target.value)} className="w-full p-2 rounded bg-neutral-800" />
        </label>
      </div>
      <div className="flex gap-3">
        <button onClick={generate} disabled={loading} className="px-4 py-2 bg-indigo-500 rounded">{loading? 'Generating...':'Generate Music'}</button>
        <a href="/" className="px-4 py-2 bg-neutral-700 rounded">Demo Settings</a>
      </div>
    </div>
  )
}
