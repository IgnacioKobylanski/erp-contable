import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAccounts } from "../../services/account.service";
import { createTransaction } from "../../services/transaction.service";
import type { Account, EntryPayload, EntryType } from "../../types";
import styles from "./NewTransactionPage.module.css";
import { useToast } from "../../contexts/ToastContext";

interface EntryFormRow {
  account_id: number | "";
  type: EntryType;
  amount: string;
}

const emptyRow = (): EntryFormRow => ({
  account_id: "",
  type: "Debit",
  amount: "",
});

export function NewTransactionPage() {
  const navigate = useNavigate();
  const { showSuccess } = useToast();

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [description, setDescription] = useState("");
  const [rows, setRows] = useState<EntryFormRow[]>([emptyRow(), emptyRow()]);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getAccounts()
      .then(setAccounts)
      .catch(() => setError("No se pudieron cargar las cuentas."));
  }, []);

  const updateRow = (index: number, changes: Partial<EntryFormRow>) => {
    setRows((prev) =>
      prev.map((row, i) => (i === index ? { ...row, ...changes } : row)),
    );
  };

  const addRow = () => setRows((prev) => [...prev, emptyRow()]);

  const removeRow = (index: number) => {
    setRows((prev) => prev.filter((_, i) => i !== index));
  };

  const totalDebit = rows
    .filter((row) => row.type === "Debit")
    .reduce((sum, row) => sum + (parseFloat(row.amount) || 0), 0);

  const totalCredit = rows
    .filter((row) => row.type === "Credit")
    .reduce((sum, row) => sum + (parseFloat(row.amount) || 0), 0);

  const isBalanced = totalDebit === totalCredit && totalDebit > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!description.trim()) {
      setError("La descripción es obligatoria.");
      return;
    }

    if (!isBalanced) {
      setError("Los débitos y créditos deben ser iguales, y mayores a cero.");
      return;
    }

    if (rows.some((row) => row.account_id === "" || !row.amount)) {
      setError("Todas las filas deben tener cuenta y monto.");
      return;
    }

    const entries: EntryPayload[] = rows.map((row) => ({
      account_id: row.account_id as number,
      type: row.type,
      amount: row.amount,
    }));

    setSubmitting(true);
    try {
      await createTransaction({ description, entries });
      showSuccess("Transacción guardada correctamente.");
      navigate("/transactions");
    } catch {
      setError("Error al guardar la transacción. Verificá los datos.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className={styles.title}>Nueva Transacción</h1>

      <form onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="description">
            Descripción
          </label>
          <input
            id="description"
            className={styles.input}
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>Cuenta</th>
              <th>Tipo</th>
              <th>Monto</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index}>
                <td>
                  <select
                    className={styles.rowInput}
                    value={row.account_id}
                    onChange={(e) =>
                      updateRow(index, { account_id: Number(e.target.value) })
                    }
                  >
                    <option value="">Seleccionar cuenta</option>
                    {accounts.map((account) => (
                      <option key={account.id} value={account.id}>
                        {account.code} - {account.name}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <select
                    className={styles.rowInput}
                    value={row.type}
                    onChange={(e) =>
                      updateRow(index, { type: e.target.value as EntryType })
                    }
                  >
                    <option value="Debit">Débito</option>
                    <option value="Credit">Crédito</option>
                  </select>
                </td>
                <td>
                  <input
                    className={styles.rowInput}
                    type="number"
                    step="0.01"
                    value={row.amount}
                    onChange={(e) =>
                      updateRow(index, { amount: e.target.value })
                    }
                  />
                </td>
                <td>
                  {rows.length > 2 && (
                    <button
                      type="button"
                      className={styles.removeButton}
                      onClick={() => removeRow(index)}
                    >
                      Quitar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button type="button" className={styles.addButton} onClick={addRow}>
          + Agregar movimiento
        </button>

        <div
          className={`${styles.balanceIndicator} ${
            isBalanced
              ? styles.balanceIndicatorOk
              : styles.balanceIndicatorError
          }`}
        >
          <span>Total Débito: {totalDebit.toFixed(2)}</span>
          <span>Total Crédito: {totalCredit.toFixed(2)}</span>
          <span>{isBalanced ? "✅ Balanceado" : "⚠️ No balanceado"}</span>
        </div>

        {error && <p className={styles.errorMessage}>{error}</p>}

        <div className={styles.actions}>
          <button
            type="submit"
            className="btnPrimary"
            disabled={submitting || !isBalanced}
          >
            {submitting ? "Guardando..." : "Guardar Transacción"}
          </button>
          <Link className="btnSecondary" to="/transactions">
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
