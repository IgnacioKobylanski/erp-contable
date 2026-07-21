import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAccounts } from "../../services/account.service";
import type { Account } from "../../types";
import {
  accountTypeColorClass,
  accountTypeLabel,
} from "../../utils/accountStyles";
import { Spinner } from "../../components/spinner/Spinner";
import { useColumnConfig } from "../../hooks/useColumnConfig";
import { ColumnConfigPanel } from "../../components/columnPanel/ColumnConfigPanel";
import styles from "./AccountsPage.module.css";

type SortColumn = "code" | "name" | "type";
type SortDirection = "asc" | "desc";

const ALL_COLUMNS = ["code", "name", "type"] as const;
type ColumnKey = (typeof ALL_COLUMNS)[number];

const COLUMN_LABELS: Record<ColumnKey, string> = {
  code: "Código",
  name: "Nombre",
  type: "Tipo",
};

export function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortColumn, setSortColumn] = useState<SortColumn>("code");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [showColumnPanel, setShowColumnPanel] = useState(false);

  const { order, isVisible, toggleColumn, moveColumn, resetConfig } =
    useColumnConfig<ColumnKey>("columns:accounts", ALL_COLUMNS);

  useEffect(() => {
    getAccounts()
      .then(setAccounts)
      .catch(() => setError("No se pudieron cargar las cuentas."))
      .finally(() => setLoading(false));
  }, []);

  const handleSort = (column: SortColumn) => {
    if (column === sortColumn) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const sortedAccounts = [...accounts].sort((a, b) => {
    const valueA = a[sortColumn];
    const valueB = b[sortColumn];
    const comparison = valueA.localeCompare(valueB);
    return sortDirection === "asc" ? comparison : -comparison;
  });

  const sortIndicator = (column: SortColumn) => {
    if (column !== sortColumn) return "";
    return sortDirection === "asc" ? " ▲" : " ▼";
  };

  const renderCell = (column: ColumnKey, account: Account) => {
    switch (column) {
      case "code":
        return (
          <td key={column} data-label="Código">
            {account.code}
          </td>
        );
      case "name":
        return (
          <td key={column} data-label="Nombre">
            {account.name}
          </td>
        );
      case "type":
        return (
          <td key={column} data-label="Tipo">
            <span
              className={`typeBadge ${accountTypeColorClass[account.type]}`}
            >
              {accountTypeLabel[account.type]}
            </span>
          </td>
        );
    }
  };

  if (loading) return <Spinner label="Cargando cuentas..." />;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1 className={styles.title}>Plan de Cuentas</h1>
      <div className="actionsRow">
        <Link className="btnPrimarySmall" to="/accounts/new">
          + Nueva cuenta
        </Link>
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

      {accounts.length === 0 ? (
        <p className={styles.emptyState}>No hay cuentas cargadas todavía.</p>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={`${styles.table} responsiveTable`}>
            <thead>
              <tr>
                {order.filter(isVisible).map((column) => (
                  <th
                    key={column}
                    className="sortable"
                    onClick={() => handleSort(column)}
                  >
                    {COLUMN_LABELS[column]}
                    {sortIndicator(column)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedAccounts.map((account) => (
                <tr key={account.id}>
                  {order
                    .filter(isVisible)
                    .map((column) => renderCell(column, account))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
