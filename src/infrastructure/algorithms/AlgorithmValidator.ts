import { Process, ProcessStatus } from '../../domain/entities/Process';
import { FCFSScheduler } from './FCFSScheduler';
import { ShortestProcessScheduler } from './ShortestProcessScheduler';

export class AlgorithmValidator {
  private fcfsScheduler: FCFSScheduler;
  private spScheduler: ShortestProcessScheduler;

  constructor() {
    this.fcfsScheduler = new FCFSScheduler();
    this.spScheduler = new ShortestProcessScheduler();
  }

  /**
   * Valida el algoritmo FCFS (First Come, First Serve)
   */
  validateFCFS(): void {
    console.log('🔍 Validando algoritmo FCFS...\n');

    try {
      // Test 1: Orden de llegada
      console.log('Test 1: Verificar orden por tiempo de llegada');
      this.testFCFSArrivalOrder();

      // Test 2: Completación de procesos
      console.log('\nTest 2: Verificar completación de procesos');
      this.testFCFSProcessCompletion();

      // Test 3: Múltiples procesos
      console.log('\nTest 3: Verificar múltiples procesos');
      this.testFCFSMultipleProcesses();

      console.log('\n✅ Validación FCFS completada\n');
    } catch (error) {
      console.error('❌ Error en validación FCFS:', error);
    }
  }

  /**
   * Valida el algoritmo Shortest Process
   */
  validateShortestProcess(): void {
    console.log('🔍 Validando algoritmo Shortest Process...\n');

    try {
      // Test 1: Proceso más corto primero
      console.log('Test 1: Verificar que el proceso más corto va primero');
      this.testSPShortestFirst();

      // Test 2: Expropiación
      console.log('\nTest 2: Verificar expropiación');
      this.testSPPreemption();

      // Test 3: Orden de completación
      console.log('\nTest 3: Verificar orden de completación');
      this.testSPCompletionOrder();

      console.log('\n✅ Validación Shortest Process completada\n');
    } catch (error) {
      console.error('❌ Error en validación Shortest Process:', error);
    }
  }

  private testFCFSArrivalOrder(): void {
    this.fcfsScheduler.reset();

    const process1 = new Process({
      id: 1,
      name: 'P1',
      arrivalTime: 0,
      burstTime: 5,
      size: 50,
      status: ProcessStatus.WAITING,
      remainingTime: 5,
    });

    const process2 = new Process({
      id: 2,
      name: 'P2',
      arrivalTime: 2,
      burstTime: 3,
      size: 30,
      status: ProcessStatus.WAITING,
      remainingTime: 3,
    });

    const process3 = new Process({
      id: 3,
      name: 'P3',
      arrivalTime: 1,
      burstTime: 4,
      size: 40,
      status: ProcessStatus.WAITING,
      remainingTime: 4,
    });

    // Agregar en orden diferente al de llegada
    this.fcfsScheduler.addProcess(process2); // Llega a t=2
    this.fcfsScheduler.addProcess(process1); // Llega a t=0
    this.fcfsScheduler.addProcess(process3); // Llega a t=1

    const state = this.fcfsScheduler.getCurrentState();
    const queue = state.readyQueue;

    console.log(`  Cola ordenada: ${queue.map((p) => p.name).join(' → ')}`);

    const isCorrectOrder =
      queue[0].id === 1 && queue[1].id === 3 && queue[2].id === 2;
    console.log(`  ✅ Orden correcto: ${isCorrectOrder ? 'SÍ' : 'NO'}`);
  }

  private testFCFSProcessCompletion(): void {
    this.fcfsScheduler.reset();

    const process = new Process({
      id: 1,
      name: 'P1',
      arrivalTime: 0,
      burstTime: 3,
      size: 50,
      status: ProcessStatus.WAITING,
      remainingTime: 3,
    });

    this.fcfsScheduler.addProcess(process);

    // Ejecutar 3 pasos
    this.fcfsScheduler.execute(1000); // t=1, remaining=2
    this.fcfsScheduler.execute(1000); // t=2, remaining=1
    this.fcfsScheduler.execute(1000); // t=3, remaining=0, completado

    const state = this.fcfsScheduler.getCurrentState();

    console.log(`  Procesos completados: ${state.completedProcesses.length}`);
    console.log(
      `  Proceso ejecutándose: ${
        state.runningProcess ? state.runningProcess.name : 'Ninguno'
      }`,
    );
    console.log(
      `  ✅ Completación correcta: ${
        state.completedProcesses.length === 1 && !state.runningProcess
          ? 'SÍ'
          : 'NO'
      }`,
    );
  }

  private testFCFSMultipleProcesses(): void {
    this.fcfsScheduler.reset();

    const process1 = new Process({
      id: 1,
      name: 'P1',
      arrivalTime: 0,
      burstTime: 2,
      size: 50,
      status: ProcessStatus.WAITING,
      remainingTime: 2,
    });

    const process2 = new Process({
      id: 2,
      name: 'P2',
      arrivalTime: 0,
      burstTime: 3,
      size: 30,
      status: ProcessStatus.WAITING,
      remainingTime: 3,
    });

    this.fcfsScheduler.addProcess(process1);
    this.fcfsScheduler.addProcess(process2);

    // Ejecutar hasta completar P1
    this.fcfsScheduler.execute(1000); // t=1, P1 remaining=1
    this.fcfsScheduler.execute(1000); // t=2, P1 completado, P2 empieza

    let state = this.fcfsScheduler.getCurrentState();
    console.log(
      `  Después de 2 pasos: ${
        state.completedProcesses.length
      } completados, ejecutándose: ${state.runningProcess?.name || 'Ninguno'}`,
    );

    // Ejecutar hasta completar P2
    this.fcfsScheduler.execute(1000); // t=3, P2 remaining=2
    this.fcfsScheduler.execute(1000); // t=4, P2 remaining=1
    this.fcfsScheduler.execute(1000); // t=5, P2 completado

    state = this.fcfsScheduler.getCurrentState();
    console.log(
      `  Después de 5 pasos: ${
        state.completedProcesses.length
      } completados, ejecutándose: ${state.runningProcess?.name || 'Ninguno'}`,
    );
    console.log(
      `  ✅ Múltiples procesos correctos: ${
        state.completedProcesses.length === 2 && !state.runningProcess
          ? 'SÍ'
          : 'NO'
      }`,
    );
  }

