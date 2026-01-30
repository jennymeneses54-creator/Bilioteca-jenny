# Plan de Pruebas - Sistema de Biblioteca Jenny

## Pruebas de Caja Negra

Las pruebas de caja negra se enfocan en la funcionalidad desde la perspectiva del usuario final, sin considerar la implementación interna.

### 1. Módulo de Gestión de Libros

| ID | Caso de Prueba | Pasos | Resultado Esperado | Tipo |
|----|----------------|-------|-------------------|------|
| LIB-01 | Agregar libro nuevo | 1. Click en "Agregar Libro"<br>2. Llenar todos los campos<br>3. Click en "Guardar" | Libro aparece en la lista con la información correcta | Positivo |
| LIB-02 | Agregar libro sin título | 1. Click en "Agregar Libro"<br>2. Dejar título vacío<br>3. Click en "Guardar" | Sistema muestra error: "Campo requerido" | Negativo |
| LIB-03 | Editar libro existente | 1. Click en ícono de editar en un libro<br>2. Modificar campos<br>3. Click en "Actualizar" | Cambios se reflejan en la tarjeta del libro | Positivo |
| LIB-04 | Buscar libro por título | 1. Escribir título en barra de búsqueda | Sistema filtra y muestra solo libros que coinciden | Positivo |
| LIB-05 | Buscar libro por ISBN | 1. Escribir ISBN en barra de búsqueda | Sistema muestra el libro correspondiente | Positivo |
| LIB-06 | Eliminar libro sin préstamos | 1. Click en ícono de eliminar<br>2. Confirmar eliminación | Libro desaparece de la lista | Positivo |
| LIB-07 | Eliminar libro con préstamos activos | 1. Click en ícono de eliminar de un libro prestado<br>2. Confirmar eliminación | Sistema muestra error: "No se puede eliminar el libro porque tiene préstamos activos" | Negativo |
| LIB-08 | Agregar libro con ISBN duplicado | 1. Intentar agregar libro con ISBN existente | Sistema debe permitirlo (ISBNs pueden repetirse en ediciones) | Positivo |

### 2. Módulo de Gestión de Autores

| ID | Caso de Prueba | Pasos | Resultado Esperado | Tipo |
|----|----------------|-------|-------------------|------|
| AUT-01 | Agregar autor nuevo | 1. Click en "Agregar Autor"<br>2. Llenar nombre y biografía<br>3. Click en "Guardar" | Autor aparece en la lista | Positivo |
| AUT-02 | Agregar autor sin nombre | 1. Click en "Agregar Autor"<br>2. Dejar nombre vacío<br>3. Click en "Guardar" | Sistema muestra error: "Campo requerido" | Negativo |
| AUT-03 | Editar biografía de autor | 1. Click en ícono de editar<br>2. Modificar biografía<br>3. Click en "Actualizar" | Biografía actualizada se muestra en la tarjeta | Positivo |
| AUT-04 | Buscar autor por nombre | 1. Escribir nombre en barra de búsqueda | Sistema filtra autores que coinciden | Positivo |
| AUT-05 | Eliminar autor sin libros | 1. Click en ícono de eliminar<br>2. Confirmar eliminación | Autor desaparece de la lista | Positivo |
| AUT-06 | Eliminar autor con libros | 1. Intentar eliminar autor que tiene libros<br>2. Confirmar eliminación | Sistema muestra error: "No se puede eliminar el autor porque tiene libros registrados" | Negativo |

### 3. Módulo de Gestión de Usuarios

