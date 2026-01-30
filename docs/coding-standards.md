# Estándares de Codificación - Sistema de Biblioteca Jenny

## Principios Generales

Este proyecto sigue las mejores prácticas de desarrollo de software moderno para garantizar:
- **Mantenibilidad**: Código fácil de entender y modificar
- **Escalabilidad**: Arquitectura que soporta crecimiento
- **Confiabilidad**: Validación y manejo de errores robusto
- **Seguridad**: Protección de datos sensibles

## Arquitectura del Proyecto

### Estructura de Directorios

```
biblioteca-jenny/
├── src/
│   ├── worker/              # Backend (Cloudflare Workers)
│   │   └── index.ts         # API REST con Hono
│   ├── react-app/           # Frontend (React)
│   │   ├── components/      # Componentes reutilizables
│   │   ├── pages/           # Vistas principales
│   │   └── hooks/           # Custom React hooks
│   └── shared/              # Código compartido
│       └── types.ts         # Tipos TypeScript y validaciones Zod
└── docs/                    # Documentación
```

### Patrón de Arquitectura

**Backend (src/worker/index.ts)**
- API RESTful con endpoints CRUD
- Validación de datos con Zod
- Manejo de errores consistente
- Integración con servicios externos (Stripe)

**Frontend (src/react-app/)**
- Componentes React funcionales
- Hooks para gestión de estado
- Separación de lógica de negocio y presentación

## Estándares de Backend

### 1. Estructura de Endpoints

Todos los endpoints siguen el patrón REST:

```typescript
// Buena práctica: Rutas RESTful claras
app.get("/api/books", async (c) => { /* Listar */ });
app.get("/api/books/:id", async (c) => { /* Obtener uno */ });
app.post("/api/books", async (c) => { /* Crear */ });
app.put("/api/books/:id", async (c) => { /* Actualizar */ });
app.delete("/api/books/:id", async (c) => { /* Eliminar */ });
```

### 2. Validación de Datos

**Siempre validar** entradas del usuario con Zod antes de procesar:

```typescript
// Validar datos antes de usarlos
const validation = CreateBookSchema.safeParse(body);
if (!validation.success) {
  return c.json({ error: validation.error.errors }, 400);
}
const data = validation.data;
```

### 3. Manejo de Errores

**Respuestas de error consistentes** con códigos HTTP apropiados:

```typescript
// 400 - Datos inválidos
return c.json({ error: "Mensaje descriptivo" }, 400);

// 404 - Recurso no encontrado
return c.json({ error: "Libro no encontrado" }, 404);

// 500 - Error del servidor (en catch)
return c.json({ error: "Error interno del servidor" }, 500);
```

### 4. Consultas SQL

**Usar consultas parametrizadas** para prevenir inyección SQL:

```typescript
// ✓ CORRECTO: Consulta parametrizada
await db.prepare("SELECT * FROM books WHERE id = ?").bind(id).first();

// ✗ INCORRECTO: Concatenación de strings (vulnerable)
await db.prepare(`SELECT * FROM books WHERE id = ${id}`).first();
```

### 5. Lógica de Negocio

**Validar reglas de negocio** antes de modificar datos:

```typescript
// Verificar disponibilidad antes de prestar un libro
const book = await db.prepare("SELECT copies_available FROM books WHERE id = ?")
  .bind(data.book_id).first();

if (!book || book.copies_available <= 0) {
  return c.json({ error: "No hay copias disponibles" }, 400);
}
```

## Estándares de Frontend

### 1. Componentes React

**Componentes funcionales** con TypeScript:

```typescript
interface ComponentProps {
  isOpen: boolean;
  onClose: () => void;
  data: SomeType;
}

export default function Component({ isOpen, onClose, data }: ComponentProps) {
  // Implementación
}
```

### 2. Gestión de Estado

**useState para estado local**, **useEffect para efectos secundarios**:

```typescript
const [items, setItems] = useState<Item[]>([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  fetchItems();
}, []); // Dependencias vacías = ejecutar una vez al montar
```

### 3. Manejo de Formularios

**Validación en cliente y servidor**:

```typescript
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  
  // Validar en cliente
  const errors: Record<string, string> = {};
  if (!formData.name) {
    errors.name = 'El nombre es requerido';
  }
  
  if (Object.keys(errors).length > 0) {
    setErrors(errors);
    return;
  }
  
  // Enviar al servidor
  onSubmit(formData);
};
```

### 4. Llamadas a API

**Manejo de errores en llamadas fetch**:

```typescript
const fetchData = async () => {
  try {
    setLoading(true);
    const response = await fetch('/api/endpoint');
    
    if (!response.ok) {
      const error = await response.json();
      alert(error.error || 'Error al cargar datos');
      return;
    }
    
    const data = await response.json();
    setData(data);
  } catch (error) {
    console.error('Error:', error);
    alert('Error de conexión');
  } finally {
    setLoading(false);
  }
};
```

