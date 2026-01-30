import { Plus, Search, Edit, Trash2, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import AuthorModal from '../components/AuthorModal';
import type { Author, CreateAuthor } from '../../shared/types';

export default function Authors() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [filteredAuthors, setFilteredAuthors] = useState<Author[]>([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAuthors();
  }, []);

  useEffect(() => {
    if (search) {
      const filtered = authors.filter(author =>
        author.name.toLowerCase().includes(search.toLowerCase()) ||
        (author.nationality && author.nationality.toLowerCase().includes(search.toLowerCase()))
      );
      setFilteredAuthors(filtered);
    } else {
      setFilteredAuthors(authors);
    }
  }, [search, authors]);

  const fetchAuthors = async () => {
    try {
      const response = await fetch('/api/authors');
      const data = await response.json();
      setAuthors(data);
      setFilteredAuthors(data);
    } catch (error) {
      console.error('Error fetching authors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAuthor = async (authorData: CreateAuthor) => {
    try {
      const url = selectedAuthor ? `/api/authors/${selectedAuthor.id}` : '/api/authors';
      const method = selectedAuthor ? 'PUT' : 'POST';

      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(authorData),
      });

      await fetchAuthors();
      setIsModalOpen(false);
      setSelectedAuthor(null);
    } catch (error) {
      console.error('Error saving author:', error);
    }
  };

  const handleDeleteAuthor = async (id: number) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este autor?')) return;

    try {
      const response = await fetch(`/api/authors/${id}`, { method: 'DELETE' });
      if (response.ok) {
        await fetchAuthors();
      } else {
        const error = await response.json();
        alert(error.error || 'Error al eliminar el autor');
      }
    } catch (error) {
      console.error('Error deleting author:', error);
    }
  };

  const openEditModal = (author: Author) => {
    setSelectedAuthor(author);
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setSelectedAuthor(null);
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Autores</h1>
        <button
          onClick={openCreateModal}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          <Plus className="w-5 h-5" />
          <span className="font-medium">Agregar Autor</span>
        </button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar autores..."
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
          />
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <p className="text-center text-gray-500 py-12">Cargando autores...</p>
        </div>
      ) : filteredAuthors.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <p className="text-center text-gray-500 py-12">
            {search ? 'No se encontraron autores' : 'No hay autores registrados'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAuthors.map((author) => (
            <div
              key={author.id}
              className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">{author.name}</h3>
                    {author.nationality && (
                      <p className="text-sm text-gray-500">{author.nationality}</p>
                    )}
                  </div>
                </div>
                <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openEditModal(author)}
                    className="p-2 hover:bg-purple-50 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4 text-purple-600" />
                  </button>
                  <button
                    onClick={() => handleDeleteAuthor(author.id)}
                    className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>

              {author.birth_date && (
                <p className="text-sm text-gray-600 mb-2">
                  Nacimiento: {new Date(author.birth_date).toLocaleDateString('es-ES')}
                </p>
              )}

              {author.biography && (
                <p className="text-sm text-gray-600 line-clamp-3">{author.biography}</p>
              )}
            </div>
          ))}
        </div>
      )}

      <AuthorModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedAuthor(null);
        }}
        onSave={handleSaveAuthor}
        author={selectedAuthor}
      />
    </div>
  );
}
