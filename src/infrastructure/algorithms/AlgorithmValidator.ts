import { Process, ProcessStatus } from '../../domain/entities/Process';
import { FCFSScheduler } from './FCFSScheduler';
import { SRTFScheduler } from './SRTFScheduler';

export class AlgorithmValidator {
  private fcfsScheduler: FCFSScheduler;
  private srtfScheduler: SRTFScheduler;

  constructor() {
    this.fcfsScheduler = new FCFSScheduler();
    this.srtfScheduler = new SRTFScheduler();
  }

  validateFCFS(): void {
    console.log('🔍 Validando algoritmo FCFS...\n');

    try {
      console.log('Test 1: Verificar orden por tiempo de llegada');
      this.testFCFSArrivalOrder();

      console.log('\nTest 2: Verificar completación de procesos');
      this.testFCFSProcessCompletion();

      console.log('\nTest 3: Verificar múltiples procesos');
      this.testFCFSMultipleProcesses();

      console.log('\n✅ Validación FCFS completada\n');
    } catch (error) {
      console.error('❌ Error en validación FCFS:', error);
    }
  }

  validateSRTF(): void {
    console.log('🔍 Validando algoritmo SRTF...\n');

    try {
      console.log('Test 1: Verificar que el proceso más corto va primero');
      this.testSRTFShortestFirst();

      console.log('\nTest 2: Verificar expropiación');
      this.testSRTFPreemption();

      console.log('\nTest 3: Verificar orden de completación');
      this.testSRTFCompletionOrder();

      console.log('\n✅ Validación SRTF completada\n');
    } catch (error) {
      console.error('❌ Error en validación SRTF:', error);
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

    this.fcfsScheduler.addProcess(process2);
    this.fcfsScheduler.addProcess(process1);
    this.fcfsScheduler.addProcess(process3);

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

    this.fcfsScheduler.execute(1000);
    this.fcfsScheduler.execute(1000);

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

    this.fcfsScheduler.execute(1000);
    this.fcfsScheduler.execute(1000);

    let state = this.fcfsScheduler.getCurrentState();
    console.log(
      `  Después de 2 pasos: ${
        state.completedProcesses.length
      } completados, ejecutándose: ${state.runningProcess?.name || 'Ninguno'}`,
    );

    this.fcfsScheduler.execute(1000);
    this.fcfsScheduler.execute(1000);

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

  private testSRTFShortestFirst(): void {
    this.srtfScheduler.reset();

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

    this.srtfScheduler.addProcess(process1);
    this.srtfScheduler.addProcess(process2);
    this.srtfScheduler.addProcess(process3);

    const state = this.srtfScheduler.getCurrentState();
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

  private testSRTFPreemption(): void {
    this.srtfScheduler.reset();

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

    this.srtfScheduler.addProcess(process1);

    this.srtfScheduler.execute(2000);

    this.srtfScheduler.addProcess(process2);

    this.srtfScheduler.execute(1000);

    const state = this.srtfScheduler.getCurrentState();

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

  private testSRTFCompletionOrder(): void {
    this.srtfScheduler.reset();

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

    this.srtfScheduler.addProcess(process1);
    this.srtfScheduler.addProcess(process2);

    this.srtfScheduler.execute(1000);

    let state = this.srtfScheduler.getCurrentState();
    console.log(
      `  Después de 1 paso: ${state.completedProcesses
        .map((p) => p.name)
        .join(', ')} completados`,
    );

    this.srtfScheduler.execute(1000);
    this.srtfScheduler.execute(1000);

    state = this.srtfScheduler.getCurrentState();
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


  runAllValidations(): void {
    console.log('🚀 Iniciando validación de algoritmos de planificación...\n');

    this.validateFCFS();
    this.validateSRTF();

    console.log('🎉 Validación completa finalizada');
  }
}