| ID | Caso de Prueba | Pasos | Resultado Esperado | Tipo |
|----|----------------|-------|-------------------|------|
| USU-01 | Registrar usuario nuevo | 1. Click en "Registrar Usuario"<br>2. Llenar todos los campos<br>3. Click en "Registrar Usuario" | Usuario aparece con ID de miembro asignado (U001, U002, etc.) | Positivo |
| USU-02 | Registrar usuario sin nombre | 1. Click en "Registrar Usuario"<br>2. Dejar nombre vacío<br>3. Click en "Registrar Usuario" | Sistema muestra error: "El nombre es requerido" | Negativo |
| USU-03 | Registrar usuario con email inválido | 1. Ingresar email sin formato correcto (ej: "invalido")<br>2. Click en "Registrar Usuario" | Sistema muestra error: "Email inválido" | Negativo |
| USU-04 | Editar información de usuario | 1. Click en ícono de editar<br>2. Modificar teléfono y dirección<br>3. Click en "Actualizar" | Información actualizada se muestra en la tarjeta | Positivo |
| USU-05 | Buscar usuario por nombre | 1. Escribir nombre en barra de búsqueda | Sistema filtra usuarios que coinciden | Positivo |
| USU-06 | Buscar usuario por ID de miembro | 1. Escribir ID (ej: U001) en barra de búsqueda | Sistema muestra el usuario correspondiente | Positivo |
| USU-07 | Buscar usuario por email | 1. Escribir email en barra de búsqueda | Sistema muestra el usuario correspondiente | Positivo |
| USU-08 | Eliminar usuario sin préstamos | 1. Click en ícono de eliminar<br>2. Confirmar eliminación | Usuario desaparece de la lista | Positivo |
| USU-09 | Eliminar usuario con préstamos activos | 1. Intentar eliminar usuario con préstamos<br>2. Confirmar eliminación | Sistema muestra error: "No se puede eliminar el usuario porque tiene préstamos activos" | Negativo |
| USU-10 | Verificar asignación automática de ID | 1. Registrar varios usuarios consecutivos | Cada usuario recibe ID secuencial (U001, U002, U003...) | Positivo |

### 4. Módulo de Pagos con Stripe

| ID | Caso de Prueba | Pasos | Resultado Esperado | Tipo |
|----|----------------|-------|-------------------|------|
| PAG-01 | Pagar saldo pendiente | 1. Usuario con saldo > 0 click en "Pagar Ahora"<br>2. Completar checkout de Stripe<br>3. Regresar a la app | Saldo del usuario se actualiza a 0 | Positivo |
| PAG-02 | Intentar pagar sin saldo | 1. Usuario con saldo = 0 click en "Pagar Ahora" | Botón de pago debe estar deshabilitado o no visible | Negativo |
| PAG-03 | Pago cancelado | 1. Click en "Pagar Ahora"<br>2. Cancelar en página de Stripe<br>3. Regresar a la app | Saldo permanece igual, no se procesa pago | Positivo |
| PAG-04 | Pago con tarjeta inválida | 1. Usar tarjeta de prueba rechazada en Stripe<br>2. Intentar completar pago | Stripe muestra error, saldo no cambia | Negativo |

## Pruebas de Caja Blanca

Las pruebas de caja blanca examinan la estructura interna del código, lógica y flujos de datos.

### 1. Validación de Datos (src/shared/types.ts)

| ID | Caso de Prueba | Código a Revisar | Verificación | Estado |
|----|----------------|-----------------|--------------|--------|
| VAL-01 | Esquemas Zod para libros | `BookSchema`, `CreateBookSchema` | Verificar que todos los campos requeridos están definidos | ☐ |
| VAL-02 | Esquemas Zod para autores | `AuthorSchema`, `CreateAuthorSchema` | Verificar validación de nombre requerido | ☐ |
| VAL-03 | Esquemas Zod para usuarios | `LibraryUserSchema`, `CreateLibraryUserSchema` | Verificar validación de email con formato correcto | ☐ |
| VAL-04 | Tipos TypeScript | Todos los tipos exportados | Verificar que no hay `any` types sin justificación | ☐ |

### 2. Lógica de API (src/worker/index.ts)

| ID | Caso de Prueba | Endpoint | Verificación | Estado |
|----|----------------|----------|--------------|--------|
| API-01 | GET libros con búsqueda | `/api/books?search=` | Verificar query SQL con LIKE y parámetros bindeados | ☐ |
| API-02 | POST crear libro | `/api/books` | Verificar validación con Zod antes de INSERT | ☐ |
| API-03 | PUT actualizar libro | `/api/books/:id` | Verificar actualización de `updated_at` timestamp | ☐ |
| API-04 | DELETE libro con préstamos | `/api/books/:id` | Verificar query COUNT de préstamos activos antes de eliminar | ☐ |
| API-05 | GET autores | `/api/authors` | Verificar inclusión de contador de libros en query | ☐ |
| API-06 | DELETE autor con libros | `/api/authors/:id` | Verificar query COUNT de libros antes de eliminar | ☐ |
| API-07 | POST crear usuario | `/api/users` | Verificar generación automática de `member_id` secuencial | ☐ |
| API-08 | POST crear checkout Stripe | `/api/stripe/create-checkout` | Verificar que saldo > 0 antes de crear sesión | ☐ |
| API-09 | POST webhook Stripe | `/api/stripe/webhook` | Verificar validación de firma con `STRIPE_WEBHOOK_SECRET` | ☐ |
| API-10 | Manejo de errores | Todos los endpoints | Verificar try-catch y respuestas con códigos HTTP apropiados | ☐ |

