// 📊 Dashboard principal con datos en tiempo real
import { useAuth } from '../../hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../services/api';
import type { Account, Transaction } from '../../types';

export default function Dashboard() {
  const { user, logout } = useAuth();

  // Query para cuentas con cache
  const { data: accounts, isLoading: loadingAccounts } = useQuery({
    queryKey: ['accounts'],
    queryFn: async () => {
      const response = await apiClient.get<Account[]>('/accounts');
      return response.data;
    },
    staleTime: 2 * 60 * 1000, // Cache 2 minutos
  });

  // Query para transacciones recientes
  const { data: transactions, isLoading: loadingTransactions } = useQuery({
    queryKey: ['transactions', 'recent'],
    queryFn: async () => {
      const response = await apiClient.get<Transaction[]>('/transactions/recent');
      return response.data;
    },
    staleTime: 1 * 60 * 1000, // Cache 1 minuto
  });

  const handleLogout = async () => {
    await logout();
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-primary-600">HomeBanking</h1>
              <p className="text-sm text-gray-600">Bienvenido, {user?.name}</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-medium transition"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Cuentas */}
        <section className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Mis Cuentas</h2>
          {loadingAccounts ? (
            <div className="animate-pulse space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="bg-white p-6 rounded-xl h-32" />
              ))}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {accounts?.map((account) => (
                <div
                  key={account.id}
                  className="bg-gradient-to-br from-primary-500 to-primary-700 p-6 rounded-xl text-white shadow-lg hover:shadow-xl transition"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-sm opacity-90">Cuenta {account.type === 'checking' ? 'Corriente' : 'Ahorro'}</p>
                      <p className="text-xs opacity-75 font-mono">{account.accountNumber}</p>
                    </div>
                    <span className="text-xs bg-white/20 px-2 py-1 rounded">
                      {account.currency}
                    </span>
                  </div>
                  <p className="text-3xl font-bold">
                    ${account.balance.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Movimientos recientes */}
        <section>
          <h2 className="text-xl font-bold text-gray-800 mb-4">Movimientos Recientes</h2>
          {loadingTransactions ? (
            <div className="animate-pulse space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="bg-white p-4 rounded-lg h-16" />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Fecha
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Descripción
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                        Monto
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                        Saldo
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {transactions?.map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(transaction.date).toLocaleDateString('es-AR')}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {transaction.description}
                        </td>
                        <td className={`px-6 py-4 text-sm text-right font-medium ${
                          transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.type === 'credit' ? '+' : '-'}
                          ${Math.abs(transaction.amount).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="px-6 py-4 text-sm text-right text-gray-900">
                          ${transaction.balance.toLocaleString('es-AR', { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