  private testSPShortestFirst(): void {
    this.spScheduler.reset();

    const process1 = new Process({
      id: 1,
      name: 'P1',
      arrivalTime: 0,
      burstTime: 5,
      size: 50,
      status: ProcessStatus.WAITING,
      remainingTime: 5,
    });

    const process2 = new Process({
      id: 2,
      name: 'P2',
      arrivalTime: 0,
      burstTime: 2,
      size: 30,
      status: ProcessStatus.WAITING,
      remainingTime: 2,
    });

    const process3 = new Process({
      id: 3,
      name: 'P3',
      arrivalTime: 0,
      burstTime: 3,
      size: 40,
      status: ProcessStatus.WAITING,
      remainingTime: 3,
    });

    // Agregar en orden diferente
    this.spScheduler.addProcess(process1); // 5 unidades
    this.spScheduler.addProcess(process2); // 2 unidades (más corto)
    this.spScheduler.addProcess(process3); // 3 unidades

    const state = this.spScheduler.getCurrentState();
    const queue = state.readyQueue;

    console.log(
      `  Cola ordenada: ${queue
        .map((p) => `${p.name}(${p.remainingTime})`)
        .join(' → ')}`,
    );

    const isCorrectOrder =
      queue[0].id === 2 && queue[1].id === 3 && queue[2].id === 1;
    console.log(
      `  ✅ Orden por tiempo más corto: ${isCorrectOrder ? 'SÍ' : 'NO'}`,
    );
  }

  private testSPPreemption(): void {
    this.spScheduler.reset();

    const process1 = new Process({
      id: 1,
      name: 'P1',
      arrivalTime: 0,
      burstTime: 5,
      size: 50,
      status: ProcessStatus.WAITING,
      remainingTime: 5,
    });

    const process2 = new Process({
      id: 2,
      name: 'P2',
      arrivalTime: 2,
      burstTime: 2,
      size: 30,
      status: ProcessStatus.WAITING,
      remainingTime: 2,
    });

    this.spScheduler.addProcess(process1);

    // Ejecutar P1 por 2 unidades
    this.spScheduler.execute(2000); // t=2, P1 remaining=3

    // Agregar P2 (más corto) durante la ejecución
    this.spScheduler.addProcess(process2);

    // Ejecutar un paso más - P2 debe expropiar
    this.spScheduler.execute(1000); // t=3

    const state = this.spScheduler.getCurrentState();

    console.log(
      `  Proceso ejecutándose: ${state.runningProcess?.name || 'Ninguno'}`,
    );
    console.log(
      `  P1 en cola: ${state.readyQueue.some((p) => p.id === 1) ? 'SÍ' : 'NO'}`,
    );
    console.log(
      `  ✅ Expropiación correcta: ${
        state.runningProcess?.id === 2 &&
        state.readyQueue.some((p) => p.id === 1)
          ? 'SÍ'
          : 'NO'
      }`,
    );
  }

  private testSPCompletionOrder(): void {
    this.spScheduler.reset();

    const process1 = new Process({
      id: 1,
      name: 'P1',
      arrivalTime: 0,
      burstTime: 3,
      size: 50,
      status: ProcessStatus.WAITING,
      remainingTime: 3,
    });

    const process2 = new Process({
      id: 2,
      name: 'P2',
      arrivalTime: 0,
      burstTime: 1,
      size: 30,
      status: ProcessStatus.WAITING,
      remainingTime: 1,
    });

    this.spScheduler.addProcess(process1);
    this.spScheduler.addProcess(process2);

    // P2 debe completarse primero (más corto)
    this.spScheduler.execute(1000); // t=1, P2 completado

    let state = this.spScheduler.getCurrentState();
    console.log(
      `  Después de 1 paso: ${state.completedProcesses
        .map((p) => p.name)
        .join(', ')} completados`,
    );

    // P1 debe completarse después
    this.spScheduler.execute(1000); // t=2, P1 remaining=2
    this.spScheduler.execute(1000); // t=3, P1 remaining=1
    this.spScheduler.execute(1000); // t=4, P1 completado

    state = this.spScheduler.getCurrentState();
    console.log(
      `  Después de 4 pasos: ${state.completedProcesses
        .map((p) => p.name)
        .join(', ')} completados`,
    );

    const correctOrder =
      state.completedProcesses[0].id === 2 &&
      state.completedProcesses[1].id === 1;
    console.log(
      `  ✅ Orden de completación correcto: ${correctOrder ? 'SÍ' : 'NO'}`,
    );
  }

  /**
   * Ejecuta todas las validaciones
   */
  runAllValidations(): void {
    console.log('🚀 Iniciando validación de algoritmos de planificación...\n');

    this.validateFCFS();
    this.validateShortestProcess();

    console.log('🎉 Validación completa finalizada');
  }
}
