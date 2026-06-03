# Dev-News

Un lector moderno y limpio de Hacker News construido con **Next.js 15** (App Router) y **Tailwind CSS v4**.

## Stack

| Capa         | Tecnología                        |
| ------------ | --------------------------------- |
| Frontend     | Next.js 15, React 19, Tailwind v4 |
| Backend      | Next.js API Route (local)         |
|              | Python / FastAPI (Vercel)         |
| Gestor pkg   | pnpm                              |
| Despliegue   | Vercel (Hobby/Pro)                |

## Funcionalidades

- Datos reales de la API de HN (`https://hacker-news.firebaseio.com/v0`)
- Layout de tarjetas con historia destacada, búsqueda y filtro de marcadores
- Las tarjetas enlazan directamente al artículo original
- Datos mock de respaldo cuando la API no está disponible (banner ámbar de aviso)
- Caché de 120s en la ruta de la API

## Inicio rápido

```bash
pnpm install
pnpm run dev
```

La app corre sola en `http://localhost:3000` — no necesita backend Python.

## Arquitectura

**Desarrollo local:** `src/app/api/news/route.ts` obtiene datos de la HN Firebase API y devuelve 30 items. El frontend llama a `/api/news` y si falla usa datos mock (`src/lib/mock-data.ts`).

**Producción (Vercel):** `vercel.json` redirige `/api/(.*)` a una función serverless Python en `api/index.py` (FastAPI). La ruta de Next.js se ignora en favor del backend Python.

## Estructura del proyecto

```
src/
├── app/
│   ├── api/news/route.ts   # Manejador API HN (local)
│   ├── globals.css         # Estilos globales + Tailwind
│   ├── layout.tsx          # Layout raíz + metadatos
│   └── page.tsx            # Página principal (Hero + grid)
├── components/
│   ├── news-card.tsx       # Tarjeta de historia
│   ├── footer.tsx          # Pie de página
│   └── ui/                 # Primitivas estilo shadcn
├── hooks/
│   ├── use-news.ts         # Lógica de fetch + fallback
│   └── use-bookmarks.ts    # Marcadores en LocalStorage
├── lib/
│   ├── mock-data.ts        # Datos de respaldo (30 items)
│   └── news-api.ts         # Cliente API tipado
├── types/
│   └── index.ts            # Tipos compartidos
api/                        # Python/FastAPI (solo Vercel)
├── hn_app/
│   ├── main.py
│   └── ...
└── index.py                # Entry point serverless Vercel
vercel.json                 # Rewrite /api/* → Python
next.config.ts              # Limpio (sin rewrites)
```

## Comandos

| Comando             | Acción                        |
| ------------------- | ----------------------------- |
| `pnpm run dev`      | Iniciar servidor de desarrollo |
| `pnpm run build`    | Build de producción            |
| `pnpm run start`    | Iniciar servidor de producción |
| `pnpm run lint`     | Ejecutar ESLint                |

## Despliegue

La app se despliega automáticamente en Vercel con cada push a la rama main.

- **Plan Hobby:** `maxDuration: 10s` — la API de HN puede exceder el tiempo bajo carga.
- **Plan Pro:** Aumentar `maxDuration` a `30s` en `vercel.json` para mayor confiabilidad.
