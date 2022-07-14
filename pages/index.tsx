import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import styles from '../styles/Home.module.css'
import headerstyles from '../styles/header.module.css'
import { useState } from 'react'

function Header(props) {
  return (<div className={headerstyles.header}>
    <p>
      hello i am header.
    </p>
    <Link href="#">
      <a>
        Encontrei um pet
      </a>
    </Link>
    <Link href="#">
      <a>
        Perdi meu pet
      </a>
    </Link>
    <Link href="#">
      <a>
        Me avise sobre pets perdidos na minha área
      </a>
    </Link>
  </div>)
}

function OccurrenceList(props) {
  const [ occurrences, setOccurrences ] = useState(['occurrence1', 'occurrence2']);

  return (
    <div className="occurrence-list">
      <p>
      this is a list of the latest ~5 occurrences reported to the app, prioritizing occurrences closest to the user if possible
      </p>
      {
      occurrences.map((occurrence, index) => {
         return (<li key={index}>{occurrence}</li>)
      })
      }
    </div>)
}

function GMap(props) {
  return (
    <p>
    this is a map that shows recent occurrences, prioritizing occurrences closest to the user if possible
    </p>)
}

function Footer() {
  return (<p>
  this will show some information about the app, maybe a few links related to pet adoption centers, animal rescue organizations, etc
  </p>)
}


export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        {/* pensando no nome ainda, por enquanto é esse */}
        <title>Find My Pet</title>
        <meta name="description" content="Pets encontrados na rua" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header></Header>
      <OccurrenceList></OccurrenceList>
      <GMap></GMap>
      <Footer></Footer>



      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="https://nextjs.org">Next.js!</a>
        </h1>

        <p className={styles.description}>
          Get started by editing{' '}
          <code className={styles.code}>pages/index.js</code>
        </p>

        <div className={styles.grid}>
          <a href="https://nextjs.org/docs" className={styles.card}>
            <h2>Documentation &rarr;</h2>
            <p>Find in-depth information about Next.js features and API.</p>
          </a>

          <a href="https://nextjs.org/learn" className={styles.card}>
            <h2>Learn &rarr;</h2>
            <p>Learn about Next.js in an interactive course with quizzes!</p>
          </a>

          <a
            href="https://github.com/vercel/next.js/tree/canary/examples"
            className={styles.card}
          >
            <h2>Examples &rarr;</h2>
            <p>Discover and deploy boilerplate example Next.js projects.</p>
          </a>

          <a
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            className={styles.card}
          >
            <h2>Deploy &rarr;</h2>
            <p>
              Instantly deploy your Next.js site to a public URL with Vercel.
            </p>
          </a>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}
