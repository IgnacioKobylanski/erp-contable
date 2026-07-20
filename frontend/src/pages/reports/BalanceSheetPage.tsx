import { useEffect, useState } from 'react';
import { getBalanceSheet } from '../../services/reports.service';
import type { BalanceSheetItem } from '../../types';
import { Spinner } from '../../components/spinner/Spinner';
import { useColumnVisibility } from '../../hooks/useColumnVisibility';
import styles from './BalanceSheetPage.module.css';

type SortColumn = 'account' | 'balance';
type SortDirection = 'asc' | 'desc';

const ALL_COLUMNS = ['account', 'balance'] as const;
type ColumnKey = (typeof ALL_COLUMNS)[number];

const COLUMN_LABELS: Record<ColumnKey, string> = {
  account: 'Cuenta',
  balance: 'Saldo',
};

export function BalanceSheetPage() {
  const [items, setItems] = useState<BalanceSheetItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortColumn, setSortColumn] = useState<SortColumn>('account');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [showColumnPanel, setShowColumnPanel] = useState(false);

  const { isVisible, toggleColumn } = useColumnVisibility<ColumnKey>(
    'columns:balance-sheet',
    ALL_COLUMNS
  );

  useEffect(() => {
    getBalanceSheet()
      .then((response) => setItems(response.results))
      .catch(() => setError('No se pudo cargar el balance general.'))
      .finally(() => setLoading(false));
  }, []);

  const handleSort = (column: SortColumn) => {
    if (column === sortColumn) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const sortedItems = [...items].sort((a, b) => {
    let comparison: number;
    if (sortColumn === 'account') {
      comparison = a.account.localeCompare(b.account);
    } else {
      comparison = parseFloat(a.balance) - parseFloat(b.balance);
    }
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const sortIndicator = (column: SortColumn) => {
    if (column !== sortColumn) return '';
    return sortDirection === 'asc' ? ' ▲' : ' ▼';
  };

  if (loading) return <Spinner label="Cargando balance general..." />;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1 className={styles.title}>Balance General</h1>

      <div className="actionsRow">
        <button
          type="button"
          className="columnsButton"
          onClick={() => setShowColumnPanel((prev) => !prev)}
        >
          ⚙️ Columnas
        </button>
      </div>

      {showColumnPanel && (
        <div className="columnPanel">
          {ALL_COLUMNS.map((column) => (
            <label key={column} className="columnOption">
              <input
                type="checkbox"
                checked={isVisible(column)}
                onChange={() => toggleColumn(column)}
              />
              {COLUMN_LABELS[column]}
            </label>
          ))}
        </div>
      )}

      {items.length === 0 ? (
        <p className={styles.emptyState}>No hay cuentas con movimientos todavía.</p>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={`${styles.table} responsiveTable`}>
            <thead>
              <tr>
                {isVisible('account') && (
                  <th className="sortable" onClick={() => handleSort('account')}>
                    Cuenta{sortIndicator('account')}
                  </th>
                )}
                {isVisible('balance') && (
                  <th className="sortable" onClick={() => handleSort('balance')}>
                    Saldo{sortIndicator('balance')}
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {sortedItems.map((item) => (
                <tr key={item.account}>
                  {isVisible('account') && <td data-label="Cuenta">{item.account}</td>}
                  {isVisible('balance') && <td data-label="Saldo">{item.balance}</td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}