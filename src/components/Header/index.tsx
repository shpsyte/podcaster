import styles from './styles.module.scss';
import format from 'date-fns/format';
import Link from 'next/link';
export default function Header() {
  const currentDate = format(new Date(), 'EEEEEEE, d MMMM');
  return (
    <header className={styles.headerContainer}>
      <Link href="/">
        <button type="button">
          <img src="/logo.svg" />
        </button>
      </Link>
      <p>The best for you</p>
      <span>{currentDate}</span>
    </header>
  );
}
