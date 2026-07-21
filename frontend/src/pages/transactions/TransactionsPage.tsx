import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getTransactions } from "../../services/transaction.service";
import type { Transaction } from "../../types";
import { Spinner } from "../../components/spinner/Spinner";
import { useColumnConfig } from "../../hooks/useColumnConfig";
import { ColumnConfigPanel } from "../../components/columnPanel/ColumnConfigPanel";
import styles from "./TransactionsPage.module.css";

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
  const [sortColumn, setSortColumn] = useState<ColumnKey>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [showColumnPanel, setShowColumnPanel] = useState(false);

  const { order, isVisible, toggleColumn, moveColumn, resetConfig } =
    useColumnConfig<ColumnKey>("columns:transactions", ALL_COLUMNS);

  useEffect(() => {
    getTransactions()
      .then(setTransactions)
      .catch(() => setError("No se pudieron cargar las transacciones."))
      .finally(() => setLoading(false));
  }, []);

  const handleSort = (column: ColumnKey) => {
    if (column === "entries") return; // no tiene sentido ordenar por esta columna
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
    } else if (sortColumn === "description") {
      comparison = a.description.localeCompare(b.description);
    } else {
      comparison = 0;
    }
    return sortDirection === "asc" ? comparison : -comparison;
  });

  const sortIndicator = (column: ColumnKey) => {
    if (column !== sortColumn) return "";
    return sortDirection === "asc" ? " ▲" : " ▼";
  };

  const renderCell = (column: ColumnKey, transaction: Transaction) => {
    switch (column) {
      case "id":
        return <td key={column} data-label="ID">{transaction.id}</td>;
      case "date":
        return (
          <td key={column} data-label="Fecha">
            {new Date(transaction.date).toLocaleDateString()}
          </td>
        );
      case "description":
        return <td key={column} data-label="Descripción">{transaction.description}</td>;
      case "entries":
        return <td key={column} data-label="Movimientos">{transaction.entries.length}</td>;
    }
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
        <ColumnConfigPanel
          order={order}
          labels={COLUMN_LABELS}
          isVisible={isVisible}
          toggleColumn={toggleColumn}
          moveColumn={moveColumn}
          resetConfig={resetConfig}
        />
      )}

      {transactions.length === 0 ? (
        <p className={styles.emptyState}>No hay transacciones cargadas todavía.</p>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={`${styles.table} responsiveTable`}>
            <thead>
              <tr>
                {order.filter(isVisible).map((column) => (
                  <th
                    key={column}
                    className={column === "entries" ? "" : "sortable"}
                    onClick={() => handleSort(column)}
                  >
                    {COLUMN_LABELS[column]}
                    {sortIndicator(column)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedTransactions.map((transaction) => (
                <tr key={transaction.id}>
                  {order.filter(isVisible).map((column) => renderCell(column, transaction))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}