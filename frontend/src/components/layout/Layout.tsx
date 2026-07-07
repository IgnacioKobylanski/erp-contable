import { Outlet, Link } from 'react-router-dom';

export function Layout() {
  return (
    <div>
      <nav>
        <Link to="/accounts">Cuentas</Link>
        <Link to="/transactions">Transacciones</Link>
        <Link to="/reports/journal">Libro Diario</Link>
        <Link to="/reports/ledger">Libro Mayor</Link>
        <Link to="/reports/balance-sheet">Balance General</Link>
        <Link to="/reports/income-statement">Estado de Resultados</Link>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
}