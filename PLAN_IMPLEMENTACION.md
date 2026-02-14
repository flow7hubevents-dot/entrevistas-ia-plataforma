# Plan de Implementación: AIEntrevistasPro MVP (V3)

Este documento detalla la hoja de ruta técnica para el desarrollo de la plataforma SaaS **AIEntrevistasPro**. El enfoque principal es un MVP funcional, cobrable y con el factor diferenciador del avatar interactivo con IA.

## 1. Arquitectura del Sistema

- **Frontend:** Next.js 15 (App Router) + TypeScript.
- **Estilos:** Tailwind CSS + shadcn/ui.
- **Animación:** Rive (@rive-app/react-canvas) para el avatar con State Machine.
- **IA Conversacional:** Google Gemini API (streaming para latencia mínima).
- **Backend/Base de Datos:** Supabase (Auth, PostgreSQL, Storage).
- **Pagos:** Stripe (Checkout + Webhooks + Portal).
- **APIs de Navegador:** Web Speech API (transcripción) y MediaRecorder API (grabación).

---

## 2. Estructura de Carpetas

```text
/
├── app/
│   ├── (auth)/             # Login, Registro, Magic Link
│   ├── (dashboard)/        # Panel principal según rol
│   │   ├── student/
│   │   ├── educator/
│   │   └── recruiter/
│   ├── (interview)/        # Sala de entrevista (Layout minimalista)
│   │   └── interview/[id]/
│   ├── api/
│   │   ├── chat/           # Endpoint Gemini (Streaming)
│   │   ├── stripe/         # Checkout y Webhooks
│   │   └── feedback/       # Generación de reportes post-entrevista
│   └── layout.tsx
├── components/
│   ├── interview/
│   │   ├── RiveAvatar.tsx  # Controlador del avatar y moods
│   │   ├── WebcamPiP.tsx   # Video del usuario
│   │   └── Controls.tsx    # Mute, End, Reset Mood
│   ├── shared/             # Botones, Modales, shadcn
│   └── ui/                 # Componentes de shadcn/ui
├── hooks/
│   ├── useTranscription.ts # Web Speech API wrapper
│   └── useMediaRecorder.ts # Grabación de audio/video
├── lib/
│   ├── supabase/           # Clientes y helpers de DB
│   ├── stripe/             # Configuración de Stripe
│   └── gemini/             # Configuración del prompt por mood
├── types/                  # Interfaces de TS (Profiles, Interviews, Moods)
└── public/
    ├── assets/
    │   └── avatar.riv      # Archivo de Rive principal
    └── backgrounds/        # Fondos de oficina
```

---

## 3. Schema de Base de Datos (Supabase)

### Tabla `profiles`
- `id`: uuid (primary key, linked to auth.users)
- `email`: text
- `full_name`: text
- `role`: enum ('student', 'educator', 'recruiter')
- `stripe_customer_id`: text
- `subscription_tier`: enum ('free', 'pro', 'team')
- `credits`: int (default 0, para voces premium)
- `created_at`: timestamptz

### Tabla `interviews`
- `id`: uuid
- `user_id`: uuid (fk profiles)
- `template_id`: uuid (opcional)
- `moods`: text[] (los 2 moods seleccionados)
- `status`: enum ('scheduled', 'completed', 'cancelled')
- `recording_url`: text (link a Supabase Storage)
- `transcript`: jsonb
- `feedback`: jsonb (score, strengths, weaknesses)
- `created_at`: timestamptz

### Tabla `subscriptions`
- `id`: text (stripe sub id)
- `user_id`: uuid (fk profiles)
- `status`: text
- `price_id`: text
- `current_period_end`: timestamptz

---

## 4. Implementación del Avatar y Moods

### Lista de 15 Moods Base
1. Somnoliento, 2. Enfadado, 3. Escéptico, 4. Impaciente, 5. Curioso, 6. Empático, 7. Sarcástico, 8. Aburrido, 9. Alegre, 10. Estresado, 11. Triste, 12. Exigente, 13. Distraído, 14. Autoritario, 15. Tímido.

### Lógica de Selección
Al iniciar la entrevista, se ejecuta un script que selecciona 2 moods de forma aleatoria (ej: "Sarcástico" + "Impaciente").

### Impacto en la Experiencia
- **Gemini Prompt:** Se inyectan instrucciones específicas al system prompt para que adapte el tono y la dificultad basándose en el mood combinado.
- **Rive State Machine:** El componente `RiveAvatar` enviará inputs al archivo `.riv` (ej: `mood_score_1 = 100`, `mood_score_2 = 50`) para que las animaciones de ojos, boca y postura se mezclen.
- **Lip-sync:** Se usará el `AudioContext` para detectar la amplitud de la voz (TTS) y mover un parámetro `blink` o `mouthOpen` en Rive.

---

## 5. Estrategia de Monetización (Stripe)

- **Productos:**
  - `prod_free`: 0€ (Límite 3 entrevistas/mes).
  - `prod_pro`: 9.99€/mes (Acceso total).
  - `prod_team`: 79€/mes + 7€/seat.
  - `prod_voice_credit`: 1.50€ (One-time purchase).
- **Webhooks:** Sincronización de estado de suscripción y recarga de créditos.
- **Middleware:** Protección de rutas y límites de uso basados en el tier del usuario.

---

## 6. Fases de Desarrollo

### Fase 1: Cimientos (Días 1-2)
- [ ] Inicialización Next.js 15, shadcn/ui y Tailwind.
- [ ] Configuración Supabase (Auth, DB Schema, RLS).
- [ ] Implementación de roles y dashboards básicos por rol.

### Fase 2: El Entrevistador IA (Días 3-5)
- [ ] Integración de Rive: Carga del avatar y control de State Machine.
- [ ] Módulo de Moods: Lógica de combinación y prompts dinámicos para Gemini.
- [ ] Chat en streaming con Web Speech API para transcripción simultánea.

### Fase 3: La Sala de Entrevista (Días 6-7)
- [ ] Layout de la sala: Avatar central, PiP de webcam, controles flotantes.
- [ ] Grabación de sesión con MediaRecorder y subida a Storage.
- [ ] Generación de Feedback automático post-entrevista.

### Fase 4: Monetización y Pulido (Días 8-10)
- [ ] Integración completa con Stripe (Checkout, Webhooks).
- [ ] Sistema de créditos para voces personalizadas.
- [ ] Reportes en PDF y exportación de datos.
- [ ] Diseño UX/UI Premium (micro-animaciones, modo oscuro).

---

Este plan garantiza un lanzamiento rápido centrándose en la interactividad visual, que es el mayor punto de venta frente a la competencia.
