# Process Scheduler Simulator

Simulador interactivo de algoritmos de planificación de procesos con visualización en tiempo real y métricas comparativas. Incluye: **FCFS**, **SJF (no expropiativo)** y **SRTF (expropiativo)**.

## Funcionalidades

- **Visualización del flujo de procesos**: líneas de tiempo, estados (ejecución, espera, completado) y progreso en tiempo real.
- **Generación dinámica de procesos**: tiempos de llegada y ráfaga variables, con configuración de simulación.
- **Métricas en vivo**: tiempo de espera, tiempo de retorno, throughput y utilización de CPU.
- **Comparación de algoritmos**: panel para contrastar resultados entre FCFS, SJF y SRTF.
- **Análisis de equidad**: distribución de tiempos para evaluar fairness entre procesos.
- **Controles interactivos**: pausar/reanudar, reiniciar, y ajustar configuración.
- **Accesibilidad**: atajos y mejoras ARIA básicas.
- **PWA**: instalable y funcional sin conexión (Service Worker).
- **Arquitectura limpia**: hexagonal con DDD, separación por capas.

## Estructura del proyecto

```
src/
├── application/
│   ├── dto/                    # DTOs de intercambio entre capas
│   ├── services/               # Servicios de orquestación (p. ej., SimulationService)
│   └── use-cases/              # Casos de uso (StartSimulation, métricas, etc.)
├── domain/
│   ├── entities/               # Entidades de dominio (Process, AlgorithmMetrics)
│   ├── repositories/           # Puertos: interfaces (IProcessScheduler, repositorios)
│   └── value-objects/          # VOs (ArrivalTime, BurstTime, SimulationConfig, ProcessId)
├── infrastructure/
│   ├── algorithms/             # Implementaciones: FCFS, SJF, SRTF y validadores
│   ├── generators/             # Generadores de procesos
│   └── repositories/           # Adaptadores de repositorio
├── presentation/
│   ├── adapters/               # Adaptadores para UI (SimulationAdapter)
│   ├── components/             # Componentes React (UI, métricas, simulación, PWA)
│   ├── hooks/                  # Hooks (simulación, métricas, accesibilidad, PWA)
│   ├── stores/                 # Estado global (Zustand)
│   └── views/                  # Vistas principales (SimulationView)
├── shared/
│   ├── config/                 # Contenedor DI, rutas/paths
│   ├── types/                  # Tipos compartidos
│   └── utils/                  # Utilidades y rendimiento
├── App.tsx                     # Entrypoint de la app
├── main.tsx                    # Bootstrap de React
└── index.css                   # Estilos globales (Tailwind)
```

## Algoritmos incluidos

- **FCFS (First Come, First Serve)**: no expropiativo; ejecución por orden de llegada.
- **SJF (Shortest Job First)**: no expropiativo; prioriza ráfagas más cortas.
- **SRTF (Shortest Remaining Time First)**: expropiativo; puede interrumpir si llega un proceso con menor tiempo restante.

## Tecnologías

- **Vite 5** (build y dev server)
- **React 18 + TypeScript**
- **Tailwind CSS**
- **Lucide React** (iconos)
- **Zustand** (estado)
- **vite-plugin-pwa** (PWA)

## Requisitos previos

- Node.js 18+ y npm 9+

## Instalación y ejecución

```bash
git clone <repository-url>
cd <directorio-del-proyecto>
npm install
npm run dev
```

## Scripts disponibles

```bash
npm run dev      # Inicia el servidor de desarrollo
npm run build    # Compila TypeScript y construye con Vite
npm run preview  # Previsualiza la build de producción
npm run lint     # Linting del código
```

## Build de producción

```bash
npm run build
npm run preview
```
