# 📚 Biblioteca Jenny - Sistema de Gestión Bibliotecaria
# Biblioteca-Jenny
Link del repositorio en GitHub:  
https://github.com/jennymeneses54-creator/Bilioteca-jenny

Sistema integral de gestión para bibliotecas que permite administrar libros, autores, usuarios y préstamos con integración de pagos.

## 🌟 Características Principales

### Gestión de Catálogo
- **Administración de Libros**: CRUD completo con control de inventario
- **Gestión de Autores**: Registro de autores con biografías y nacionalidades
- **Búsqueda Avanzada**: Búsqueda por título, autor, ISBN o género
- **Control de Copias**: Seguimiento de copias totales y disponibles

### Sistema de Préstamos
- **Registro de Préstamos**: Asignación de libros a usuarios con fechas de devolución
- **Control de Devoluciones**: Gestión de devoluciones con cálculo automático de multas
- **Detección de Retrasos**: Identificación automática de préstamos vencidos
- **Multas por Retraso**: $5 MXN por día de retraso

### Gestión de Usuarios
- **Registro de Miembros**: Sistema de membresía con IDs únicos (U001, U002, etc.)
- **Información de Contacto**: Email, teléfono, dirección y fecha de nacimiento
- **Control de Estado**: Activación/desactivación de cuentas
- **Saldo Pendiente**: Seguimiento de multas acumuladas

### Sistema de Pagos
- **Integración con Stripe**: Procesamiento seguro de pagos
- **Checkout en Línea**: Sesiones de pago para multas y cargos
- **Historial de Pagos**: Registro completo de transacciones
- **Webhooks**: Actualización automática de saldos al recibir pagos

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 18** - Framework de UI
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos y diseño
- **Lucide React** - Iconografía
- **React Router** - Navegación

### Backend
- **Cloudflare Workers** - Serverless compute
- **Hono** - Framework web ligero
- **D1 (SQLite)** - Base de datos
- **Zod** - Validación de esquemas

### Servicios Externos
- **Stripe** - Procesamiento de pagos
- **Cloudflare R2** - Almacenamiento de archivos (futuro)

## 📋 Requisitos Previos


