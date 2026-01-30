import { Plus, Search, Edit, Trash2, User, Mail, Phone, MapPin, CreditCard, CheckCircle, XCircle, DollarSign } from 'lucide-react';
import { useState, useEffect } from 'react';
import UserModal from '../components/UserModal';
import PaymentModal from '../components/PaymentModal';
import type { LibraryUser, CreateLibraryUser } from '../../shared/types';

export default function Users() {
  const [users, setUsers] = useState<LibraryUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<LibraryUser[]>([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<LibraryUser | null>(null);
  const [paymentUser, setPaymentUser] = useState<LibraryUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (search) {
      fetchUsers(search);
    } else {
      setFilteredUsers(users);
    }
  }, [search]);

  const fetchUsers = async (searchTerm?: string) => {
    try {
      const url = searchTerm ? `/api/users?search=${encodeURIComponent(searchTerm)}` : '/api/users';
      const response = await fetch(url);
      const data = await response.json();
      setUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveUser = async (userData: CreateLibraryUser) => {
    try {
      const url = selectedUser ? `/api/users/${selectedUser.id}` : '/api/users';
      const method = selectedUser ? 'PUT' : 'POST';

      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      await fetchUsers();
      setIsModalOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este usuario?')) return;

    try {
      const response = await fetch(`/api/users/${id}`, { method: 'DELETE' });
      if (response.ok) {
        await fetchUsers();
      } else {
        const error = await response.json();
        alert(error.error || 'Error al eliminar el usuario');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const openEditModal = (user: LibraryUser) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const openPaymentModal = (user: LibraryUser) => {
    setPaymentUser(user);
    setIsPaymentModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Usuarios</h1>
        <button
          onClick={openCreateModal}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          <Plus className="w-5 h-5" />
          <span className="font-medium">Registrar Usuario</span>
        </button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar usuarios por nombre, ID o email..."
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <p className="text-center text-gray-500 py-12">Cargando usuarios...</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <p className="text-center text-gray-500 py-12">
            {search ? 'No se encontraron usuarios' : 'No hay usuarios registrados'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-3 flex-1">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-800 mb-1">{user.name}</h3>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-1 bg-indigo-50 text-indigo-600 text-xs font-medium rounded">
                        {user.member_id}
                      </span>
                      {user.is_active ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                  {user.outstanding_balance > 0 && (
                    <button
                      onClick={() => openPaymentModal(user)}
                      className="p-2 hover:bg-green-50 rounded-lg transition-colors"
                      title="Procesar pago"
                    >
                      <DollarSign className="w-4 h-4 text-green-600" />
                    </button>
                  )}
                  <button
                    onClick={() => openEditModal(user)}
                    className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4 text-blue-600" />
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="truncate">{user.email}</span>
                </div>
                {user.phone && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>{user.phone}</span>
                  </div>
                )}
                {user.address && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="truncate">{user.address}</span>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-gray-100 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Registro:</span>
                  <span className="font-medium text-gray-700">
                    {new Date(user.registration_date).toLocaleDateString('es-ES')}
                  </span>
                </div>
                {user.outstanding_balance > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 flex items-center space-x-1">
                      <CreditCard className="w-4 h-4" />
                      <span>Saldo:</span>
                    </span>
                    <span className="font-bold text-red-600">
                      ${user.outstanding_balance.toFixed(2)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <UserModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedUser(null);
        }}
        onSave={handleSaveUser}
        user={selectedUser}
      />

      {paymentUser && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => {
            setIsPaymentModalOpen(false);
            setPaymentUser(null);
          }}
          user={paymentUser}
        />
      )}
    </div>
  );
}