### 3. Estructura de Base de Datos

| ID | Caso de Prueba | Tabla | Verificación | Estado |
|----|----------------|-------|--------------|--------|
| DB-01 | Tabla books | `books` | Verificar columnas: id, title, author_id, isbn, publication_date, total_copies, available_copies, created_at, updated_at | ☐ |
| DB-02 | Tabla authors | `authors` | Verificar columnas: id, name, bio, created_at, updated_at | ☐ |
| DB-03 | Tabla library_users | `library_users` | Verificar columnas: id, member_id, name, email, phone, address, date_of_birth, registration_date, is_active, outstanding_balance, created_at, updated_at | ☐ |
| DB-04 | Tabla loans | `loans` | Verificar columnas: id, user_id, book_id, loan_date, due_date, return_date, is_returned, created_at, updated_at | ☐ |
| DB-05 | Índices | Todas las tablas | Verificar índices en campos de búsqueda frecuente | ☐ |
| DB-06 | Tipos de datos | Todas las tablas | Verificar que booleans usan INTEGER (0/1) para SQLite | ☐ |

### 4. Componentes React (src/react-app/)

| ID | Caso de Prueba | Componente | Verificación | Estado |
|----|----------------|-----------|--------------|--------|
| UI-01 | BookModal | `components/BookModal.tsx` | Verificar useState para formData, useEffect para cargar datos en modo edición | ☐ |
| UI-02 | AuthorModal | `components/AuthorModal.tsx` | Verificar validación de campos requeridos antes de submit | ☐ |
| UI-03 | UserModal | `components/UserModal.tsx` | Verificar validación de email en campo de formulario | ☐ |
| UI-04 | Books page | `pages/Books.tsx` | Verificar fetch de datos en useEffect, manejo de estados de loading y error | ☐ |
| UI-05 | Authors page | `pages/Authors.tsx` | Verificar filtrado local vs búsqueda en servidor | ☐ |
| UI-06 | Users page | `pages/Users.tsx` | Verificar renderizado condicional de botón de pago según saldo | ☐ |
| UI-07 | Manejo de errores | Todos los componentes | Verificar try-catch en llamadas async y mensajes de error al usuario | ☐ |
| UI-08 | Accesibilidad | Todos los formularios | Verificar labels asociados a inputs, navegación por teclado | ☐ |

### 5. Integración con Stripe

| ID | Caso de Prueba | Archivo | Verificación | Estado |
|----|----------------|---------|--------------|--------|
| STR-01 | Configuración de secretos | `src/worker/env.d.ts` | Verificar tipos para `STRIPE_SECRET_KEY` y `STRIPE_WEBHOOK_SECRET` | ☐ |
| STR-02 | Creación de checkout | `src/worker/index.ts` línea ~380 | Verificar parámetros: amount, currency, success_url, cancel_url, metadata | ☐ |
| STR-03 | Webhook signature | `src/worker/index.ts` línea ~440 | Verificar uso de `stripe.webhooks.constructEvent` para validar firma | ☐ |
| STR-04 | Actualización de saldo | `src/worker/index.ts` línea ~450 | Verificar UPDATE de `outstanding_balance` a 0 tras pago exitoso | ☐ |

## Ejecución de Pruebas

### Ambiente de Desarrollo
- URL: Vista previa de Mocha
- Base de datos: D1 development
- Stripe: Modo de prueba (test keys)

### Ambiente de Producción
- URL: App publicada
- Base de datos: D1 production
- Stripe: Modo live (production keys)

## Notas Importantes

1. **Separación de Ambientes**: Los datos en desarrollo y producción están completamente separados. Las pruebas en desarrollo no afectan producción.

2. **Tarjetas de Prueba Stripe**:
   - Éxito: 4242 4242 4242 4242
   - Rechazada: 4000 0000 0000 0002
   - Fecha: Cualquier fecha futura
   - CVC: Cualquier 3 dígitos

3. **Datos de Prueba**: Crear datos de prueba suficientes antes de ejecutar casos:
   - Al menos 5 autores
   - Al menos 10 libros
   - Al menos 5 usuarios
   - Al menos 2 préstamos activos

4. **Registro de Resultados**: Marcar cada caso como ✓ (pasó), ✗ (falló), o ~ (parcial) después de ejecutarlo.
