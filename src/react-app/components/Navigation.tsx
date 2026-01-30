import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Users, UserCircle, BookMarked, Home } from 'lucide-react';

export default function Navigation() {
  const location = useLocation();
  
  const links = [
    { path: '/', label: 'Inicio', icon: Home },
    { path: '/books', label: 'Libros', icon: BookOpen },
    { path: '/authors', label: 'Autores', icon: UserCircle },
    { path: '/users', label: 'Usuarios', icon: Users },
    { path: '/loans', label: 'Préstamos', icon: BookMarked },
  ];

  return (
    <nav className="bg-white/80 backdrop-blur-lg border-b border-indigo-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-8 h-8 text-indigo-600" />
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Biblioteca Jenny
            </span>
          </div>
          
          <div className="flex space-x-1">
            {links.map(({ path, label, icon: Icon }) => {
              const isActive = location.pathname === path;
              return (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                      : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium text-sm">{label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
