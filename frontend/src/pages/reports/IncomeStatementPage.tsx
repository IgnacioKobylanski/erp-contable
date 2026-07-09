import { useEffect, useState } from 'react';
import { getIncomeStatement } from '../../services/reports.service';
import type { IncomeStatement } from '../../types';
import styles from './IncomeStatementPage.module.css';

export function IncomeStatementPage() {
  const [statement, setStatement] = useState<IncomeStatement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getIncomeStatement()
      .then(setStatement)
      .catch(() => setError('No se pudo cargar el estado de resultados.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Cargando estado de resultados...</p>;
  if (error) return <p>{error}</p>;
  if (!statement) return <p>No hay datos disponibles.</p>;

  const isGain = parseFloat(statement.net_result) >= 0;

  return (
    <div>
      <h1 className={styles.title}>Estado de Resultados</h1>
      <table className={styles.table}>
        <tbody>
          <tr>
            <td>Total Ingresos</td>
            <td>{statement.total_income}</td>
          </tr>
          <tr>
            <td>Total Egresos</td>
            <td>{statement.total_expense}</td>
          </tr>
          <tr className={styles.netResultRow}>
            <td>Resultado Neto</td>
            <td className={isGain ? styles.gain : styles.loss}>
              {statement.net_result} {isGain ? '📈 Ganancia' : '📉 Pérdida'}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}