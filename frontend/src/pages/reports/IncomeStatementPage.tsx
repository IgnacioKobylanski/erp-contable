import { useEffect, useState } from 'react';
import { getIncomeStatement } from '../../services/reports.service';
import type { IncomeStatement, ExpenseAccount } from '../../types';
import { Spinner } from '../../components/spinner/Spinner';
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

  if (loading) return <Spinner label="Cargando estado de resultados..." />;
  if (error) return <p>{error}</p>;
  if (!statement) return null;

  const isGain = parseFloat(statement.net_result) >= 0;

  const fixedExpenses = statement.expense_accounts.filter((e) => e.expense_nature === 'Fijo');
  const variableExpenses = statement.expense_accounts.filter((e) => e.expense_nature === 'Variable');
  const unclassifiedExpenses = statement.expense_accounts.filter((e) => !e.expense_nature);

  const renderExpenseGroup = (title: string, accounts: ExpenseAccount[], total: string) => (
    <div className={styles.expenseGroup}>
      <h3 className={styles.expenseGroupTitle}>{title}</h3>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Cuenta</th>
            <th>Monto</th>
            <th>%</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((item) => (
            <tr key={item.account}>
              <td data-label="Cuenta">{item.account}</td>
              <td data-label="Monto">{item.amount}</td>
              <td data-label="%">{item.percentage}%</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td>Subtotal</td>
            <td colSpan={2}>{total}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );

  return (
    <div>
      <h1 className={styles.title}>Estado de Resultados</h1>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Ingresos</h2>
        {statement.income_accounts.length === 0 ? (
          <p className={styles.emptyState}>Sin movimientos.</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Cuenta</th>
                <th>Monto</th>
                <th>%</th>
              </tr>
            </thead>
            <tbody>
              {statement.income_accounts.map((item) => (
                <tr key={item.account}>
                  <td data-label="Cuenta">{item.account}</td>
                  <td data-label="Monto">{item.amount}</td>
                  <td data-label="%">{item.percentage}%</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td>Total</td>
                <td colSpan={2}>{statement.total_income}</td>
              </tr>
            </tfoot>
          </table>
        )}
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Egresos</h2>

        {fixedExpenses.length > 0 && renderExpenseGroup('Gastos Fijos', fixedExpenses, statement.total_fixed_expense)}
        {variableExpenses.length > 0 && renderExpenseGroup('Gastos Variables', variableExpenses, statement.total_variable_expense)}
        {unclassifiedExpenses.length > 0 &&
          renderExpenseGroup(
            'Sin clasificar',
            unclassifiedExpenses,
            (
              parseFloat(statement.total_expense) -
              parseFloat(statement.total_fixed_expense) -
              parseFloat(statement.total_variable_expense)
            ).toFixed(2)
          )}

        <div className={styles.expenseTotal}>
          <span>Total Egresos</span>
          <span>{statement.total_expense}</span>
        </div>
      </div>

      <div className={`${styles.netResult} ${isGain ? styles.netResultGain : styles.netResultLoss}`}>
        <span>Resultado Neto</span>
        <span>
          {statement.net_result} {isGain ? '📈 Ganancia' : '📉 Pérdida'}
        </span>
      </div>
    </div>
  );
}