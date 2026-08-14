import { useState, useEffect } from 'react'
import { transactionsApi } from '../api/transactions'
import type { Transaction } from '../types/api'

export function TransactionsList() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await transactionsApi.getAll({ limit: 10 });
        setTransactions(res.data);
      } catch (err) {
        console.error('Failed to load transactions:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <ul>
      {transactions.map((tx) => (
        <li key={tx.id}>
          {tx.description || 'Transaction'}: ${tx.amount}
        </li>
      ))}
    </ul>
  );
}