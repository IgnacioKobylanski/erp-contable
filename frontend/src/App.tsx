import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { AccountsPage } from './pages/accounts/AccountsPage';
import { NewAccountPage } from './pages/accounts/NewAccountPage';
import { TransactionsPage } from './pages/transactions/TransactionsPage';
import { NewTransactionPage } from './pages/transactions/NewTransactionPage';
import { JournalPage } from './pages/reports/JournalPage';
import { LedgerPage } from './pages/reports/LedgerPage';
import { BalanceSheetPage } from './pages/reports/BalanceSheetPage';
import { IncomeStatementPage } from './pages/reports/IncomeStatementPage';
import { ToastProvider } from './contexts/ToastContext';
import { ToastContainer } from './components/toast/ToastContainer';

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Navigate to="/accounts" replace />} />
          <Route path="/accounts" element={<AccountsPage />} />
          <Route path="/accounts/new" element={<NewAccountPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/transactions/new" element={<NewTransactionPage />} />
          <Route path="/reports/journal" element={<JournalPage />} />
          <Route path="/reports/ledger" element={<LedgerPage />} />
          <Route path="/reports/balance-sheet" element={<BalanceSheetPage />} />
          <Route path="/reports/income-statement" element={<IncomeStatementPage />} />
        </Route>
      </Routes>
      </BrowserRouter>
      <ToastContainer />
    </ToastProvider>
  );
}

export default App;