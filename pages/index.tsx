import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useEffect, useRef, useState } from 'react'
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { google } from '@google/maps';
import { useDeepCompareMemoize } from 'use-deep-compare-effect';
import Header from '../components/Header';
import Footer from '../components/Footer';

// this is a list of the latest ~5 occurrences reported to the app, prioritizing occurrences closest to the user if possible
// i believe it would be better if this list and the map were united into a single component, and when the user clicks on an occurrence it highlights it on the map
function OccurrenceList(props) {
  const [ occurrences, setOccurrences ] = useState([{id: 0, petName: 'stale occurrence pet name', author: null, lat: 0, lon: 0, description: 'stale occurrence description', lost: 0}]);

  async function refreshOccurrenceList() {
    const newOccurrences = (await (await fetch('/api/fetchRecentOccurrences')).json()).occurrences;

    if (occurrences !== newOccurrences) {
      setOccurrences(newOccurrences);
    }
  }

  useEffect(() => {
    refreshOccurrenceList();
  }, []);

  function render(status: Status) {
    return <h1>{status}</h1>;
  };

  return (<>
    <div className="occurrence-map" style={props.mapStyle}> {/*this is a map that shows recent occurrences, prioritizing occurrences closest to the user if possible*/}
      <Wrapper apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY} render={render}>
        <Map zoom={1} center={{lat: 0, lng: 0}}/>
      </Wrapper>
    </div>
    <div className={styles.occurrencesListContainer}>
      <button className={styles.occurrencesListRefreshButton} onClick={refreshOccurrenceList}>
        Refresh
      </button>
      <ul className={styles.occurrencesList}>
        {
        occurrences.map(occurrence => {
           return (<li key={occurrence.id} className={styles.occurrence}>{occurrence.petName}</li>)
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

function Form(props) {

  const [name, setName] = useState("Nome do animal (se souber)")

  function handleChange(event) {
    setName(event.target.value)
  }

  function handleSubmit(event) {
    event.preventDefault();
    alert('sent: ' + name);
  }

  return (
    <div style={{position: 'fixed', top: 0, left: 0, display: props.visible, width: '100%', height: '100%'}} onClick={props.hide}>
      <div className={styles.form} onClick={e => e.stopPropagation()}>
        Aqui é o form : {')'}
        <form onSubmit={handleSubmit}>
          <label>
            Nome
            <input type="text" value={name} onChange={handleChange}/>
          </label>
          <input type="submit" value="Enviar"/>
        </form>
        <button onClick={props.hide}>
          Fechar
        </button>
      </div>
    </div>
  );
}

function Menu(props) {
  const [formVisible, setFormVisible] = useState("none");

  function openFoundPetForm() {
    setFormVisible("block");
    props.setMapStyle({ zIndex: -1 });
  }

  function hideFoundPetForm() {
    setFormVisible("none");
    props.setMapStyle({});
  }

  return (
    <div style={{display: props.visible}}>
      <div className={styles.floatingActionMenu}>
        <Form visible={formVisible} hide={hideFoundPetForm} />
        <button className={styles.floatingActionMenuOption} onClick={openFoundPetForm}>
          Perdi meu pet
        </button>
        <button className={styles.floatingActionMenuOption}>
          Encontrei um pet
        </button>
      </div>
    </div>
  )
}

export default function Home() {
  const [menuVisible, setMenuVisible] = useState("none");
  const [mapStyle, setMapStyle] = useState({});

  function toggleMenu() {
    if (menuVisible === "none")
      setMenuVisible("flex");
    else
      setMenuVisible("none");
  }

  return (<>
    <Head>
      {/* pensando no nome ainda, por enquanto é esse */}
      <title>Find My Pet</title>
      <meta name="description" content="Pets encontrados na rua" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <Header/>

    <div className={styles.floatingActionContainer}>
      <Menu visible={menuVisible} setMapStyle={setMapStyle}/>
      <button className={styles.floatingActionButton} onClick={toggleMenu}>
        Reportar pet
      </button>
    </div>

    <div className={styles.container}>
      <OccurrenceList mapStyle={mapStyle} />
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
