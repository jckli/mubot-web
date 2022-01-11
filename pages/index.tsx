import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <Image src="/images/logo.png" alt="logo" width={200} height={200} />
        <div className={styles.text}>
          <h1>MangaUpdates Bot</h1>
          <h2>A nifty Discord bot that alerts you on new manga chapters.</h2>
        </div>
      </div>
      <div className={styles.nav}>
        <a href="https://discord.gg/UcYspqftTF">Support</a>
      </div>
    </div>
  )
}

export default Home
