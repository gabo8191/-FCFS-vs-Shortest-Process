import { Process, ProcessStatus } from './domain/entities/Process';
import { FCFSScheduler } from './infrastructure/algorithms/FCFSScheduler';
import { SJFScheduler } from './infrastructure/algorithms/SJFScheduler';
import { SRTFScheduler } from './infrastructure/algorithms/SRTFScheduler';

function createTestProcesses(): Process[] {
  return [
    new Process({
      id: 1,
      name: 'P1',
      arrivalTime: 0,
      burstTime: 8,
      size: 50,
      status: ProcessStatus.WAITING,
      remainingTime: 8,
    }),
    new Process({
      id: 2,
      name: 'P2',
      arrivalTime: 1,
      burstTime: 4,
      size: 30,
      status: ProcessStatus.WAITING,
      remainingTime: 4,
    }),
    new Process({
      id: 3,
      name: 'P3',
      arrivalTime: 2,
      burstTime: 9,
      size: 40,
      status: ProcessStatus.WAITING,
      remainingTime: 9,
    }),
    new Process({
      id: 4,
      name: 'P4',
      arrivalTime: 3,
      burstTime: 5,
      size: 35,
      status: ProcessStatus.WAITING,
      remainingTime: 5,
    }),
  ];
}

function debugAlgorithm(
  scheduler: any,
  name: string,
  processes: Process[],
): void {
  console.log(`\n=== DEBUGGING ${name} ===`);
  scheduler.reset();

  processes.forEach((p) => scheduler.addProcess(p.clone()));

  let currentTime = 0;
  const maxTime = 30;

  while (currentTime < maxTime) {
    const state = scheduler.getCurrentState();

    console.log(`\nTime ${currentTime}:`);
    console.log(
      `  Running: ${
        state.runningProcess
          ? `${state.runningProcess.name}(${state.runningProcess.remainingTime})`
          : 'IDLE'
      }`,
    );
    console.log(
      `  Ready Queue: [${state.readyQueue
        .filter((p: Process) => p.arrivalTime <= currentTime)
        .map((p: Process) => `${p.name}(${p.remainingTime})`)
        .join(', ')}]`,
    );
    console.log(
      `  Completed: [${state.completedProcesses
        .map((p: Process) => p.name)
        .join(', ')}]`,
    );

    if (state.completedProcesses.length === processes.length) {
      console.log(`\n${name} completed all processes at time ${currentTime}`);
      break;
    }

    scheduler.execute(1000);
    currentTime++;
  }

  const completedProcesses = scheduler
    .getAllProcesses()
    .filter((p: any) => p.isCompleted());
  if (completedProcesses.length > 0) {
    const avgWaiting =
      completedProcesses.reduce(
        (sum: number, p: any) => sum + (p.waitingTime || 0),
        0,
      ) / completedProcesses.length;
    const avgTurnaround =
      completedProcesses.reduce(
        (sum: number, p: any) => sum + (p.turnaroundTime || 0),
        0,
      ) / completedProcesses.length;

    console.log(`\n${name} Final Metrics:`);
    console.log(`  Average Waiting Time: ${avgWaiting.toFixed(2)}`);
    console.log(`  Average Turnaround Time: ${avgTurnaround.toFixed(2)}`);
  }
}

export function runDebugTest(): void {
  console.log('🐛 STARTING DEBUG TEST FOR ALL THREE ALGORITHMS 🐛');

  const testProcesses = createTestProcesses();

  console.log('Test Processes:');
  testProcesses.forEach((p) => {
    console.log(`  ${p.name}: Arrival=${p.arrivalTime}, Burst=${p.burstTime}`);
  });

  const fcfsScheduler = new FCFSScheduler();
  const sjfScheduler = new SJFScheduler();
  const srtfScheduler = new SRTFScheduler();

  debugAlgorithm(
    fcfsScheduler,
    'FCFS (First Come First Served)',
    testProcesses,
  );
  debugAlgorithm(
    sjfScheduler,
    'SJF (Shortest Job First - Non-Preemptive)',
    testProcesses,
  );
  debugAlgorithm(
    srtfScheduler,
    'SRTF (Shortest Remaining Time First - Preemptive)',
    testProcesses,
  );

  console.log('\n🎯 DEBUG TEST COMPLETED FOR ALL THREE ALGORITHMS 🎯');
}

(window as any).runDebugTest = runDebugTest;
