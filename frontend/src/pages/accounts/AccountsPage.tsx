import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAccounts } from '../../services/account.service';
import type { Account } from '../../types';
import { accountTypeColorClass } from '../../utils/accountStyles';
import styles from './AccountsPage.module.css';

export function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAccounts()
      .then(setAccounts)
      .catch(() => setError('No se pudieron cargar las cuentas.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Cargando cuentas...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1 className={styles.title}>Plan de Cuentas</h1>
      <Link className="btnPrimarySmall" to="/accounts/new">
        + Nueva cuenta
      </Link>

      {accounts.length === 0 ? (
        <p className={styles.emptyState}>No hay cuentas cargadas todavía.</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Código</th>
              <th>Nombre</th>
              <th>Tipo</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((account) => (
              <tr key={account.id}>
                <td>{account.code}</td>
                <td>{account.name}</td>
                <td>
                  <span className={`typeBadge ${accountTypeColorClass[account.type]}`}>
                    {account.type}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}