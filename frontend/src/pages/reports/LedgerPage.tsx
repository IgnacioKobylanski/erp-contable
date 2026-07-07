import { useEffect, useState } from 'react';
import { getLedger } from '../../services/reports.service';
import type { LedgerRecord } from '../../types';

export function LedgerPage() {
  const [records, setRecords] = useState<LedgerRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getLedger()
      .then((response) => setRecords(response.results))
      .catch(() => setError('No se pudo cargar el libro mayor.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Cargando libro mayor...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Libro Mayor</h1>

      {records.length === 0 ? (
        <p>No hay movimientos registrados todavía.</p>
      ) : (
        records.map((record) => (
          <div key={record.account}>
            <h3>{record.account}</h3>
            {record.entries.length === 0 ? (
              <p>Sin movimientos.</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Descripción</th>
                    <th>Tipo</th>
                    <th>Monto</th>
                  </tr>
                </thead>
                <tbody>
                  {record.entries.map((entry, index) => (
                    <tr key={index}>
                      <td>{new Date(entry.date).toLocaleDateString()}</td>
                      <td>{entry.description}</td>
                      <td>{entry.type === 'debit' ? 'Débito' : 'Crédito'}</td>
                      <td>{entry.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        ))
      )}
    </div>
  );
}