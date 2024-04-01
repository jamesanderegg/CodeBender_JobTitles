'use client';

import Chat from './components/Chat';
import Location from './components/Location';
import ResumeApp from './components/ResumeApp';

export default function Home() {
  return (
    <main className="App">
      <div className='container'>
        {/* <Location /> */}
        <ResumeApp />
        {/* <Chat /> */}
      </div>
    </main>
  )
}