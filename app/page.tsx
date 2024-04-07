'use client';

// import Chat from './components/Chat';
// import Location from './components/Location';
import Image from 'next/image';
import ResumeApp from './components/ResumeApp';
import styles from './styles/Home.module.css';

export default function Home() {
  return (
    <main className={styles.App}>
      <div className='container'>
      <div className={styles.logoBox}>
              <Image src='/logo.png' alt='PathFinder logo' width='200' height='200' />
              
            </div>
        <ResumeApp />
     
      </div>
    </main>
  )
}