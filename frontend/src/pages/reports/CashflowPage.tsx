import { useEffect, useState } from 'react';
import { getCashflow } from '../../services/reports.service';
import type { Cashflow } from '../../types';
import { Spinner } from '../../components/spinner/Spinner';
import styles from './CashflowPage.module.css';

export function CashflowPage() {
  const [cashflow, setCashflow] = useState<Cashflow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const fetchData = (from?: string, to?: string) => {
    setLoading(true);
    getCashflow({ dateFrom: from, dateTo: to })
      .then(setCashflow)
      .catch(() => setError('No se pudo cargar el flujo de efectivo.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFilter = () => fetchData(dateFrom, dateTo);
  const handleClear = () => {
    setDateFrom('');
    setDateTo('');
    fetchData();
  };

  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1 className={styles.title}>Flujo de Efectivo</h1>

      <div className={styles.filterRow}>
        <div className={styles.filterField}>
          <label className={styles.filterLabel} htmlFor="dateFrom">Desde</label>
          <input id="dateFrom" className={styles.dateInput} type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
        </div>
        <div className={styles.filterField}>
          <label className={styles.filterLabel} htmlFor="dateTo">Hasta</label>
          <input id="dateTo" className={styles.dateInput} type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
        </div>
        <button type="button" className="btnPrimary" onClick={handleFilter}>Filtrar</button>
        <button type="button" className="btnSecondary" onClick={handleClear}>Limpiar</button>
      </div>

      {loading ? (
        <Spinner label="Cargando flujo de efectivo..." />
      ) : !cashflow ? null : (
        <>
          <div className={styles.summaryCards}>
            <div className={styles.card}>
              <span className={styles.cardLabel}>Saldo Inicial</span>
              <span className={styles.cardValue}>{cashflow.opening_balance}</span>
            </div>
            <div className={`${styles.card} ${styles.cardIn}`}>
              <span className={styles.cardLabel}>Entradas</span>
              <span className={styles.cardValue}>{cashflow.total_in}</span>
            </div>
            <div className={`${styles.card} ${styles.cardOut}`}>
              <span className={styles.cardLabel}>Salidas</span>
              <span className={styles.cardValue}>{cashflow.total_out}</span>
            </div>
            <div className={styles.card}>
              <span className={styles.cardLabel}>Saldo Final</span>
              <span className={styles.cardValue}>{cashflow.closing_balance}</span>
            </div>
          </div>

          {cashflow.movements.length === 0 ? (
            <p className={styles.emptyState}>No hay movimientos de efectivo para mostrar.</p>
          ) : (
            <div className={styles.tableWrapper}>
              <table className={`${styles.table} responsiveTable`}>
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Descripción</th>
                    <th>Cuenta</th>
                    <th>Tipo</th>
                    <th>Monto</th>
                    <th>Saldo</th>
                  </tr>
                </thead>
                <tbody>
                  {cashflow.movements.map((movement, index) => (
                    <tr key={index}>
                      <td data-label="Fecha">{new Date(movement.date).toLocaleDateString()}</td>
                      <td data-label="Descripción">{movement.description}</td>
                      <td data-label="Cuenta">{movement.account}</td>
                      <td data-label="Tipo" className={movement.type === 'debit' ? styles.in : styles.out}>
                        {movement.type === 'debit' ? 'Entrada' : 'Salida'}
                      </td>
                      <td data-label="Monto">{movement.amount}</td>
                      <td data-label="Saldo">{movement.running_balance}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}