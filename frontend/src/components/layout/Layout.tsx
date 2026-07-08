import { Outlet, Link } from 'react-router-dom';
import styles from './Layout.module.css';

export function Layout() {
  return (
    <div>
      <header className={styles.header}>
        <nav className={styles.nav}>
          <Link className={styles.navLink} to="/accounts">Cuentas</Link>
          <Link className={styles.navLink} to="/transactions">Transacciones</Link>
          <Link className={styles.navLink} to="/reports/journal">Libro Diario</Link>
          <Link className={styles.navLink} to="/reports/ledger">Libro Mayor</Link>
          <Link className={styles.navLink} to="/reports/balance-sheet">Balance General</Link>
          <Link className={styles.navLink} to="/reports/income-statement">Estado de Resultados</Link>
        </nav>
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}