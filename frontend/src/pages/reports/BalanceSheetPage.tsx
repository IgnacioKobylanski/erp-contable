import { useEffect, useState } from 'react';
import { getBalanceSheet } from '../../services/reports.service';
import type { BalanceSheetItem } from '../../types';
import styles from './BalanceSheetPage.module.css';

export function BalanceSheetPage() {
  const [items, setItems] = useState<BalanceSheetItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getBalanceSheet()
      .then((response) => setItems(response.results))
      .catch(() => setError('No se pudo cargar el balance general.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Cargando balance general...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1 className={styles.title}>Balance General</h1>

      {items.length === 0 ? (
        <p className={styles.emptyState}>No hay cuentas con movimientos todavía.</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Cuenta</th>
              <th>Saldo</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.account}>
                <td>{item.account}</td>
                <td>{item.balance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}