## Convenciones de Nomenclatura

### Variables y Funciones

```typescript
// camelCase para variables y funciones
const bookTitle = "Cien años de soledad";
const userEmail = "usuario@ejemplo.com";

function fetchBooks() { }
function handleSubmit() { }
```

### Componentes y Tipos

```typescript
// PascalCase para componentes y tipos
type BookWithAuthor = { ... };
interface ModalProps { ... }

export default function BookModal() { }
```

### Constantes

```typescript
// UPPER_SNAKE_CASE para constantes
const MAX_LOAN_DAYS = 14;
const LATE_FEE_PER_DAY = 5;
```

## Comentarios y Documentación

### Comentarios de Código

**Explicar el "por qué", no el "qué"**:

```typescript
// ✓ BUENO: Explica la razón
// Calcular multa: $5 por cada día de retraso
const lateFee = daysLate * 5;

// ✗ MALO: Repite lo obvio
// Multiplicar días por 5
const lateFee = daysLate * 5;
```

### Documentación JSDoc

**Documentar funciones públicas y tipos complejos**:

```typescript
/**
 * Crea una nueva sesión de pago con Stripe
 * 
 * @param userId - ID del usuario que realizará el pago
 * @param amount - Monto a pagar en la moneda local
 * @param description - Descripción del concepto de pago
 * @returns URL de checkout de Stripe
 * @throws Error si el usuario no existe o el monto es inválido
 */
async function createPaymentSession(
  userId: number,
  amount: number,
  description: string
): Promise<string> {
  // Implementación
}
```

## Seguridad

### 1. Secretos y Credenciales

**Nunca** incluir secretos en el código:

```typescript
// ✓ CORRECTO: Usar variables de entorno
const stripe = new Stripe(c.env.STRIPE_SECRET_KEY);

// ✗ INCORRECTO: Hardcodear secretos
const stripe = new Stripe("sk_live_123456789");
```

### 2. Validación de Entrada

**Validar TODOS los datos** del usuario:

```typescript
// Backend: Validación con Zod
const validation = schema.safeParse(data);

// Frontend: Validación adicional
if (!email.includes('@')) {
  errors.email = 'Email inválido';
}
```

### 3. Autorización

**Verificar permisos** antes de operaciones sensibles:

```typescript
// Verificar que el usuario esté activo antes de permitir préstamo
const user = await db.prepare("SELECT is_active FROM library_users WHERE id = ?")
  .bind(userId).first();

if (!user || user.is_active === 0) {
  return c.json({ error: "Usuario no activo" }, 403);
}
```

## Manejo de Base de Datos

### 1. Migraciones

**Usar migraciones** para cambios de esquema:

```typescript
// up_sql: Aplica los cambios
// down_sql: Revierte los cambios
```

### 2. Transacciones

**Para operaciones múltiples relacionadas**:

```typescript
// Ejemplo: Crear préstamo Y decrementar copias disponibles
// (En SQLite, múltiples statements se ejecutan en transacción implícita)
```

### 3. Índices

**Crear índices** en campos de búsqueda frecuente:

```sql
CREATE INDEX idx_users_email ON library_users(email);
CREATE INDEX idx_loans_user_id ON loans(user_id);
```

## Testing (Buenas Prácticas)

Aunque no hay tests automatizados aún, el código está preparado para:

1. **Tests Unitarios**: Funciones puras y lógica separada
2. **Tests de Integración**: Endpoints bien definidos
3. **Tests E2E**: Flujos de usuario completos

## Métricas de Calidad

### Complejidad

- Funciones ≤ 50 líneas
- Componentes ≤ 200 líneas
- Archivos ≤ 500 líneas
- Nivel de anidación ≤ 3

### Acoplamiento

- Componentes independientes y reutilizables
- Dependencias mínimas entre módulos
- Interfaces claras entre capas

## Checklist de Revisión de Código

Antes de considerar una tarea completa:

- [ ] ¿El código tiene comentarios explicativos en español?
- [ ] ¿Se validan todas las entradas del usuario?
- [ ] ¿Se manejan todos los casos de error?
- [ ] ¿Las consultas SQL están parametrizadas?
- [ ] ¿No hay secretos hardcodeados?
- [ ] ¿Los nombres de variables son descriptivos?
- [ ] ¿Se siguen las convenciones de nomenclatura?
- [ ] ¿El código es DRY (Don't Repeat Yourself)?
- [ ] ¿La funcionalidad se puede probar manualmente?
- [ ] ¿La interfaz es intuitiva y accesible?

## Recursos Adicionales

- [TypeScript Best Practices](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html)
- [React Best Practices](https://react.dev/learn/thinking-in-react)
- [Zod Documentation](https://zod.dev/)
- [Hono Documentation](https://hono.dev/)
