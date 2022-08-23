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
  const [ occurrences, setOccurrences ] = useState([]);
  const [ loading, setLoading ] = useState(false);
  
  async function refreshOccurrenceList() {
    setLoading(true);

    try {
      const newOccurrences = (await (await fetch('/api/fetchRecentOccurrences')).json());
      if (occurrences !== newOccurrences) {
        setOccurrences(newOccurrences);
      }
    } catch (error) {
      console.error(error);
    }
    
    
    setLoading(false);
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
      {loading ? 'Carregando...' : null}
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

function Modal(props) {
  return (
    <div style={{position: 'fixed', top: 0, left: 0, display: props.visible, width: '100%', height: '100%'}} onClick={props.hide}>
      <div onClick={e => e.stopPropagation()}>
        {props.children} 
        {/* may have to do a foreach, not sure if this works */}
      </div>
    </div>
  ); 
}

function Form(props) {

  const [ petName, setPetName ] = useState("")
  const [ authorName, setAuthorName ] = useState(null);
  const [ lat, setLat ] = useState(null);
  const [ lon, setLon ] = useState(null);
  const [ description, setDescription ] = useState(null);

  function handleSubmit(event) {
    event.preventDefault();
    alert('sent: ' + petName);
  }

  return (
    <div className={styles.form}>
      <form onSubmit={handleSubmit}>
        <label>
          Nome do pet
          <input type="text" value={petName} onChange={(e) => setPetName(e.target.value)}/>
        </label>
        <label>
          Seu nome
          <input type="text" value={authorName} onChange={(e) => setAuthorName(e.target.value)}/>
        </label>
        <input type="submit" value="Enviar"/>
      </form>
      <button onClick={props.hide}>
        Fechar
      </button>
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
        <Modal visible={formVisible} hide={hideFoundPetForm}>
          <Form visible={formVisible} hide={hideFoundPetForm} />
        </Modal>
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

    <div className={styles.floatingActionContainer} onMouseLeave={toggleMenu}>
      <Menu visible={menuVisible} setMapStyle={setMapStyle}/>
      <button className={styles.floatingActionButton} onMouseEnter={toggleMenu}>
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
