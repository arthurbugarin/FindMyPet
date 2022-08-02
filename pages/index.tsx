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
    <div style={{display: props.visible}}>
      <div style={{position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', width: '300px', height:'300px', border: '3px solid black', borderRadius: '1rem', zIndex: '2', padding: '1rem'}}>
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

export default function Home() {
  const [formVisible, setFormVisible] = useState("none");

  function openFoundPetForm() {
    setFormVisible("block");
  }

  function hideFoundPetForm() {
    setFormVisible("none");
  }

  function openLostPetForm() {

  }

  return (<>
    <Head>
      {/* pensando no nome ainda, por enquanto é esse */}
      <title>Find My Pet</title>
      <meta name="description" content="Pets encontrados na rua" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <Header/>

    <Form visible={formVisible} hide={hideFoundPetForm} />
    <button onClick={openFoundPetForm} style={{position: 'fixed', bottom: '3rem', right: '3rem', width: '60px', height: '60px', borderRadius: '50%'}}>
      Achei um pet
    </button>
    <button onClick={openLostPetForm}>
      Perdi meu pet
    </button>

    <div className={styles.container}>
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
