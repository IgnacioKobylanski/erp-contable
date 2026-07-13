import { useEffect, useState } from "react";
import { getLedger } from "../../services/reports.service";
import type { LedgerRecord } from "../../types";
import { Spinner } from "../../components/spinner/Spinner";
import styles from "./LedgerPage.module.css";

export function LedgerPage() {
  const [records, setRecords] = useState<LedgerRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getLedger()
      .then((response) => setRecords(response.results))
      .catch(() => setError("No se pudo cargar el libro mayor."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner label="Cargando libro mayor..." />;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1 className={styles.title}>Libro Mayor</h1>

      {records.length === 0 ? (
        <p className={styles.emptyState}>
          No hay movimientos registrados todavía.
        </p>
      ) : (
        records.map((record) => (
          <div key={record.account} className={styles.record}>
            <div className={styles.recordHeader}>{record.account}</div>
            {record.entries.length === 0 ? (
              <p className={styles.noEntries}>Sin movimientos.</p>
            ) : (
              <table className={`${styles.table} responsiveTable`}>
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Descripción</th>
                    <th>Tipo</th>
                    <th>Monto</th>
                  </tr>
                </thead>
                <tbody>
                  {record.entries.map((entry, index) => (
                    <tr key={index}>
                      <td data-label="Fecha">
                        {new Date(entry.date).toLocaleDateString()}
                      </td>
                      <td data-label="Descripción">{entry.description}</td>
                      <td
                        data-label="Tipo"
                        className={
                          entry.type === "debit" ? styles.debit : styles.credit
                        }
                      >
                        {entry.type === "debit" ? "Débito" : "Crédito"}
                      </td>
                      <td data-label="Monto">{entry.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        ))
      )}
    </div>
  );
}
