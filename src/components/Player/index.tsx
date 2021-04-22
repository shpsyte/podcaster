import styles from './styles.module.scss'
import format from 'date-fns/format'

export default function Player() {
  return (
   <div className={styles.playerContainer}>
     <header>
       <img src="/playing.svg"></img>
       <strong>Tovando agora</strong>
     </header>
     <div className={styles.emptyPlayer}>
       <strong>Selecione um pocadast para ouvir</strong>

     </div>
     <footer className={styles.empty}>
       <div className={`${styles.progress}`}>
         <span>00:00</span>
         <div className={styles.slider}>
          <div className={styles.emptySlider} />

         </div>
         <span>00:00</span>
       </div>
       <div className={styles.buttons}>
         <button type="button">
           <img src="/shuffle.svg"></img>
         </button>
         <button type="button">
           <img src="/play-previous.svg"></img>
         </button>
         <button type="button" className={styles.playButton}>
           <img src="/play.svg"></img>
         </button>
         <button type="button">
           <img src="/play-next.svg"></img>
         </button>
         <button type="button">
           <img src="/repeat.svg"></img>
         </button>

       </div>

     </footer>


   </div>
  )
}
