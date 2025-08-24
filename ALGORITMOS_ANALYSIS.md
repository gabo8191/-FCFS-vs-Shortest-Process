# Análisis de Problemas en los Algoritmos de Planificación

## Problemas Identificados y Corregidos

### 1. **PROBLEMA CRÍTICO: Mismos procesos en ambos algoritmos**

**Problema**: En `SimulationUseCase.ts`, ambos algoritmos estaban recibiendo exactamente los mismos procesos clonados, lo que eliminaba cualquier diferencia real entre los algoritmos.

**Código problemático**:

```typescript
// Antes (INCORRECTO)
const newProcess = ProcessGenerator.generateRandomProcess(config, time);
this.state.schedulers.forEach((scheduler) => {
  scheduler.addProcess(newProcess.clone()); // Mismo proceso para todos
});
```

**Solución aplicada**:

```typescript
// Después (CORRECTO)
const baseProcess = ProcessGenerator.generateRandomProcess(config, time);
this.state.schedulers.forEach((scheduler) => {
  const processForScheduler = baseProcess.clone(); // Copias independientes
  scheduler.addProcess(processForScheduler);
});
```

### 2. **PROBLEMA: Manejo incorrecto de tiempos de llegada**

**Problema**: Los algoritmos no verificaban correctamente si los procesos habían llegado antes de ejecutarlos.

**En FCFS**:

- No verificaba `arrivalTime` antes de ejecutar procesos
- Podía ejecutar procesos que aún no habían llegado

**En Shortest Process**:

- Misma falla con tiempos de llegada
- El algoritmo de preemption no consideraba procesos disponibles

**Solución aplicada**:

- Agregado filtrado por `arrivalTime <= currentTime` en ambos algoritmos
- Solo procesos que han llegado pueden ser considerados para ejecución

### 3. **PROBLEMA: Configuración poco diferenciadora**

**Problema**: Los rangos de `burstTime` eran muy estrechos (3-8), causando poca variabilidad.

**Antes**:

```typescript
minBurstTime: 3,
maxBurstTime: 8,  // Ratio 2.67:1 - muy estrecho
```

**Después**:

```typescript
minBurstTime: 1,
maxBurstTime: 15, // Ratio 15:1 - mayor variabilidad
```

### 4. **PROBLEMA: Lógica de algoritmo Shortest Process mejorada**

**Problemas corregidos**:

- Preemption ahora solo considera procesos disponibles
- Selección correcta del proceso más corto entre los llegados
- Manejo proper de la cola de listos

## Diferencias Esperadas Entre Algoritmos

### FCFS (First Come, First Served)

- **Característica**: No preemptivo, ejecuta procesos en orden de llegada
- **Ventaja**: Simple, justo en términos de orden de llegada
- **Desventaja**: Procesos largos pueden bloquear procesos cortos (efecto convoy)

### Shortest Process Next (SPN/SJF Preemptivo)

- **Característica**: Preemptivo, siempre ejecuta el proceso con menor tiempo restante
- **Ventaja**: Minimiza tiempo de espera promedio, especialmente con alta variabilidad
- **Desventaja**: Puede causar inanición de procesos largos

## Métricas de Rendimiento

### Tiempo de Espera (Waiting Time)

- **Fórmula**: `Turnaround Time - Burst Time`
- **Expectativa**: SPN debería tener menor tiempo de espera promedio con alta variabilidad de burst times

### Tiempo de Retorno (Turnaround Time)

- **Fórmula**: `End Time - Arrival Time`
- **Expectativa**: SPN generalmente mejor, especialmente con mezcla de procesos cortos y largos

## Cómo Verificar las Correcciones

### En la Consola del Navegador:

```javascript
// Ejecutar test básico
runDebugTest();

// Ejecutar test completo con casos conocidos
runComprehensiveTest();
```

### Casos de Prueba Incluidos:

**Test Case**: P1(0,6), P2(2,2), P3(3,1), P4(4,4)

- **FCFS**: Debería ejecutar P1→P2→P3→P4 (orden de llegada)
- **SPN**: Debería hacer preemption cuando llegan procesos más cortos

### Resultados Esperados:

- **SPN debería mostrar mejor tiempo de espera promedio**
- **Los algoritmos deberían mostrar diferentes secuencias de ejecución**
- **Las métricas deberían ser notablemente diferentes ahora**

## Configuraciones de Prueba

### Para Favorecer FCFS:

```typescript
SimulationConfig.createFCFSFriendly(); // Procesos similares (4-6 burst time)
```

### Para Favorecer SPN:

```typescript
SimulationConfig.createSJFFriendly(); // Alta variabilidad (1-12 burst time)
```

### Configuración Balanceada:

```typescript
SimulationConfig.createBalanced(); // Variabilidad moderada (3-7 burst time)
```

## Validación de Correcciones

1. **Independencia de Procesos**: Cada algoritmo ahora trabaja con sus propias copias
2. **Manejo de Llegadas**: Solo procesos llegados pueden ejecutarse
3. **Variabilidad Aumentada**: Mayor diferenciación entre algoritmos
4. **Lógica Correcta**: Algoritmos implementan correctamente sus especificaciones

Con estas correcciones, los algoritmos deberían mostrar diferencias claras y métricas realistas.
