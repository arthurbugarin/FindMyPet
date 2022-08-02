import Link from 'next/link'
import styles from '../styles/Header.module.css'

export default function Header() {
    return (<div className={styles.header}>
      <div className={styles.logo}>
        Logo
      </div>
      <div className={styles.linksContainer}>
        <Link href="#">
          <a className={styles.link}>
            Encontrei um pet {/*Ia ser interessante se esses dois itens fossem "animais encontrados" e "animais perdidos",
                                e esses "encontrei/perdi um pet" fossem botões na tela que permitissem criar uma occurrence*/}
          </a>
        </Link>
        <Link href="#">
          <a className={styles.link}>
            Perdi meu pet
          </a>
        </Link>
        <Link href="#">
          <a className={styles.link}>
            Me avise sobre pets perdidos na minha área
          </a>
        </Link>
        <Link href="#">
          <a className={styles.link}>
            Imprimir pôster de animal perdido
          </a>
        </Link>
      </div>
    </div>)
  }