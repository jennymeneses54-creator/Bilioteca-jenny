import { useState, useEffect } from 'react';
import { Plus, Search, Filter, BookOpen, Clock, CheckCircle, AlertCircle, Undo2 } from 'lucide-react';
import LoanModal from '../components/LoanModal';
import type { LoanWithDetails } from '../../shared/types';

export default function Loans() {
  const [loans, setLoans] = useState<LoanWithDetails[]>([]);
  const [filteredLoans, setFilteredLoans] = useState<LoanWithDetails[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'returned' | 'overdue'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stats, setStats] = useState({
    active: 0,
    overdue: 0,
    dueSoon: 0,
  });

  useEffect(() => {
    fetchLoans();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [loans, searchTerm, statusFilter]);

  useEffect(() => {
    calculateStats();
  }, [loans]);

  const fetchLoans = async () => {
    try {
      const response = await fetch('/api/loans');
      const data = await response.json();
      setLoans(data);
    } catch (error) {
      console.error('Error loading loans:', error);
    }
  };

  const calculateStats = () => {
    const now = new Date();
    const threeDaysFromNow = new Date();
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

    const active = loans.filter(loan => loan.is_returned === 0).length;
    const overdue = loans.filter(loan => {
      if (loan.is_returned === 1) return false;
      return new Date(loan.due_date) < now;
    }).length;
    const dueSoon = loans.filter(loan => {
      if (loan.is_returned === 1) return false;
      const dueDate = new Date(loan.due_date);
      return dueDate > now && dueDate <= threeDaysFromNow;
    }).length;

    setStats({ active, overdue, dueSoon });
  };

  const applyFilters = () => {
    let filtered = [...loans];

    // Apply status filter
    if (statusFilter === 'active') {
      filtered = filtered.filter(loan => loan.is_returned === 0);
    } else if (statusFilter === 'returned') {
      filtered = filtered.filter(loan => loan.is_returned === 1);
    } else if (statusFilter === 'overdue') {
      filtered = filtered.filter(loan => {
        if (loan.is_returned === 1) return false;
        return new Date(loan.due_date) < new Date();
      });
    }

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(loan =>
        loan.book_title.toLowerCase().includes(term) ||
        loan.user_name.toLowerCase().includes(term) ||
        loan.member_id.toLowerCase().includes(term)
      );
    }

    setFilteredLoans(filtered);
  };

  const handleCreateLoan = async (loanData: any) => {
    try {
      const response = await fetch('/api/loans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loanData),
      });

      if (response.ok) {
        await fetchLoans();
        setIsModalOpen(false);
      } else {
        const error = await response.json();
        alert(error.error || 'Error al crear el préstamo');
      }
    } catch (error) {
      console.error('Error creating loan:', error);
      alert('Error al crear el préstamo');
    }
  };

  const handleReturnLoan = async (loanId: number) => {
    if (!confirm('¿Confirmas la devolución de este libro?')) return;

    try {
      const response = await fetch(`/api/loans/${loanId}/return`, {
        method: 'POST',
      });

      if (response.ok) {
        const result = await response.json();
        if (result.late_fee > 0) {
          alert(`Libro devuelto. Multa por retraso: $${result.late_fee.toFixed(2)}`);
        }
        await fetchLoans();
      } else {
        const error = await response.json();
        alert(error.error || 'Error al devolver el libro');
      }
    } catch (error) {
      console.error('Error returning loan:', error);
      alert('Error al devolver el libro');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    const diff = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const getStatusColor = (loan: LoanWithDetails) => {
    if (loan.is_returned === 1) return 'bg-gray-100 text-gray-600';
    
    const daysUntilDue = getDaysUntilDue(loan.due_date);
    if (daysUntilDue < 0) return 'bg-red-100 text-red-700';
    if (daysUntilDue <= 3) return 'bg-yellow-100 text-yellow-700';
    return 'bg-green-100 text-green-700';
  };

  const getStatusText = (loan: LoanWithDetails) => {
    if (loan.is_returned === 1) return 'Devuelto';
    
    const daysUntilDue = getDaysUntilDue(loan.due_date);
    if (daysUntilDue < 0) return `Vencido (${Math.abs(daysUntilDue)} días)`;
    if (daysUntilDue === 0) return 'Vence hoy';
    if (daysUntilDue <= 3) return `Vence en ${daysUntilDue} días`;
    return 'Activo';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Préstamos</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          <Plus className="w-5 h-5" />
          <span className="font-medium">Nuevo Préstamo</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-green-600 font-medium">Préstamos Activos</p>
            <BookOpen className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-green-700">{stats.active}</p>
        </div>
        
        <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-6 border border-red-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-red-600 font-medium">Vencidos</p>
            <AlertCircle className="w-5 h-5 text-red-600" />
          </div>
          <p className="text-3xl font-bold text-red-700">{stats.overdue}</p>
        </div>
        
        <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-6 border border-yellow-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-yellow-600 font-medium">Vencen Pronto</p>
            <Clock className="w-5 h-5 text-yellow-600" />
          </div>
          <p className="text-3xl font-bold text-yellow-700">{stats.dueSoon}</p>
          <p className="text-xs text-yellow-600 mt-1">Próximos 3 días</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar por libro, usuario o ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
          />
        </div>
        
        <div className="flex items-center space-x-2 px-4 py-3 bg-white border border-gray-200 rounded-xl">
          <Filter className="w-5 h-5 text-gray-600" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="outline-none text-gray-700 font-medium bg-transparent"
          >
            <option value="all">Todos</option>
            <option value="active">Activos</option>
            <option value="overdue">Vencidos</option>
            <option value="returned">Devueltos</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {filteredLoans.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            {searchTerm || statusFilter !== 'all'
              ? 'No se encontraron préstamos con los filtros aplicados'
              : 'No hay préstamos registrados. Crea el primero usando el botón "Nuevo Préstamo"'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Libro
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Fecha Préstamo
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Fecha Devolución
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredLoans.map((loan) => (
                  <tr key={loan.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{loan.book_title}</p>
                      {loan.notes && (
                        <p className="text-sm text-gray-500 mt-1">{loan.notes}</p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{loan.user_name}</p>
                      <p className="text-sm text-gray-500">{loan.member_id}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDate(loan.loan_date)}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900">{formatDate(loan.due_date)}</p>
                      {loan.return_date && (
                        <p className="text-sm text-gray-500">
                          Devuelto: {formatDate(loan.return_date)}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(loan)}`}>
                        {getStatusText(loan)}
                      </span>
                      {loan.late_fee > 0 && (
                        <p className="text-xs text-red-600 mt-1">
                          Multa: ${loan.late_fee.toFixed(2)}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {loan.is_returned === 0 ? (
                        <button
                          onClick={() => handleReturnLoan(loan.id)}
                          className="flex items-center space-x-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                        >
                          <Undo2 className="w-4 h-4" />
                          <span>Devolver</span>
                        </button>
                      ) : (
                        <div className="flex items-center space-x-1 text-gray-400 text-sm">
                          <CheckCircle className="w-4 h-4" />
                          <span>Completado</span>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <LoanModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateLoan}
      />
    </div>
  );
}
