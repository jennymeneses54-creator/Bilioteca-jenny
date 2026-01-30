import { Plus, Search, Edit, Trash2, BookOpen } from 'lucide-react';
import { useState, useEffect } from 'react';
import BookModal from '../components/BookModal';
import type { BookWithAuthor, CreateBook, Author } from '../../shared/types';

export default function Books() {
  const [books, setBooks] = useState<BookWithAuthor[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<BookWithAuthor[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<BookWithAuthor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBooks();
    fetchAuthors();
  }, []);

  useEffect(() => {
    if (search) {
      fetchBooks(search);
    } else {
      setFilteredBooks(books);
    }
  }, [search]);

  const fetchBooks = async (searchTerm?: string) => {
    try {
      const url = searchTerm ? `/api/books?search=${encodeURIComponent(searchTerm)}` : '/api/books';
      const response = await fetch(url);
      const data = await response.json();
      setBooks(data);
      setFilteredBooks(data);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAuthors = async () => {
    try {
      const response = await fetch('/api/authors');
      const data = await response.json();
      setAuthors(data);
    } catch (error) {
      console.error('Error fetching authors:', error);
    }
  };

  const handleSaveBook = async (bookData: CreateBook) => {
    try {
      const url = selectedBook ? `/api/books/${selectedBook.id}` : '/api/books';
      const method = selectedBook ? 'PUT' : 'POST';

      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookData),
      });

      await fetchBooks();
      setIsModalOpen(false);
      setSelectedBook(null);
    } catch (error) {
      console.error('Error saving book:', error);
    }
  };

  const handleDeleteBook = async (id: number) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este libro?')) return;

    try {
      const response = await fetch(`/api/books/${id}`, { method: 'DELETE' });
      if (response.ok) {
        await fetchBooks();
      } else {
        const error = await response.json();
        alert(error.error || 'Error al eliminar el libro');
      }
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  const openEditModal = (book: BookWithAuthor) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setSelectedBook(null);
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Catálogo de Libros</h1>
        <button
          onClick={openCreateModal}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          <Plus className="w-5 h-5" />
          <span className="font-medium">Agregar Libro</span>
        </button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar libros por título, autor o ISBN..."
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
          />
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <p className="text-center text-gray-500 py-12">Cargando libros...</p>
        </div>
      ) : filteredBooks.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <p className="text-center text-gray-500 py-12">
            {search ? 'No se encontraron libros' : 'No hay libros registrados'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map((book) => (
            <div
              key={book.id}
              className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-3 flex-1">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-800 line-clamp-2 mb-1">{book.title}</h3>
                    <p className="text-sm text-gray-600">{book.author_name}</p>
                  </div>
                </div>
                <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                  <button
                    onClick={() => openEditModal(book)}
                    className="p-2 hover:bg-indigo-50 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4 text-indigo-600" />
                  </button>
                  <button
                    onClick={() => handleDeleteBook(book.id)}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                {book.isbn && (
                  <p className="text-xs text-gray-500">ISBN: {book.isbn}</p>
                )}
                {book.genre && (
                  <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-medium rounded-full">
                    {book.genre}
                  </span>
                )}
                {book.publication_year && (
                  <p className="text-sm text-gray-600">Año: {book.publication_year}</p>
                )}
              </div>

              {book.description && (
                <p className="text-sm text-gray-600 line-clamp-2 mb-4">{book.description}</p>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="text-sm">
                  <span className="text-gray-500">Disponibles: </span>
                  <span className={`font-bold ${book.copies_available > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {book.copies_available}/{book.copies_total}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <BookModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedBook(null);
        }}
        onSave={handleSaveBook}
        book={selectedBook}
        authors={authors}
      />
    </div>
  );
}
