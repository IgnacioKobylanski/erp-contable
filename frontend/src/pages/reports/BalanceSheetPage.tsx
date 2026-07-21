import { useEffect, useState } from 'react';
import { getBalanceSheet } from '../../services/reports.service';
import type { BalanceSheetItem } from '../../types';
import { Spinner } from '../../components/spinner/Spinner';
import { useColumnConfig } from '../../hooks/useColumnConfig';
import { ColumnConfigPanel } from '../../components/columnPanel/ColumnConfigPanel';
import styles from './BalanceSheetPage.module.css';

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
  const [sortColumn, setSortColumn] = useState<ColumnKey>('account');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [showColumnPanel, setShowColumnPanel] = useState(false);

  const { order, isVisible, toggleColumn, moveColumn, resetConfig } =
    useColumnConfig<ColumnKey>('columns:balance-sheet', ALL_COLUMNS);

  useEffect(() => {
    getBalanceSheet()
      .then((response) => setItems(response.results))
      .catch(() => setError('No se pudo cargar el balance general.'))
      .finally(() => setLoading(false));
  }, []);

  const handleSort = (column: ColumnKey) => {
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

  const sortIndicator = (column: ColumnKey) => {
    if (column !== sortColumn) return '';
    return sortDirection === 'asc' ? ' ▲' : ' ▼';
  };

  const renderCell = (column: ColumnKey, item: BalanceSheetItem) => {
    switch (column) {
      case 'account':
        return <td key={column} data-label="Cuenta">{item.account}</td>;
      case 'balance':
        return <td key={column} data-label="Saldo">{item.balance}</td>;
    }
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
        <ColumnConfigPanel
          order={order}
          labels={COLUMN_LABELS}
          isVisible={isVisible}
          toggleColumn={toggleColumn}
          moveColumn={moveColumn}
          resetConfig={resetConfig}
        />
      )}

      {items.length === 0 ? (
        <p className={styles.emptyState}>No hay cuentas con movimientos todavía.</p>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={`${styles.table} responsiveTable`}>
            <thead>
              <tr>
                {order.filter(isVisible).map((column) => (
                  <th key={column} className="sortable" onClick={() => handleSort(column)}>
                    {COLUMN_LABELS[column]}{sortIndicator(column)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedItems.map((item) => (
                <tr key={item.account}>
                  {order.filter(isVisible).map((column) => renderCell(column, item))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}