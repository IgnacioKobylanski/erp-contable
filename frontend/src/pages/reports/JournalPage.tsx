import { useEffect, useState } from 'react';
import { getJournal } from '../../services/reports.service';
import type { JournalRecord } from '../../types';
import { Spinner } from '../../components/spinner/Spinner';
import styles from './JournalPage.module.css';

export function JournalPage() {
  const [records, setRecords] = useState<JournalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const fetchData = (from?: string, to?: string) => {
    setLoading(true);
    getJournal({ dateFrom: from, dateTo: to })
      .then((response) => setRecords(response.results))
      .catch(() => setError('No se pudo cargar el libro diario.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFilter = () => {
    fetchData(dateFrom, dateTo);
  };

  const handleClear = () => {
    setDateFrom('');
    setDateTo('');
    fetchData();
  };

  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1 className={styles.title}>Libro Diario</h1>

      <div className={styles.filters}>
        <div className={styles.filterField}>
          <label className={styles.filterLabel} htmlFor="dateFrom">Desde</label>
          <input
            id="dateFrom"
            className={styles.dateInput}
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />
        </div>
        <div className={styles.filterField}>
          <label className={styles.filterLabel} htmlFor="dateTo">Hasta</label>
          <input
            id="dateTo"
            className={styles.dateInput}
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
          />
        </div>
        <button type="button" className="btnPrimary" onClick={handleFilter}>
          Filtrar
        </button>
        <button type="button" className="btnSecondary" onClick={handleClear}>
          Limpiar
        </button>
      </div>

      {loading ? (
        <Spinner label="Cargando libro diario..." />
      ) : records.length === 0 ? (
        <p className={styles.emptyState}>No hay transacciones para mostrar.</p>
      ) : (
        records.map((record) => (
          <div key={record.transaction_id} className={styles.record}>
            <div className={styles.recordHeader}>
              {record.description}{' '}
              <span className={styles.recordId}>
                #{record.transaction_id} — {new Date(record.date).toLocaleDateString()}
              </span>
            </div>
            <div className={styles.tableWrapper}>
              <table className={`${styles.table} responsiveTable`}>
                <thead>
                  <tr>
                    <th>Cuenta</th>
                    <th>Tipo</th>
                    <th>Monto</th>
                  </tr>
                </thead>
                <tbody>
                  {record.entries.map((entry, index) => (
                    <tr key={index}>
                      <td data-label="Cuenta">{entry.account}</td>
                      <td data-label="Tipo" className={entry.type === 'debit' ? styles.debit : styles.credit}>
                        {entry.type === 'debit' ? 'Débito' : 'Crédito'}
                      </td>
                      <td data-label="Monto">{entry.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))
      )}
    </div>
  );
}