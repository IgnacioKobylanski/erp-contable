import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getTransactions } from "../../services/transaction.service";
import type { Transaction } from "../../types";
import styles from "./TransactionsPage.module.css";

export function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getTransactions()
      .then(setTransactions)
      .catch(() => setError("No se pudieron cargar las transacciones."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Cargando transacciones...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1 className={styles.title}>Transacciones</h1>
      <Link className="btnPrimarySmall" to="/transactions/new">
        + Nueva transacción
      </Link>

      {transactions.length === 0 ? (
        <p className={styles.emptyState}>
          No hay transacciones cargadas todavía.
        </p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Fecha</th>
              <th>Descripción</th>
              <th>Movimientos</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td>{transaction.id}</td>
                <td>{new Date(transaction.date).toLocaleDateString()}</td>
                <td>{transaction.description}</td>
                <td>{transaction.entries.length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
