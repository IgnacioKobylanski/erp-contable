import { useEffect, useState } from 'react';
import { getAccounts } from '../../services/account.service';
import type { Account } from '../../types';

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
      <h1>Plan de Cuentas</h1>
      {accounts.length === 0 ? (
        <p>No hay cuentas cargadas todavía.</p>
      ) : (
        <table>
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
                <td>{account.type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}