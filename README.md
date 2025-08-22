# Process Scheduler Simulator

Interactive real-time visualization of process scheduling algorithms: **First Come, First Serve (FCFS)** and **Shortest Process (SP) with preemption**.

## Features

- Real-time process flow visualization
- Dynamic process generation with variable times and sizes
- Live process state visualization (running, waiting, completed)
- Real-time performance metrics (wait time, throughput, CPU utilization)
- Algorithm comparison
- Modern responsive interface
- Interactive controls (pause, restart, configuration)
- Clean hexagonal architecture with DDD
- PWA (Progressive Web App) - Installable and works offline

## Architecture

Hexagonal Architecture with Domain-Driven Design (DDD):

```
src/
├── domain/              # Domain Layer
│   ├── entities/        # Business entities
│   ├── value-objects/   # Value objects
│   └── repositories/    # Ports (interfaces)
├── application/         # Application Layer
│   └── use-cases/       # Use cases
├── infrastructure/      # Infrastructure Layer
│   ├── algorithms/      # Algorithm implementations
│   └── generators/      # Process generators
├── presentation/        # Presentation Layer
│   ├── views/          # Main views
│   ├── components/     # React components
│   ├── hooks/          # Custom hooks
│   └── stores/         # State management
└── shared/             # Shared kernel
    ├── config/         # Configuration
    └── utils/          # Utilities
```

## Algorithms

### First Come, First Serve (FCFS)

- Processes execute in arrival order
- Non-preemptive
- Simple but may cause convoy effect

### Shortest Process (SP) with Preemption

- Shortest processes have priority
- Preemptive: shorter processes can interrupt longer ones
- Optimizes average waiting time

## Technologies

- **Vite 5** - Modern build tool
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Zustand** for state management
- **Service Worker** for offline functionality

## Installation

```bash
git clone <repository-url>
cd process-scheduling-simulator
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```
