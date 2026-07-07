import { useEffect, useState } from 'react';
import { getJournal } from '../../services/reports.service';
import type { JournalRecord } from '../../types';

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
      <h1>Libro Diario</h1>

      {records.length === 0 ? (
        <p>No hay transacciones registradas todavía.</p>
      ) : (
        records.map((record) => (
          <div key={record.transaction_id}>
            <h3>
              #{record.transaction_id} — {record.description} —{' '}
              {new Date(record.date).toLocaleDateString()}
            </h3>
            <table>
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
                    <td>{entry.type === 'debit' ? 'Débito' : 'Crédito'}</td>
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