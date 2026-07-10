import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAccounts, createAccount } from '../../services/account.service';
import type { Account, AccountPayload, AccountType } from '../../types';
import styles from './NewAccountPage.module.css';

const ACCOUNT_TYPES: AccountType[] = ['Asset', 'Liability', 'Equity', 'Income', 'Expense'];

export function NewAccountPage() {
  const navigate = useNavigate();

  const [existingAccounts, setExistingAccounts] = useState<Account[]>([]);
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [type, setType] = useState<AccountType>('Asset');
  const [description, setDescription] = useState('');
  const [parent, setParent] = useState<number | ''>('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getAccounts()
      .then(setExistingAccounts)
      .catch(() => setError('No se pudieron cargar las cuentas existentes.'));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!code.trim() || !name.trim()) {
      setError('El código y el nombre son obligatorios.');
      return;
    }

    const payload: AccountPayload = {
      code,
      name,
      type,
      description: description.trim() || undefined,
      parent: parent === '' ? null : parent,
    };

    setSubmitting(true);
    try {
      await createAccount(payload);
      navigate('/accounts');
    } catch {
      setError('Error al guardar la cuenta. Verificá que el código no esté repetido.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className={styles.title}>Nueva Cuenta</h1>

      <form onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="code">
            Código
          </label>
          <input
            id="code"
            className={styles.input}
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="name">
            Nombre
          </label>
          <input
            id="name"
            className={styles.input}
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="type">
            Tipo
          </label>
          <select
            id="type"
            className={styles.select}
            value={type}
            onChange={(e) => setType(e.target.value as AccountType)}
          >
            {ACCOUNT_TYPES.map((accountType) => (
              <option key={accountType} value={accountType}>
                {accountType}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="description">
            Descripción <span className={styles.optional}>(opcional)</span>
          </label>
          <input
            id="description"
            className={styles.input}
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="parent">
            Cuenta padre <span className={styles.optional}>(opcional)</span>
          </label>
          <select
            id="parent"
            className={styles.select}
            value={parent}
            onChange={(e) => setParent(e.target.value === '' ? '' : Number(e.target.value))}
          >
            <option value="">Sin cuenta padre</option>
            {existingAccounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.code} - {account.name}
              </option>
            ))}
          </select>
        </div>

        {error && <p className={styles.errorMessage}>{error}</p>}

        <div className={styles.actions}>
          <button type="submit" className="btnPrimary" disabled={submitting}>
            {submitting ? 'Guardando...' : 'Guardar Cuenta'}
          </button>
          <Link className="btnSecondary" to="/accounts">
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}