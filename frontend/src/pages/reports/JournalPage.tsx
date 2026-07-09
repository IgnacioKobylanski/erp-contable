import { useEffect, useState } from 'react';
import { getJournal } from '../../services/reports.service';
import type { JournalRecord } from '../../types';
import styles from './JournalPage.module.css';

export function JournalPage() {
  const [records, setRecords] = useState<JournalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getJournal()
      .then((response) => setRecords(response.results))
      .catch(() => setError('No se pudo cargar el libro diario.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Cargando libro diario...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1 className={styles.title}>Libro Diario</h1>

      {records.length === 0 ? (
        <p className={styles.emptyState}>No hay transacciones registradas todavía.</p>
      ) : (
        records.map((record) => (
          <div key={record.transaction_id} className={styles.record}>
            <div className={styles.recordHeader}>
              {record.description}{' '}
              <span className={styles.recordId}>
                #{record.transaction_id} — {new Date(record.date).toLocaleDateString()}
              </span>
            </div>
            <table className={styles.table}>
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
                    <td>{entry.account}</td>
                    <td className={entry.type === 'debit' ? styles.debit : styles.credit}>
                      {entry.type === 'debit' ? 'Débito' : 'Crédito'}
                    </td>
                    <td>{entry.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      )}
    </div>
  );
}