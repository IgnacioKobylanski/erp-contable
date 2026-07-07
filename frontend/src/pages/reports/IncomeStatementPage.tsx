import { useEffect, useState } from 'react';
import { getIncomeStatement } from '../../services/reports.service';
import type { IncomeStatement } from '../../types';

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

  return (
    <div>
      <h1>Estado de Resultados</h1>
      <table>
        <tbody>
          <tr>
            <td>Total Ingresos</td>
            <td>{statement.total_income}</td>
          </tr>
          <tr>
            <td>Total Egresos</td>
            <td>{statement.total_expense}</td>
          </tr>
          <tr>
            <td><strong>Resultado Neto</strong></td>
            <td>
              <strong>{statement.net_result}</strong>
              {' '}
              {parseFloat(statement.net_result) >= 0 ? '📈 Ganancia' : '📉 Pérdida'}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}