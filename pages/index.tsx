import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import styles from '../styles/Home.module.css'
import headerstyles from '../styles/header.module.css'
import { useEffect, useRef, useState } from 'react'
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { google } from '@google/maps';
import { useDeepCompareMemoize } from 'use-deep-compare-effect';

function Header(props) {
  return (<div className={headerstyles.header}>
    <div className={headerstyles.logo}>
      Logo
    </div>
    <div className={headerstyles.linksContainer}>
      <Link href="#">
        <a className={headerstyles.link}>
          Encontrei um pet {/*Ia ser interessante se esses dois itens fossem "animais encontrados" e "animais perdidos",
                              e esses "encontrei/perdi um pet" fossem botões na tela que permitissem criar uma occurrence*/}
        </a>
      </Link>
      <Link href="#">
        <a className={headerstyles.link}>
          Perdi meu pet
        </a>
      </Link>
      <Link href="#">
        <a className={headerstyles.link}>
          Me avise sobre pets perdidos na minha área
        </a>
      </Link>
      <Link href="#">
        <a className={headerstyles.link}>
          Imprimir pôster de animal perdido
        </a>
      </Link>
    </div>
  </div>)
}

// this is a list of the latest ~5 occurrences reported to the app, prioritizing occurrences closest to the user if possible
// i believe it would be better if this list and the map were united into a single component, and when the user clicks on an occurrence it highlights it on the map
function OccurrenceList(props) {
  const [ occurrences, setOccurrences ] = useState([{id: 0, petName: 'stale occurrence pet name', author: null, lat: 0, lon: 0, description: 'stale occurrence description', lost: 0}]);


  async function refreshOccurrenceList() {
    const newOccurrences = (await (await fetch('/api/fetchRecentOccurrences')).json()).occurrences;

    if (occurrences !== newOccurrences) {
      setOccurrences(newOccurrences);
    }
    return null;
  }

  function render(status: Status) {
    return <h1>{status}</h1>;
  };

  return (<>
    <div className="occurrence-map"> {/*this is a map that shows recent occurrences, prioritizing occurrences closest to the user if possible*/}
      <Wrapper apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY} render={render}>
        <Map zoom={1} center={{lat: 0, lng: 0}}/>
      </Wrapper>
    </div>
    <div className="occurrence-list" style={{width:'100%'}}>
      <button onClick={refreshOccurrenceList}>
        Refresh
      </button>
      <ul style={{listStyleType: 'none', padding: 0, margin: '1rem 0'}}>
        {
        occurrences.map(occurrence => {
           return (<li key={occurrence.id} style={{padding: '1rem', margin: '1rem', width: '100%', height: '4rem', backgroundColor: 'hsl(203, 63%, 20%)', borderRadius: '10px'}}>{occurrence.petName}</li>)
        })
        }
      </ul>
    </div>
  </>)
}

function Map(props) {
  const ref = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map>();

  useEffect(() => {
    if (ref.current && !map) {
      setMap(new window.google.maps.Map(ref.current, {}));
    }
  }, [ref, map]);

  useEffect(() => {
    if (map) {
      map.setOptions(props);
    }
  }, [map, props].map(useDeepCompareMemoize));

  return <div ref={ref} style={{width: '50vw', height: '70vh'}}/>
};

function Footer() {
  return (<p>
  this will show some information about the app, maybe a few links related to pet adoption centers, animal rescue organizations, etc
  </p>)
}


export default function Home() {
  return (<>
    <Header/>
    <div className={styles.container}>
      <Head>
        {/* pensando no nome ainda, por enquanto é esse */}
        <title>Find My Pet</title>
        <meta name="description" content="Pets encontrados na rua" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <OccurrenceList></OccurrenceList>

    </div>
    <Footer/>
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
  </>
  )
}
