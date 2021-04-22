import styles from './styles.module.scss'
import format from 'date-fns/format'

export default function Header() {
  const currentDate = format(new Date(), 'EEEEEEE, d MMMM')
  return (
    <header className={styles.headerContainer}>
      <img src="/logo.svg" />
      <p>The best for you</p>
      <span>{currentDate}</span>
    </header>
  )
}
