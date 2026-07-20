import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAccounts } from "../../services/account.service";
import type { Account } from "../../types";
import {
  accountTypeColorClass,
  accountTypeLabel,
} from "../../utils/accountStyles";
import { Spinner } from "../../components/spinner/Spinner";
import { useColumnVisibility } from "../../hooks/useColumnVisibility";
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

  const { isVisible, toggleColumn } = useColumnVisibility<ColumnKey>(
    "columns:accounts",
    ALL_COLUMNS,
  );

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

      {accounts.length === 0 ? (
        <p className={styles.emptyState}>No hay cuentas cargadas todavía.</p>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={`${styles.table} responsiveTable`}>
            <thead>
              <tr>
                {isVisible("code") && (
                  <th className="sortable" onClick={() => handleSort("code")}>
                    Código{sortIndicator("code")}
                  </th>
                )}
                {isVisible("name") && (
                  <th className="sortable" onClick={() => handleSort("name")}>
                    Nombre{sortIndicator("name")}
                  </th>
                )}
                {isVisible("type") && (
                  <th className="sortable" onClick={() => handleSort("type")}>
                    Tipo{sortIndicator("type")}
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {sortedAccounts.map((account) => (
                <tr key={account.id}>
                  {isVisible("code") && (
                    <td data-label="Código">{account.code}</td>
                  )}
                  {isVisible("name") && (
                    <td data-label="Nombre">{account.name}</td>
                  )}
                  {isVisible("type") && (
                    <td data-label="Tipo">
                      <span
                        className={`typeBadge ${accountTypeColorClass[account.type]}`}
                      >
                        {accountTypeLabel[account.type]}
                      </span>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}