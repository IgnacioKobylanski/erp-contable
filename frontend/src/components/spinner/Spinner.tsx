import styles from './Spinner.module.css';

interface SpinnerProps {
  label?: string;
}

export function Spinner({ label = 'Cargando...' }: SpinnerProps) {
  return (
    <div className={styles.container}>
      <div className={styles.spinner} />
      <span className={styles.label}>{label}</span>
    </div>
  );
}