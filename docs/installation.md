# 🛠️ Manual Técnico de Instalación - Sistema Biblioteca Jenny

Guía completa para la instalación, configuración y despliegue del sistema.

## 📑 Tabla de Contenidos

1. [Requisitos del Sistema](#requisitos-del-sistema)
2. [Instalación en Mocha](#instalación-en-mocha)
3. [Configuración de Base de Datos](#configuración-de-base-de-datos)
4. [Configuración de Stripe](#configuración-de-stripe)
5. [Variables de Entorno](#variables-de-entorno)
6. [Despliegue a Producción](#despliegue-a-producción)
7. [Configuración Avanzada](#configuración-avanzada)
8. [Troubleshooting](#troubleshooting)
9. [Mantenimiento](#mantenimiento)

## 💻 Requisitos del Sistema

### Requisitos de Desarrollo

**Cuenta de Mocha:**
- Suscripción activa en [getmocha.com](https://getmocha.com)
- Cualquier tier (Free, Bronze, Silver, Gold)

**Navegador Web:**
- Chrome 90+ (recomendado)
- Firefox 88+
- Safari 14+
- Edge 90+

**Conexión a Internet:**
- Mínimo 5 Mbps para desarrollo
- 10+ Mbps recomendado

### Requisitos para Pagos (Opcional)

**Cuenta de Stripe:**
- Cuenta verificada en [stripe.com](https://stripe.com)
- Claves API (Test y Live)
- Configuración de webhooks

## 🚀 Instalación en Mocha

### Opción 1: Desde Plantilla (Recomendado)

Si este proyecto existe como plantilla en Mocha:

1. Inicia sesión en [getmocha.com](https://getmocha.com)
2. Haz clic en **"New App"**
3. Selecciona **"Biblioteca Jenny"** de las plantillas
4. Asigna un nombre a tu app
5. Haz clic en **"Create"**

### Opción 2: Importar Código

Si tienes acceso al código fuente:

1. Crea una nueva app en Mocha
2. Sube los archivos del proyecto:
   ```
   src/
   docs/
   index.html
   package.json
   tsconfig.json
   vite.config.ts
   ```
3. Mocha instalará automáticamente las dependencias

### Opción 3: Desarrollo Local

⚠️ **Nota**: Mocha es principalmente una plataforma en la nube. Para desarrollo local necesitarías configurar Cloudflare Workers localmente (complejo).

## 🗄️ Configuración de Base de Datos

### Esquema de Base de Datos

El proyecto incluye migraciones automáticas. Al primer despliegue:

1. Mocha ejecutará las migraciones automáticamente
2. Se crearán las siguientes tablas:
   - `authors` - Autores de libros
   - `books` - Catálogo de libros
   - `library_users` - Usuarios/miembros
   - `loans` - Registro de préstamos
   - `payments` - Historial de pagos

### Verificar Esquema

Para verificar que las tablas se crearon:

1. En Mocha, ve a tu app
2. Abre la consola de desarrollo (F12)
3. Ejecuta una consulta de prueba:
   ```sql
   SELECT * FROM authors LIMIT 1;
   ```

### Datos de Prueba (Opcional)

Para agregar datos de prueba iniciales:

1. Accede a la interfaz web
2. Agrega manualmente algunos autores de prueba
3. Agrega libros de prueba
4. Crea usuarios de prueba

**Autores de Ejemplo:**
```
Gabriel García Márquez - Colombia
Isabel Allende - Chile
Mario Vargas Llosa - Perú
```

**Libros de Ejemplo:**
```
Cien años de soledad - García Márquez
La casa de los espíritus - Allende
La ciudad y los perros - Vargas Llosa
```

## 💳 Configuración de Stripe

### Paso 1: Crear Cuenta de Stripe

1. Ve a [stripe.com/register](https://stripe.com/register)
2. Completa el registro
3. Verifica tu email
4. Completa la información de tu negocio

### Paso 2: Obtener Claves API

**Para Testing (Ambiente de Desarrollo):**

1. Accede al [Dashboard de Stripe](https://dashboard.stripe.com)
2. Asegúrate de estar en modo **"Test"** (toggle arriba)
3. Ve a **Developers → API keys**
4. Copia:
   - **Secret key** (comienza con `sk_test_...`)

**Para Producción:**

1. Activa tu cuenta de Stripe (proporciona info bancaria)
2. Cambia a modo **"Live"**
3. Ve a **Developers → API keys**
4. Copia:
   - **Secret key** (comienza con `sk_live_...`)

### Paso 3: Configurar Webhooks

Los webhooks permiten que Stripe notifique a tu app sobre pagos completados.

**Crear Webhook:**

1. En Stripe Dashboard, ve a **Developers → Webhooks**
2. Haz clic en **"Add endpoint"**
3. Configura:
   - **Endpoint URL**: 
     - Dev: `https://tu-app.mocha.workers.dev/api/webhooks/stripe`
     - Prod: `https://tu-dominio.com/api/webhooks/stripe`
   - **Events to send**:
     - `checkout.session.completed`
4. Haz clic en **"Add endpoint"**
5. Copia el **Signing secret** (comienza con `whsec_...`)

### Paso 4: Agregar Secretos en Mocha

1. En Mocha, abre tu app
2. Ve a **Settings → Secrets** (o el menú de configuración)
3. Agrega las siguientes variables:

**Para Testing:**
```
STRIPE_SECRET_KEY = sk_test_tu_clave_aqui
STRIPE_WEBHOOK_SECRET = whsec_tu_secreto_webhook_aqui
```

**Para Producción:**
```
STRIPE_SECRET_KEY = sk_live_tu_clave_aqui
STRIPE_WEBHOOK_SECRET = whsec_tu_secreto_webhook_produccion_aqui
```

### Verificar Integración de Stripe

1. En tu app, ve a la sección **"Usuarios"**
2. Selecciona un usuario con saldo pendiente
3. Haz clic en **"Pagar Multa"**
4. Deberías ser redirigido a Stripe Checkout
5. Usa una [tarjeta de prueba de Stripe](https://stripe.com/docs/testing):
   ```
   Número: 4242 4242 4242 4242
   Fecha: Cualquier fecha futura
   CVC: Cualquier 3 dígitos
   ```
6. Completa el pago
7. Verifica que el saldo del usuario se actualice

## 🔧 Variables de Entorno

### Variables Requeridas

**Base de Datos (Automáticas):**
- `DB` - Binding a la base de datos D1 (creada por Mocha)

**Stripe (Manuales):**
- `STRIPE_SECRET_KEY` - Clave secreta de Stripe
- `STRIPE_WEBHOOK_SECRET` - Secreto de webhook de Stripe

### Variables Opcionales

Actualmente no hay variables opcionales, pero en el futuro podría incluir:
- `MAX_LOAN_DAYS` - Días por defecto de préstamo
- `LATE_FEE_PER_DAY` - Multa diaria por retraso
- `EMAIL_API_KEY` - Para envío de notificaciones

### Configurar Variables

**En Mocha:**
1. Settings → Secrets
2. Agrega cada variable con su valor
3. Guarda los cambios

**Verificar Variables:**
```typescript
// En src/worker/index.ts
console.log('Stripe configurado:', !!c.env.STRIPE_SECRET_KEY);
```

## 🌐 Despliegue a Producción

### Preparación Pre-Despliegue

**Checklist:**
- [ ] Migraciones de BD probadas en dev
- [ ] Stripe configurado con claves live
- [ ] Webhook de producción configurado
- [ ] Datos de prueba eliminados (opcional)
- [ ] URLs actualizadas (success/cancel)
- [ ] Testing completo realizado

### Proceso de Despliegue en Mocha

1. **Revisar Cambios:**
   - Verifica que todo funcione en preview
   - Prueba todos los flujos principales

2. **Publicar App:**
   - En Mocha, haz clic en **"Publish"**
   - Elige tu dominio (subdominio.mocha.app o custom)
   - Confirma la publicación

3. **Actualizar Webhook de Stripe:**
   - Ve a Stripe Dashboard
   - Edita el webhook
   - Actualiza la URL al dominio de producción
   - Guarda cambios

4. **Verificación Post-Despliegue:**
   - Accede a tu app en producción
   - Crea un registro de prueba
   - Prueba un pago con Stripe
   - Verifica webhooks en Stripe Dashboard

### Dominio Personalizado (Opcional)

Para usar tu propio dominio:

1. En Mocha, ve a Settings → Domains
2. Agrega tu dominio personalizado
3. Configura los DNS según las instrucciones
4. Espera la propagación DNS (hasta 48h)
5. Actualiza la URL del webhook en Stripe

## ⚙️ Configuración Avanzada

### Ajustar Políticas de Préstamo

**Días por Defecto de Préstamo:**

En `src/react-app/components/LoanModal.tsx`:

```typescript
// Cambiar 14 días a tu preferencia
const defaultDueDate = new Date();
defaultDueDate.setDate(defaultDueDate.getDate() + 14); // Cambiar este número
```

**Multa por Día:**

En `src/worker/index.ts`, función `return`:

```typescript
// Cambiar $5 a tu preferencia
const daysLate = Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
lateFee = daysLate * 5; // Cambiar este número
```

### Personalizar Moneda

Actualmente configurado para pesos mexicanos (MXN). Para cambiar:

**En Stripe Checkout (`src/worker/index.ts`):**

```typescript
price_data: {
  currency: "mxn", // Cambiar a: usd, eur, etc.
  // ...
}
```

### Límites y Restricciones

**Límite de Préstamos por Usuario:**

Actualmente ilimitado. Para agregar límite:

```typescript
// En POST /api/loans
const activeLoans = await db.prepare(
  "SELECT COUNT(*) as count FROM loans WHERE user_id = ? AND is_returned = 0"
).bind(data.user_id).first();

if (activeLoans.count >= 3) { // Límite de 3 libros
  return c.json({ error: "El usuario ya tiene el máximo de préstamos" }, 400);
}
```

## 🔍 Troubleshooting

### Problema: Preview no Carga

**Síntomas:** Pantalla en blanco o error al cargar

**Soluciones:**
1. Haz clic en el menú (...) → "Restart Sandbox"
2. Espera 30 segundos
3. Recarga la página
4. Si persiste, contacta support@getmocha.com

### Problema: Error al Instalar Dependencias

**Síntomas:** Error npm install o packages no encontrados

**Soluciones:**
1. Verifica que package.json esté correcto
2. Restart Sandbox
3. Espera a que Mocha reinstale automáticamente
4. Verifica versiones de Node compatibles

### Problema: Stripe No Funciona

**Síntomas:** Error al crear checkout session

**Diagnóstico:**
```typescript
// Agregar logs temporales
console.log('Stripe Key:', c.env.STRIPE_SECRET_KEY?.substring(0, 10));
```

**Soluciones:**
1. Verifica que `STRIPE_SECRET_KEY` esté configurada
2. Confirma que estás usando la clave correcta (test vs live)
3. Revisa que la clave no tenga espacios extra
4. Verifica en Stripe Dashboard que la clave esté activa

### Problema: Webhooks No Funcionan

**Síntomas:** Pagos completados pero saldo no actualizado

**Diagnóstico:**
1. Ve a Stripe Dashboard → Webhooks
2. Revisa los eventos recibidos
3. Busca errores en los logs

**Soluciones:**
1. Verifica que la URL del webhook sea correcta
2. Confirma que `STRIPE_WEBHOOK_SECRET` esté configurado
3. Revisa que el evento `checkout.session.completed` esté habilitado
4. Prueba reenviar un evento desde Stripe Dashboard

### Problema: Base de Datos No Se Crea

**Síntomas:** Error "table does not exist"

**Soluciones:**
1. Verifica que las migraciones existan en el código
2. En Mocha, revisa Database → Migrations
3. Si las migraciones no se ejecutaron, contacta soporte
4. Como último recurso, ejecuta manualmente las migraciones

### Problema: Copias Disponibles Incorrectas

**Síntomas:** Inventario desactualizado

**Diagnóstico:**
```sql
SELECT id, title, copies_total, copies_available FROM books;
```

**Solución Manual:**
```sql
-- Recalcular copias disponibles
UPDATE books SET copies_available = (
  copies_total - (
    SELECT COUNT(*) FROM loans 
    WHERE loans.book_id = books.id AND is_returned = 0
  )
);
```

## 🔄 Mantenimiento

### Respaldos de Base de Datos

Mocha maneja respaldos automáticamente, pero puedes:

1. Exportar datos periódicamente (cuando la función esté disponible)
2. Mantener un registro manual de cambios importantes
3. Documentar configuraciones críticas

### Actualizaciones del Sistema

**Proceso Recomendado:**

1. **Prueba en Dev:**
   - Haz cambios en el ambiente de desarrollo
   - Prueba exhaustivamente

2. **Crea Versión:**
   - En Mocha: Settings → Versions
   - Crea snapshot antes de actualizar

3. **Deploy Gradual:**
   - Publica en producción
   - Monitorea por 24h
   - Si hay problemas, revierte a versión anterior

### Limpieza de Datos

**Préstamos Antiguos:**

Considera eliminar préstamos muy antiguos para mejorar rendimiento:

```sql
-- Ver préstamos devueltos hace más de 1 año
SELECT * FROM loans 
WHERE is_returned = 1 
AND return_date < date('now', '-1 year');

-- Eliminar si es apropiado
DELETE FROM loans 
WHERE is_returned = 1 
AND return_date < date('now', '-1 year');
```

### Monitoreo

**Métricas a Revisar:**

1. **Préstamos Vencidos:** Revisar semanalmente
2. **Saldos Pendientes:** Gestionar activamente
3. **Disponibilidad de Libros:** Actualizar inventario
4. **Usuarios Inactivos:** Limpiar o reactivar

### Actualizaciones de Dependencias

Mocha maneja esto automáticamente, pero si necesitas actualizar:

1. Edita `package.json`
2. Actualiza versiones
3. Mocha reinstalará en el próximo build

## 📞 Soporte Técnico

### Recursos de Ayuda

1. **Documentación de Mocha:**
   - [docs.getmocha.com](https://docs.getmocha.com)

2. **Soporte de Mocha:**
   - Email: support@getmocha.com
   - Discord: Canal de soporte

3. **Documentación de Stripe:**
   - [stripe.com/docs](https://stripe.com/docs)

4. **Este Proyecto:**
   - README.md
   - docs/user-guide.md
   - docs/coding-standards.md

### Antes de Contactar Soporte

Recopila la siguiente información:

1. Descripción del problema
2. Pasos para reproducir
3. Mensajes de error (screenshots)
4. Versión del navegador
5. ¿Funciona en preview pero no en producción?
6. ¿Qué has intentado?

## 🎓 Próximos Pasos

Después de la instalación:

1. ✅ Prueba todas las funciones principales
2. ✅ Configura Stripe para pagos
3. ✅ Personaliza políticas según tu biblioteca
4. ✅ Carga tu catálogo inicial
5. ✅ Capacita a los bibliotecarios
6. ✅ Publica a producción
7. ✅ Monitorea y mejora continuamente

---

**¿Problemas con la instalación?** Contacta a support@getmocha.com
