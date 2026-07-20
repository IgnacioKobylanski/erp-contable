import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getTransactions } from "../../services/transaction.service";
import type { Transaction } from "../../types";
import { Spinner } from "../../components/spinner/Spinner";
import { useColumnVisibility } from "../../hooks/useColumnVisibility";
import styles from "./TransactionsPage.module.css";

type SortColumn = "id" | "date" | "description";
type SortDirection = "asc" | "desc";

const ALL_COLUMNS = ["id", "date", "description", "entries"] as const;
type ColumnKey = (typeof ALL_COLUMNS)[number];

const COLUMN_LABELS: Record<ColumnKey, string> = {
  id: "ID",
  date: "Fecha",
  description: "Descripción",
  entries: "Movimientos",
};

export function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortColumn, setSortColumn] = useState<SortColumn>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [showColumnPanel, setShowColumnPanel] = useState(false);

  const { isVisible, toggleColumn } = useColumnVisibility<ColumnKey>(
    "columns:transactions",
    ALL_COLUMNS,
  );

  useEffect(() => {
    getTransactions()
      .then(setTransactions)
      .catch(() => setError("No se pudieron cargar las transacciones."))
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

  const sortedTransactions = [...transactions].sort((a, b) => {
    let comparison: number;
    if (sortColumn === "id") {
      comparison = a.id - b.id;
    } else if (sortColumn === "date") {
      comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
    } else {
      comparison = a.description.localeCompare(b.description);
    }
    return sortDirection === "asc" ? comparison : -comparison;
  });

  const sortIndicator = (column: SortColumn) => {
    if (column !== sortColumn) return "";
    return sortDirection === "asc" ? " ▲" : " ▼";
  };

  if (loading) return <Spinner label="Cargando transacciones..." />;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1 className={styles.title}>Transacciones</h1>
      <div className="actionsRow">
        <Link className="btnPrimarySmall" to="/transactions/new">
          + Nueva transacción
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

      {transactions.length === 0 ? (
        <p className={styles.emptyState}>
          No hay transacciones cargadas todavía.
        </p>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={`${styles.table} responsiveTable`}>
            <thead>
              <tr>
                {isVisible("id") && (
                  <th className="sortable" onClick={() => handleSort("id")}>
                    ID{sortIndicator("id")}
                  </th>
                )}
                {isVisible("date") && (
                  <th className="sortable" onClick={() => handleSort("date")}>
                    Fecha{sortIndicator("date")}
                  </th>
                )}
                {isVisible("description") && (
                  <th className="sortable" onClick={() => handleSort("description")}>
                    Descripción{sortIndicator("description")}
                  </th>
                )}
                {isVisible("entries") && <th>Movimientos</th>}
              </tr>
            </thead>
            <tbody>
              {sortedTransactions.map((transaction) => (
                <tr key={transaction.id}>
                  {isVisible("id") && <td data-label="ID">{transaction.id}</td>}
                  {isVisible("date") && (
                    <td data-label="Fecha">{new Date(transaction.date).toLocaleDateString()}</td>
                  )}
                  {isVisible("description") && (
                    <td data-label="Descripción">{transaction.description}</td>
                  )}
                  {isVisible("entries") && (
                    <td data-label="Movimientos">{transaction.entries.length}</td>
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