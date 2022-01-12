import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <link rel="shortcut icon" href="/images/favicon.ico" />
        <title>MangaUpdates Bot</title>
      </Head>
      <div className={styles.top}>
        <div className={styles.title}>
          <Image src="/images/logo.png" alt="logo" width={200} height={200} />
          <div className={styles.text}>
            <h1>MangaUpdates Bot</h1>
            <h2>A nifty Discord bot that alerts you on new manga chapters.</h2>
          </div>
        </div>
        <div className={styles.nav}>
          <div className={styles.navItem}>
            <a href="https://discord.gg/UcYspqftTF">
              <Image src="/images/nav/nav1.png" alt="nav1" width={125} height={125} />
              <h2>Support</h2>
            </a>
          </div>
          <div className={styles.navItem}>
            <a href="botdocs.haysaka.moe">
              <Image src="/images/nav/nav2.png" alt="nav2" width={125} height={125} />
              <h2>Docs</h2>
            </a>
          </div>
          <div className={styles.navItem}>
            <a href="https://discord.com/oauth2/authorize?client_id=880694914365685781&scope=applications.commands%20bot&permissions=268856384">
              <Image src="/images/nav/nav3.png" alt="nav3" width={125} height={125} />
              <h2>Invite</h2>
            </a>
          </div>
        </div>
      </div>
      <div className={styles.bottom}>
        <div className={styles.card}>
          <div className={styles.info}>
            <h1>Statistics</h1>
          </div>
        </div>
      </div>
    </div>
    
  )
}

export default Home
