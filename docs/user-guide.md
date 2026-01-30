# 📖 Guía de Usuario - Sistema Biblioteca Jenny

Manual completo para el uso del sistema de gestión bibliotecaria.

## 📑 Tabla de Contenidos

1. [Introducción](#introducción)
2. [Acceso al Sistema](#acceso-al-sistema)
3. [Gestión de Autores](#gestión-de-autores)
4. [Gestión de Libros](#gestión-de-libros)
5. [Gestión de Usuarios](#gestión-de-usuarios)
6. [Sistema de Préstamos](#sistema-de-préstamos)
7. [Pagos y Multas](#pagos-y-multas)
8. [Preguntas Frecuentes](#preguntas-frecuentes)

## 🎯 Introducción

Biblioteca Jenny es un sistema completo para administrar:
- Catálogo de libros y autores
- Usuarios/miembros de la biblioteca
- Préstamos y devoluciones
- Multas y pagos

### Roles del Sistema

Actualmente el sistema no diferencia roles - todos los usuarios tienen acceso completo. En futuras versiones se implementará:
- **Administrador**: Acceso total
- **Bibliotecario**: Gestión de préstamos y usuarios
- **Usuario**: Solo consulta del catálogo

## 🔐 Acceso al Sistema

### Primera Vez

1. Accede a la URL de tu sistema (proporcionada por tu administrador)
2. Verás la página principal con el menú de navegación
3. No se requiere login en la versión actual

### Navegación Principal

El menú superior contiene 4 secciones:

- **📚 Libros**: Catálogo completo de libros
- **✍️ Autores**: Directorio de autores
- **👥 Usuarios**: Gestión de miembros
- **📋 Préstamos**: Control de préstamos

## ✍️ Gestión de Autores

### Agregar un Nuevo Autor

1. Haz clic en **"Autores"** en el menú
2. Presiona el botón **"Agregar Autor"** (esquina superior derecha)
3. Completa el formulario:
   - **Nombre*** (requerido): Nombre completo del autor
   - **Nacionalidad**: País de origen
   - **Fecha de Nacimiento**: Usar el selector de fecha
   - **Biografía**: Información sobre el autor
4. Haz clic en **"Crear Autor"**

### Editar un Autor

1. Ubica al autor en la lista
2. Pasa el mouse sobre la tarjeta del autor
3. Haz clic en el ícono de **lápiz** (editar)
4. Modifica los campos necesarios
5. Haz clic en **"Actualizar"**

### Eliminar un Autor

⚠️ **Importante**: No puedes eliminar un autor que tenga libros asociados.

1. Ubica al autor en la lista
2. Pasa el mouse sobre la tarjeta del autor
3. Haz clic en el ícono de **papelera** (eliminar)
4. Confirma la eliminación en el diálogo

### Buscar Autores

Usa la barra de búsqueda para filtrar autores por:
- Nombre
- Nacionalidad

## 📚 Gestión de Libros

### Agregar un Nuevo Libro

1. Haz clic en **"Libros"** en el menú
2. Presiona el botón **"Agregar Libro"**
3. Completa el formulario:

**Campos Obligatorios:**
- **Título***: Nombre del libro
- **Autor***: Selecciona de la lista desplegable
- **Copias Totales**: Número total de ejemplares (mínimo 1)
- **Copias Disponibles**: Ejemplares disponibles para préstamo

**Campos Opcionales:**
- **ISBN**: Código internacional del libro
- **Género**: Categoría (ej: Ficción, Historia, Ciencia)
- **Editorial**: Casa publicadora
- **Año de Publicación**: Año de la primera edición
- **Páginas**: Número de páginas
- **Idioma**: Idioma del libro (por defecto: Español)
- **Descripción**: Sinopsis o resumen

4. Haz clic en **"Crear Libro"**

### Editar un Libro

1. Ubica el libro en el catálogo
2. Pasa el mouse sobre la tarjeta del libro
3. Haz clic en el ícono de **lápiz**
4. Modifica los campos necesarios
5. Haz clic en **"Actualizar"**

### Eliminar un Libro

⚠️ **Importante**: No puedes eliminar un libro que tenga préstamos activos.

1. Ubica el libro en el catálogo
2. Pasa el mouse sobre la tarjeta del libro
3. Haz clic en el ícono de **papelera**
4. Confirma la eliminación

### Buscar Libros

La búsqueda es dinámica y busca en:
- Título del libro
- Nombre del autor
- ISBN

### Interpretar el Estado del Libro

En cada tarjeta de libro verás:
- **Disponibles: X/Y** 
  - Verde: Hay copias disponibles
  - Rojo: No hay copias disponibles (todas prestadas)

## 👥 Gestión de Usuarios

### Registrar un Nuevo Usuario

1. Haz clic en **"Usuarios"** en el menú
2. Presiona el botón **"Agregar Usuario"**
3. Completa el formulario:

**Campos Obligatorios:**
- **Nombre***: Nombre completo
- **Email***: Correo electrónico (debe ser válido)

**Campos Opcionales:**
- **Teléfono**: Número de contacto
- **Dirección**: Domicilio completo
- **Fecha de Nacimiento**: Para estadísticas de edad

4. Haz clic en **"Crear Usuario"**

### ID de Miembro

Cada usuario recibe automáticamente un **ID de Miembro** único:
- Formato: U001, U002, U003, etc.
- Se genera automáticamente al crear el usuario
- No se puede modificar
- Sirve para identificar rápidamente al usuario

### Estado del Usuario

Cada usuario puede estar:
- **Activo** (verde): Puede tomar préstamos
- **Inactivo** (rojo): No puede tomar préstamos

Para cambiar el estado:
1. Edita el usuario
2. Marca/desmarca "Usuario activo"
3. Guarda los cambios

### Saldo Pendiente

Los usuarios acumulan saldo cuando:
- Devuelven libros tarde (multas por retraso)
- Tienen cargos adicionales

El saldo se muestra en cada tarjeta de usuario:
- **$0**: Sin deudas
- **$50**: Debe $50 MXN

### Editar un Usuario

1. Ubica al usuario en la lista
2. Pasa el mouse sobre la tarjeta
3. Haz clic en el ícono de **lápiz**
4. Modifica los campos
5. Haz clic en **"Actualizar"**

### Eliminar un Usuario

⚠️ **Importante**: No puedes eliminar un usuario con préstamos activos.

1. Ubica al usuario en la lista
2. Pasa el mouse sobre la tarjeta
3. Haz clic en el ícono de **papelera**
4. Confirma la eliminación

### Buscar Usuarios

Busca usuarios por:
- Nombre
- ID de Miembro (ej: U001)
- Email

## 📋 Sistema de Préstamos

### Crear un Nuevo Préstamo

1. Haz clic en **"Préstamos"** en el menú
2. Presiona el botón **"Nuevo Préstamo"**
3. Completa el formulario:

**Selección de Libro:**
- Solo aparecen libros con copias disponibles
- Se muestra: "Título - Autor (X disponibles)"
- Al seleccionar un libro, verás su información

**Selección de Usuario:**
- Solo aparecen usuarios activos
- Se muestra: "Nombre (ID) - Email"

**Fecha de Devolución:**
- Por defecto: 14 días desde hoy
- Puedes cambiarla según tus políticas
- No puede ser una fecha pasada

**Notas (opcional):**
- Información adicional sobre el préstamo
- Ej: "Préstamo especial", "Usuario VIP", etc.

4. Haz clic en **"Registrar Préstamo"**

### Qué Sucede al Crear un Préstamo

El sistema automáticamente:
1. ✅ Registra el préstamo con fecha actual
2. ✅ Reduce en 1 las copias disponibles del libro
3. ✅ Establece la fecha de devolución
4. ✅ Calcula si hay retraso (inicialmente no)

### Filtrar Préstamos

Usa los filtros para ver:
- **Todos**: Todos los préstamos
- **Activos**: Solo préstamos no devueltos
- **Devueltos**: Solo préstamos completados
- **Vencidos**: Préstamos activos con fecha vencida

### Interpretar Estados de Préstamo

**Tarjeta Verde (Activo):**
- Préstamo no devuelto
- Aún dentro del plazo

**Tarjeta Amarilla (Por Vencer):**
- Préstamo activo
- Cerca de la fecha de vencimiento

**Tarjeta Roja (Vencido):**
- Préstamo no devuelto
- Fecha de devolución pasada
- Generará multa al devolver

**Tarjeta Azul (Devuelto):**
- Préstamo completado
- Muestra fecha de devolución

### Devolver un Libro

1. Ubica el préstamo en la lista (debe estar activo)
2. Haz clic en el botón **"Devolver"**
3. El sistema automáticamente:
   - ✅ Registra la fecha de devolución (hoy)
   - ✅ Aumenta en 1 las copias disponibles
   - ✅ Calcula multa si hay retraso
   - ✅ Agrega la multa al saldo del usuario

### Cálculo de Multas

**Fórmula:**
- $5 MXN por cada día de retraso

**Ejemplo:**
- Fecha de devolución: 15 de enero
- Fecha real de devolución: 20 de enero
- Días de retraso: 5 días
- Multa: $25 MXN

La multa se agrega automáticamente al **Saldo Pendiente** del usuario.

### Eliminar un Préstamo

⚠️ **Importante**: Solo puedes eliminar préstamos devueltos (para limpiar historial).

1. Ubica el préstamo devuelto
2. Haz clic en el ícono de **papelera**
3. Confirma la eliminación

## 💰 Pagos y Multas

### Ver Saldo de un Usuario

1. Ve a la sección **"Usuarios"**
2. Ubica al usuario
3. El saldo aparece en su tarjeta:
   - **$0**: Sin deudas
   - **$XX**: Monto pendiente

### Procesar un Pago (Stripe)

⚠️ **Nota**: Requiere configuración de Stripe (ver Manual de Instalación)

1. Ubica al usuario con saldo pendiente
2. Haz clic en **"Pagar Multa"** o similar
3. Se abrirá Stripe Checkout
4. El usuario completa el pago
5. El sistema actualiza automáticamente el saldo

### Historial de Pagos

Para ver los pagos de un usuario:
1. Selecciona el usuario
2. Haz clic en **"Ver Historial"** (si disponible)
3. Verás:
   - Monto pagado
   - Fecha del pago
   - Descripción
   - Estado (completado/pendiente)

## ❓ Preguntas Frecuentes

### ¿Puedo tener múltiples copias del mismo libro?

Sí, usa el campo **"Copias Totales"** y **"Copias Disponibles"**.

**Ejemplo:**
- Copias Totales: 5
- Copias Disponibles: 3
- Esto significa que hay 5 libros en total, 2 prestados y 3 disponibles

### ¿Qué pasa si intento prestar un libro sin copias?

El sistema no te dejará. Solo aparecen libros con copias disponibles en el formulario de préstamo.

### ¿Puedo editar un préstamo después de crearlo?

No directamente. Pero puedes:
1. Eliminar el préstamo (si está devuelto)
2. Crear uno nuevo con la información correcta

### ¿Cómo sé si un libro está atrasado?

En la sección de Préstamos:
- Usa el filtro **"Vencidos"**
- Las tarjetas rojas son préstamos vencidos
- Verás cuántos días de retraso lleva

### ¿Puedo cambiar la fecha de devolución de un préstamo activo?

En la versión actual, no. Tendrías que:
1. Devolver el préstamo
2. Crear uno nuevo con la nueva fecha

### ¿Qué pasa si elimino un autor con libros?

El sistema no te dejará. Primero debes:
1. Eliminar o reasignar todos sus libros
2. Luego podrás eliminar al autor

### ¿Puedo exportar datos del sistema?

En la versión actual, no hay función de exportación. Esto está planificado para futuras versiones.

### ¿Cómo restauro un usuario eliminado?

No es posible. Las eliminaciones son permanentes. Ten cuidado al eliminar.

### ¿El sistema envía recordatorios automáticos?

No en la versión actual. Las notificaciones automáticas están planificadas para el futuro.

### ¿Puedo personalizar el monto de las multas?

Actualmente es fijo ($5/día). Se puede modificar en el código si es necesario.

## 🆘 Soporte

Si encuentras problemas o tienes preguntas:

1. Revisa esta guía de usuario
2. Consulta el [Manual de Instalación](installation.md)
3. Revisa los [Casos de Prueba](test-cases.md)
4. Contacta al administrador del sistema

## 📋 Consejos de Uso

### Mejores Prácticas

✅ **Hacer:**
- Registra autores antes de libros
- Verifica datos antes de eliminar
- Usa el buscador para encontrar rápido
- Revisa préstamos vencidos regularmente
- Mantén actualizado el inventario

❌ **Evitar:**
- Eliminar usuarios con préstamos activos
- Crear libros sin autor
- Dejar préstamos sin devolver indefinidamente
- Duplicar autores (busca primero)

### Flujo de Trabajo Recomendado

**Setup Inicial:**
1. Crear autores
2. Agregar libros al catálogo
3. Registrar usuarios/miembros

**Operación Diaria:**
1. Revisar préstamos vencidos
2. Procesar devoluciones
3. Crear nuevos préstamos
4. Gestionar pagos de multas

**Mantenimiento:**
1. Actualizar información de libros
2. Verificar inventario
3. Limpiar préstamos antiguos
4. Revisar usuarios inactivos

---

**¿Necesitas ayuda adicional?** Contacta al administrador del sistema.
