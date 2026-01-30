import { BookOpen, Users, BookMarked, TrendingUp } from 'lucide-react';

export default function Home() {
  const stats = [
    { label: 'Libros Disponibles', value: '1,234', icon: BookOpen, color: 'indigo' },
    { label: 'Usuarios Activos', value: '567', icon: Users, color: 'purple' },
    { label: 'Préstamos Activos', value: '89', icon: BookMarked, color: 'pink' },
    { label: 'Devoluciones Hoy', value: '23', icon: TrendingUp, color: 'blue' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          Biblioteca Jenny a su servicio
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Sistema completo de gestión de biblioteca con préstamos, devoluciones y control de pagos
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br from-${stat.color}-100 to-${stat.color}-50 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
                <span className="text-3xl font-bold text-gray-800">{stat.value}</span>
              </div>
              <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-indigo-100">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Gestión de Libros</h3>
          <p className="text-gray-600">
            Administra tu catálogo completo de libros con información detallada de cada título
          </p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-purple-100">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
            <BookMarked className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Sistema de Préstamos</h3>
          <p className="text-gray-600">
            Control completo de préstamos y devoluciones con seguimiento de fechas
          </p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-pink-100">
          <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center mb-4">
            <Users className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Control de Usuarios</h3>
          <p className="text-gray-600">
            Registra y gestiona usuarios con historial completo de préstamos
          </p>
        </div>
      </div>
    </div>
  );
}
