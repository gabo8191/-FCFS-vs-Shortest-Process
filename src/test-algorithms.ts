import { Process, ProcessStatus } from './domain/entities/Process';
import { FCFSScheduler } from './infrastructure/algorithms/FCFSScheduler';
import { SJFScheduler } from './infrastructure/algorithms/SJFScheduler';
import { SRTFScheduler } from './infrastructure/algorithms/SRTFScheduler';

interface TestResult {
  algorithmName: string;
  processes: {
    name: string;
    arrivalTime: number;
    burstTime: number;
    waitingTime: number;
    turnaroundTime: number;
  }[];
  averageWaitingTime: number;
  averageTurnaroundTime: number;
  totalTime: number;
}

function createKnownTestCase(): Process[] {
  return [
    new Process({
      id: 1,
      name: 'P1',
      arrivalTime: 0,
      burstTime: 6,
      size: 50,
      status: ProcessStatus.WAITING,
      remainingTime: 6,
    }),
    new Process({
      id: 2,
      name: 'P2',
      arrivalTime: 2,
      burstTime: 2,
      size: 30,
      status: ProcessStatus.WAITING,
      remainingTime: 2,
    }),
    new Process({
      id: 3,
      name: 'P3',
      arrivalTime: 3,
      burstTime: 1,
      size: 20,
      status: ProcessStatus.WAITING,
      remainingTime: 1,
    }),
    new Process({
      id: 4,
      name: 'P4',
      arrivalTime: 4,
      burstTime: 4,
      size: 40,
      status: ProcessStatus.WAITING,
      remainingTime: 4,
    }),
  ];
}

function runAlgorithmTest(
  scheduler: any,
  name: string,
  processes: Process[],
): TestResult {
  scheduler.reset();

  processes.forEach((p) => scheduler.addProcess(p.clone()));

  let currentTime = 0;
  const timeStep = 1;
  let executionLog: string[] = [];

  while (true) {
    const state = scheduler.getCurrentState();

    const runningInfo = state.runningProcess
      ? `${state.runningProcess.name}(${state.runningProcess.remainingTime})`
      : 'IDLE';
    const queueInfo = state.readyQueue
      .filter((p: Process) => p.arrivalTime <= currentTime)
      .map((p: Process) => `${p.name}(${p.remainingTime})`)
      .join(',');

    executionLog.push(
      `T${currentTime}: Running=${runningInfo}, Queue=[${queueInfo}]`,
    );

    if (state.completedProcesses.length === processes.length) {
      break;
    }

    scheduler.execute(timeStep);
    currentTime += timeStep;

    if (currentTime > 50) {
      console.warn(`${name}: Simulation timeout at time ${currentTime}`);
      break;
    }
  }

  const allProcesses = scheduler.getAllProcesses();
  const completedProcesses = allProcesses.filter((p: Process) =>
    p.isCompleted(),
  );

  const processResults = completedProcesses.map((p: Process) => ({
    name: p.name,
    arrivalTime: p.arrivalTime,
    burstTime: p.burstTime,
    waitingTime: p.waitingTime || 0,
    turnaroundTime: p.turnaroundTime || 0,
  }));

  const avgWaitingTime =
    processResults.length > 0
      ? processResults.reduce(
          (sum: number, p: (typeof processResults)[0]) => sum + p.waitingTime,
          0,
        ) / processResults.length
      : 0;

  const avgTurnaroundTime =
    processResults.length > 0
      ? processResults.reduce(
          (sum: number, p: (typeof processResults)[0]) =>
            sum + p.turnaroundTime,
          0,
        ) / processResults.length
      : 0;

  console.log(`\n=== ${name} DETAILED EXECUTION ===`);
  executionLog.forEach((log) => console.log(log));

  return {
    algorithmName: name,
    processes: processResults,
    averageWaitingTime: avgWaitingTime,
    averageTurnaroundTime: avgTurnaroundTime,
    totalTime: currentTime,
  };
}

function compareAlgorithms(results: TestResult[]): void {
  console.log('\n=== ALGORITHM COMPARISON ===');

  results.forEach((result) => {
    console.log(`\n${result.algorithmName}:`);
    console.log('Process Details:');
    result.processes.forEach((p) => {
      console.log(
        `  ${p.name}: Arrival=${p.arrivalTime}, Burst=${p.burstTime}, ` +
          `Waiting=${p.waitingTime}, Turnaround=${p.turnaroundTime}`,
      );
    });
    console.log(
      `Average Waiting Time: ${result.averageWaitingTime.toFixed(2)}`,
    );
    console.log(
      `Average Turnaround Time: ${result.averageTurnaroundTime.toFixed(2)}`,
    );
    console.log(`Total Execution Time: ${result.totalTime}`);
  });

  if (results.length >= 2) {
    const fcfs = results[0];
    const sp = results[1];

    console.log('\n=== PERFORMANCE COMPARISON ===');
    console.log(
      `Waiting Time - FCFS: ${fcfs.averageWaitingTime.toFixed(
        2,
      )}, SP: ${sp.averageWaitingTime.toFixed(2)}`,
    );
    console.log(
      `Better Waiting Time: ${
        fcfs.averageWaitingTime < sp.averageWaitingTime ? 'FCFS' : 'SP'
      } ` +
        `(${Math.abs(fcfs.averageWaitingTime - sp.averageWaitingTime).toFixed(
          2,
        )} difference)`,
    );

    console.log(
      `Turnaround Time - FCFS: ${fcfs.averageTurnaroundTime.toFixed(
        2,
      )}, SP: ${sp.averageTurnaroundTime.toFixed(2)}`,
    );
    console.log(
      `Better Turnaround Time: ${
        fcfs.averageTurnaroundTime < sp.averageTurnaroundTime ? 'FCFS' : 'SP'
      } ` +
        `(${Math.abs(
          fcfs.averageTurnaroundTime - sp.averageTurnaroundTime,
        ).toFixed(2)} difference)`,
    );
  }
}

export function runComprehensiveTest(): void {
  console.log('=== COMPREHENSIVE ALGORITHM TEST (3 ALGORITHMS) ===');

  const testProcesses = createKnownTestCase();

  console.log('Test Processes:');
  testProcesses.forEach((p) => {
    console.log(`  ${p.name}: Arrival=${p.arrivalTime}, Burst=${p.burstTime}`);
  });

  const fcfsScheduler = new FCFSScheduler();
  const sjfScheduler = new SJFScheduler();
  const srtfScheduler = new SRTFScheduler();

  const results: TestResult[] = [
    runAlgorithmTest(
      fcfsScheduler,
      'FCFS (First Come First Served)',
      testProcesses,
    ),
    runAlgorithmTest(
      sjfScheduler,
      'SJF (Shortest Job First - Non-Preemptive)',
      testProcesses,
    ),
    runAlgorithmTest(
      srtfScheduler,
      'SRTF (Shortest Remaining Time First - Preemptive)',
      testProcesses,
    ),
  ];

  compareAlgorithms(results);

  console.log('\n=== ALGORITHM ANALYSIS ===');
  console.log('Expected characteristics:');
  console.log('• FCFS: Simple, fair, but can suffer from convoy effect');
  console.log('• SJF: Better average waiting time, no preemption');
  console.log('• SRTF: Best average waiting time, but may cause starvation');
}

(window as any).runComprehensiveTest = runComprehensiveTest;
