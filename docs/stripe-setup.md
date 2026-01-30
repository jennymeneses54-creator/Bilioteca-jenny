# Configuración de Stripe

Para que el sistema de pagos funcione correctamente, necesitas configurar Stripe siguiendo estos pasos:

## 1. Obtener las claves de API de Stripe

1. Ve a [Stripe Dashboard](https://dashboard.stripe.com/)
2. Regístrate o inicia sesión
3. Ve a **Developers → API keys**
4. Copia tu **Secret key** (empieza con `sk_test_` o `sk_live_`)
5. Pégala en el campo `STRIPE_SECRET_KEY` en Settings → Secrets de tu app Mocha

## 2. Configurar el Webhook

**IMPORTANTE**: Debes publicar tu app primero para obtener una URL pública.

1. Publica tu app usando el botón "Publish" en Mocha
2. Copia la URL de tu app publicada (ejemplo: `https://biblioteca-jenny.mocha.app`)
3. En Stripe Dashboard, ve a **Developers → Webhooks**
4. Haz clic en **Add endpoint**
5. Ingresa la URL del webhook: `https://TU-DOMINIO.mocha.app/api/webhooks/stripe`
6. En **Events to send**, selecciona: `checkout.session.completed`
7. Haz clic en **Add endpoint**
8. Copia el **Signing secret** (empieza con `whsec_`)
9. Pégalo en el campo `STRIPE_WEBHOOK_SECRET` en Settings → Secrets de tu app Mocha

## 3. Probar el sistema

En modo de prueba (test mode), puedes usar estas tarjetas:

- **Tarjeta exitosa**: `4242 4242 4242 4242`
- Cualquier fecha futura de expiración
- Cualquier CVC de 3 dígitos

## 4. Ir a producción

Cuando estés listo para aceptar pagos reales:

1. Completa el proceso de activación de tu cuenta en Stripe
2. Cambia a **Live mode** en el Stripe Dashboard
3. Actualiza `STRIPE_SECRET_KEY` con tu clave de producción (empieza con `sk_live_`)
4. Actualiza el webhook para usar las claves de producción

## Notas importantes

- Los pagos se procesan en **MXN (Pesos Mexicanos)**
- Los usuarios recibirán un recibo por email automáticamente
- El saldo del usuario se actualiza automáticamente después del pago
- Todos los pagos quedan registrados en la base de datos