- Cuenta en [Stripe](https://stripe.com) (para pagos)
- Navegador web moderno (Chrome, Firefox, Safari, Edge)

## 🚀 Inicio Rápido

### 1. Acceder al Proyecto
El proyecto está alojado en Mocha. Simplemente accede a la URL de tu app.

### 2. Configurar Stripe (Opcional)
Si deseas habilitar pagos:

1. Crea una cuenta en [Stripe](https://dashboard.stripe.com/register)
2. Obtén tus claves API desde el [Dashboard](https://dashboard.stripe.com/apikeys)
3. En Mocha, ve a Settings → Secrets
4. Agrega las siguientes variables:
   - `STRIPE_SECRET_KEY`: Tu clave secreta de Stripe
   - `STRIPE_WEBHOOK_SECRET`: Tu secreto de webhook de Stripe

### 3. Empezar a Usar
1. **Agregar Autores**: Comienza registrando autores en la sección "Autores"
2. **Agregar Libros**: Registra libros asociándolos a autores
3. **Registrar Usuarios**: Crea cuentas de miembros de la biblioteca
4. **Crear Préstamos**: Asigna libros a usuarios

## 📖 Estructura del Proyecto

```
biblioteca-jenny/
├── src/
│   ├── worker/
│   │   ├── index.ts           # API REST principal
│   │   └── env.d.ts           # Definiciones de tipos de entorno
│   ├── react-app/
│   │   ├── components/        # Componentes React reutilizables
│   │   │   ├── AuthorModal.tsx
│   │   │   ├── BookModal.tsx
│   │   │   ├── UserModal.tsx
│   │   │   └── LoanModal.tsx
│   │   ├── pages/             # Páginas principales
│   │   │   ├── Books.tsx
│   │   │   ├── Authors.tsx
│   │   │   ├── Users.tsx
│   │   │   └── Loans.tsx
│   │   └── App.tsx            # Componente raíz
│   └── shared/
│       └── types.ts           # Tipos y validaciones compartidas
├── docs/
│   ├── coding-standards.md    # Estándares de codificación
│   ├── user-guide.md          # Guía de usuario
│   ├── installation.md        # Manual de instalación
│   └── test-cases.md          # Casos de prueba
├── index.html                 # Punto de entrada HTML
└── README.md                  # Este archivo
```

## 🔐 Seguridad

- **Validación de Datos**: Todos los inputs se validan con Zod
- **Consultas Parametrizadas**: Protección contra inyección SQL
- **Secretos Seguros**: Variables de entorno para credenciales
- **HTTPS**: Todas las comunicaciones encriptadas
- **Stripe PCI**: Cumplimiento de estándares de seguridad de pagos

## 📊 Base de Datos

### Esquema Principal

**authors** - Información de autores
- id, name, biography, nationality, birth_date
- created_at, updated_at

**books** - Catálogo de libros
- id, title, isbn, author_id, genre
- publication_year, publisher, pages, language
- copies_total, copies_available, description
- created_at, updated_at

**library_users** - Usuarios de la biblioteca
- id, member_id, name, email, phone, address
- date_of_birth, registration_date, is_active
- outstanding_balance, created_at, updated_at

**loans** - Registro de préstamos
- id, book_id, user_id, loan_date, due_date
- return_date, is_returned, is_overdue, late_fee
- notes, created_at, updated_at

**payments** - Historial de pagos
- id, user_id, amount, stripe_session_id
- stripe_payment_intent, description, status
- paid_at, created_at, updated_at

## 🎨 Interfaz de Usuario

El sistema cuenta con una interfaz moderna y responsive que incluye:

- **Dashboard Visual**: Estadísticas y métricas en tiempo real
- **Búsqueda Dinámica**: Filtrado instantáneo en todas las secciones
- **Modales Intuitivos**: Formularios limpios para crear/editar
- **Indicadores Visuales**: Estados de disponibilidad y retrasos
- **Diseño Responsive**: Optimizado para desktop y móvil

## 🧪 Testing

Ver `docs/test-cases.md` para el plan completo de pruebas que incluye:

- **Black Box Testing**: Casos de prueba funcionales
- **White Box Testing**: Verificación de lógica interna
- **Pruebas de Integración**: Stripe, base de datos, API
- **Pruebas de UI**: Validación de formularios y navegación

## 📚 Documentación Adicional

- [Guía de Usuario](docs/user-guide.md) - Manual para usuarios finales
- [Manual de Instalación](docs/installation.md) - Guía técnica de despliegue
- [Estándares de Codificación](docs/coding-standards.md) - Convenciones del proyecto
- [Casos de Prueba](docs/test-cases.md) - Plan de testing completo

## 🤝 Contribución

Este proyecto sigue estándares estrictos de calidad de código:

1. Código comentado en español
2. Validación de todas las entradas
3. Manejo exhaustivo de errores
4. Tipos TypeScript estrictos
5. Componentes modulares y reutilizables

Ver `docs/coding-standards.md` para detalles completos.

## 📝 Licencia

Este proyecto es software propietario desarrollado para propósitos educativos.

## 👥 Contacto


- **Documentación**: Ver carpeta `docs/`
- **Issues**: Reportar problemas técnicos al administrador

## 🔄 Versiones

### v1.0.0 (Actual)
- ✅ CRUD de Libros y Autores
- ✅ Gestión de Usuarios
- ✅ Sistema de Préstamos
- ✅ Integración con Stripe
- ✅ Cálculo de Multas
- ✅ Control de Inventario

### Futuras Mejoras
- 🔜 Sistema de Reservaciones
- 🔜 Notificaciones por Email
- 🔜 Reportes y Estadísticas Avanzadas
- 🔜 Portal de Usuario
- 🔜 Búsqueda por Categorías
- 🔜 Historial de Lectura

---


