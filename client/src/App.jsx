import React, {useState} from 'react'
import Generator from './components/Generator'
import Player from './components/Player'

export default function App(){
  const [latest, setLatest] = useState(null)
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6">
      <header className="max-w-5xl mx-auto mb-8">
        <h1 className="text-4xl font-bold">AI Music Composer</h1>
        <p className="text-sm text-gray-300">Generate royalty-free AI music — demo scaffold</p>
      </header>
      <main className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        <section className="col-span-2 bg-neutral-900 rounded-xl p-6 shadow-lg">
          <Generator onGenerated={setLatest} />
        </section>
        <aside className="bg-neutral-900 rounded-xl p-6 shadow-lg">
          <Player file={latest?.wav || latest?.midi} />
        </aside>
      </main>
    </div>
  )
}
