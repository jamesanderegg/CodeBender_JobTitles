'use client';

import Chat from './components/Chat';
import Location from './components/Location';

export default function Home() {
  return (
    <main className="App">
      <div className='container'>
        <Location />
        <Chat />
      </div>
    </main>
  )
}