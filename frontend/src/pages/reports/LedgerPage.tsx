import { useEffect, useState } from 'react';
import { getLedger } from '../../services/reports.service';
import type { LedgerRecord } from '../../types';
import { Spinner } from '../../components/spinner/Spinner';
import styles from './LedgerPage.module.css';

export function LedgerPage() {
  const [records, setRecords] = useState<LedgerRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const fetchData = (from?: string, to?: string) => {
    setLoading(true);
    getLedger({ dateFrom: from, dateTo: to })
      .then((response) => setRecords(response.results))
      .catch(() => setError('No se pudo cargar el libro mayor.'))
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
      <h1 className={styles.title}>Libro Mayor</h1>

      <div className={styles.filters}>
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
        <Spinner label="Cargando libro mayor..." />
      ) : records.length === 0 ? (
        <p className={styles.emptyState}>No hay movimientos para mostrar.</p>
      ) : (
        records.map((record) => (
          <div key={record.account} className={styles.record}>
            <div className={styles.recordHeader}>{record.account}</div>
            {dateFrom && (
              <div className={styles.openingBalance}>
                Saldo inicial: {record.opening_balance}
              </div>
            )}
            {record.entries.length === 0 ? (
              <p className={styles.noEntries}>Sin movimientos en el período.</p>
            ) : (
              <div className={styles.tableWrapper}>
                <table className={`${styles.table} responsiveTable`}>
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Descripción</th>
                      <th>Tipo</th>
                      <th>Monto</th>
                      <th>Saldo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {record.entries.map((entry, index) => (
                      <tr key={index}>
                        <td data-label="Fecha">{new Date(entry.date).toLocaleDateString()}</td>
                        <td data-label="Descripción">{entry.description}</td>
                        <td data-label="Tipo" className={entry.type === 'debit' ? styles.debit : styles.credit}>
                          {entry.type === 'debit' ? 'Débito' : 'Crédito'}
                        </td>
                        <td data-label="Monto">{entry.amount}</td>
                        <td data-label="Saldo">{entry.running_balance}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}