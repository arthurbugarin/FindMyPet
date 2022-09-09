import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useEffect, useRef, useState } from 'react'
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import { google } from '@google/maps';
import { useDeepCompareMemoize } from 'use-deep-compare-effect';
import Header from '../components/Header';
import Footer from '../components/Footer';
import React from 'react';

const Marker: React.FC<google.maps.MarkerOptions> = (options) => {
  const [marker, setMarker] = React.useState<google.maps.Marker>();
  
  React.useEffect(() => {
    if (!marker) {
      setMarker(new window.google.maps.Marker());
    }

    return () => {
      if (marker) {
        marker.setMap(null);
      }
    };
  }, [marker]);

  React.useEffect(() => {
    if (marker) {
      marker.setOptions(options);
    }
  }, [marker, options]);

  return null;
};

// this is a list of the latest ~5 occurrences reported to the app, prioritizing occurrences closest to the user if possible
// i believe it would be better if this list and the map were united into a single component, and when the user clicks on an occurrence it highlights it on the map
function OccurrenceList(props) {
  const [ occurrences, setOccurrences ] = useState([]);
  const [ loading, setLoading ] = useState(false);
  
  async function refreshOccurrenceList() {
    setLoading(true);

    try {
      const occurrenceFetchResponse = await fetch('/api/fetchRecentOccurrences');
      if (occurrenceFetchResponse.status !== 200){
        const errorMessage = await occurrenceFetchResponse.text();
        throw Error(errorMessage);
      }
      
      const newOccurrences = await occurrenceFetchResponse.json();
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
        <Map zoom={1} center={{lat: 0, lng: 0}} style={{width: '50vw', height: '70vh'}}>
          <Marker position={{lat: 0, lng: 0}} />
        </Map>
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

interface MapProps extends google.maps.MapOptions {
  style: { [key: string]: string };
  onClick?: (e: google.maps.MapMouseEvent) => void;
  onIdle?: (map: google.maps.Map) => void;
  children?: React.ReactNode;
  center: { [key: string]: number };
  zoom: number;
}

const Map: React.FC<MapProps> = ({
  onClick,
  onIdle,
  children,
  style,
  ...options
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map>();

  useEffect(() => {
    if (ref.current && !map) {
      setMap(new window.google.maps.Map(ref.current, {}));
    }
  }, [ref, map]);

  useEffect(() => {
    if (map) {
      map.setOptions(options);
    }
  }, [map, options].map(useDeepCompareMemoize));

  return (
    <>
      <div ref={ref} style={style}/>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          const new_props = { map, ...child.props };
          return React.cloneElement(child, new_props);
        }
      })}
    </>
  )
};

function Modal(props) {
  return (
    <div style={{position: 'fixed', top: 0, left: 0, display: props.visible, width: '100%', height: '100%'}} onClick={props.hide}>
      <div onClick={e => e.stopPropagation()}>
        {React.Children.map(props.children, (child) => React.cloneElement(child, {...props, ...child.props}))}
      </div>
    </div>
  ); 
}

function Form(props) {

  const [ petName, setPetName ] = useState("")
  const [ author, setAuthorName ] = useState(null);
  const [ lat, setLat ] = useState(null);
  const [ lon, setLon ] = useState(null);
  const [ petDescription, setDescription ] = useState(null);

  function handleSubmit(event) {
    event.preventDefault();
    fetch('/api/writeOccurrence', {
      method: 'POST',
      body: JSON.stringify({
        petName,
        author,
        lat,
        lon,
        petDescription,
        isAuthorsPet: false
      })
    })
    // TODO: show visual feedback to user that occurrence has been submitted successfully
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
          <input type="text" value={author} onChange={(e) => setAuthorName(e.target.value)}/>
        </label>
        <label>
          Latitude
          <input type="number" value={lat} onChange={(e) => setLat(e.target.value)}/>
        </label>
        <label>
          Longitude
          <input type="number" value={lon} onChange={(e) => setLon(e.target.value)}/>
        </label>
        <label>
          Descrição
          <input type="text" value={petDescription} onChange={(e) => setDescription(e.target.value)}/>
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
  
  return (
    <div style={{display: props.visible}}>
      <div className={styles.floatingActionMenu}>
        <button className={styles.floatingActionMenuOption} onClick={props.openFoundPetForm}>
          Perdi meu pet
        </button>
        <button className={styles.floatingActionMenuOption}>
          Encontrei um pet
        </button>
      </div>
    </div>
  )
}

function FloatingActionContainer(props) {
  const [menuVisible, setMenuVisible] = useState("none");

  return (
    <div className={styles.floatingActionContainer} onMouseLeave={() => setMenuVisible("none")}>
      <Menu visible={menuVisible} setMapStyle={props.setMapStyle} openFoundPetForm={props.openFoundPetForm}/>
      <button className={styles.floatingActionButton} onMouseEnter={() => setMenuVisible("flex")}>
        Reportar pet
      </button>
    </div>
  );
}

export default function Home() {
  const [mapStyle, setMapStyle] = useState({});
  const [modalVisible, setModalVisible] = useState("none");

  function openModal(){
    setModalVisible("block");
    setMapStyle({ zIndex: -1 });
  }

  function hideModal(){
    setModalVisible("none");
    setMapStyle({});
  }

  return (<>
    <Head>
      {/* pensando no nome ainda, por enquanto é esse */}
      <title>Find My Pet</title>
      <meta name="description" content="Pets encontrados na rua" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <Header/>

    <FloatingActionContainer setMapStyle={setMapStyle} openFoundPetForm={openModal}/>
    <Modal visible={modalVisible} hide={hideModal}>
      <Form/>
    </Modal>

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
