import { useEffect, useState } from 'react';
import { getTotals } from '../../services/reports.service';
import type { Totals } from '../../types';
import { Spinner } from '../../components/spinner/Spinner';
import styles from './DashboardPage.module.css';

export function DashboardPage() {
  const [totals, setTotals] = useState<Totals | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getTotals()
      .then(setTotals)
      .catch(() => setError('No se pudo cargar el resumen general.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner label="Cargando resumen..." />;
  if (error) return <p>{error}</p>;
  if (!totals) return null;

  return (
    <div>
      <h1 className={styles.title}>Panel General</h1>

      <div className={styles.cards}>
        <div className={styles.card}>
          <span className={styles.cardLabel}>Total Débito</span>
          <span className={styles.cardValue}>{totals.total_debit}</span>
        </div>

        <div className={styles.card}>
          <span className={styles.cardLabel}>Total Crédito</span>
          <span className={styles.cardValue}>{totals.total_credit}</span>
        </div>

        <div
          className={`${styles.card} ${
            totals.is_balanced ? styles.cardOk : styles.cardError
          }`}
        >
          <span className={styles.cardLabel}>Estado del Libro</span>
          <span className={styles.cardValue}>
            {totals.is_balanced ? '✅ Balanceado' : '⚠️ Desbalanceado'}
          </span>
        </div>
      </div>
    </div>
  );
}