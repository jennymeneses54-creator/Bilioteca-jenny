import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { BookWithAuthor, LibraryUser } from '../../shared/types';

interface LoanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (loan: { book_id: number; user_id: number; due_date: string; notes?: string }) => void;
}

export default function LoanModal({ isOpen, onClose, onSubmit }: LoanModalProps) {
  const [books, setBooks] = useState<BookWithAuthor[]>([]);
  const [users, setUsers] = useState<LibraryUser[]>([]);
  const [formData, setFormData] = useState({
    book_id: '',
    user_id: '',
    due_date: '',
    notes: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      fetchBooks();
      fetchUsers();
      
      // Set default due date to 14 days from now
      const defaultDueDate = new Date();
      defaultDueDate.setDate(defaultDueDate.getDate() + 14);
      setFormData(prev => ({
        ...prev,
        due_date: defaultDueDate.toISOString().split('T')[0]
      }));
    }
  }, [isOpen]);

  const fetchBooks = async () => {
    try {
      const response = await fetch('/api/books');
      const data = await response.json();
      // Filter only books with available copies
      setBooks(data.filter((book: BookWithAuthor) => book.copies_available > 0));
    } catch (error) {
      console.error('Error loading books:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      // Filter only active users
      setUsers(data.filter((user: LibraryUser) => user.is_active === 1));
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    
    if (!formData.book_id) {
      newErrors.book_id = 'Debes seleccionar un libro';
    }
    
    if (!formData.user_id) {
      newErrors.user_id = 'Debes seleccionar un usuario';
    }
    
    if (!formData.due_date) {
      newErrors.due_date = 'La fecha de devolución es requerida';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    onSubmit({
      book_id: parseInt(formData.book_id),
      user_id: parseInt(formData.user_id),
      due_date: formData.due_date,
      notes: formData.notes || undefined,
    });
    
    setFormData({ book_id: '', user_id: '', due_date: '', notes: '' });
    setErrors({});
  };

  if (!isOpen) return null;

  const selectedBook = books.find(b => b.id === parseInt(formData.book_id));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-green-600 to-emerald-600 text-white p-6 rounded-t-2xl flex justify-between items-center">
          <h2 className="text-2xl font-bold">Nuevo Préstamo</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Libro *
            </label>
            <select
              value={formData.book_id}
              onChange={(e) => setFormData({ ...formData, book_id: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
            >
              <option value="">Selecciona un libro</option>
              {books.map((book) => (
                <option key={book.id} value={book.id}>
                  {book.title} - {book.author_name} ({book.copies_available} disponibles)
                </option>
              ))}
            </select>
            {errors.book_id && (
              <p className="text-red-500 text-sm mt-1">{errors.book_id}</p>
            )}
          </div>

          {selectedBook && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="text-sm text-blue-900">
                <span className="font-semibold">Copias disponibles:</span> {selectedBook.copies_available} de {selectedBook.copies_total}
              </p>
              {selectedBook.isbn && (
                <p className="text-sm text-blue-900 mt-1">
                  <span className="font-semibold">ISBN:</span> {selectedBook.isbn}
                </p>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Usuario *
            </label>
            <select
              value={formData.user_id}
              onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
            >
              <option value="">Selecciona un usuario</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.member_id}) - {user.email}
                </option>
              ))}
            </select>
            {errors.user_id && (
              <p className="text-red-500 text-sm mt-1">{errors.user_id}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fecha de Devolución *
            </label>
            <input
              type="date"
              value={formData.due_date}
              onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
            />
            {errors.due_date && (
              <p className="text-red-500 text-sm mt-1">{errors.due_date}</p>
            )}
            <p className="text-sm text-gray-500 mt-1">
              Por defecto: 14 días desde hoy
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notas (opcional)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all resize-none"
              placeholder="Notas adicionales sobre el préstamo..."
            />
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:shadow-lg transition-all font-medium"
            >
              Registrar Préstamo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
