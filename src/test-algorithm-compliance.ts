import { Process, ProcessStatus } from './domain/entities/Process';
import { SJFScheduler } from './infrastructure/algorithms/SJFScheduler';
import { SRTFScheduler } from './infrastructure/algorithms/SRTFScheduler';


function testSJFNonPreemptive(): void {
  console.log('🔍 Testing SJF Non-Preemptive Behavior...\n');

  const scheduler = new SJFScheduler();

  const p1 = new Process({
    id: 1,
    name: 'P1',
    arrivalTime: 0,
    burstTime: 8000,
    size: 50,
    status: ProcessStatus.WAITING,
    remainingTime: 8000,
  });

  const p2 = new Process({
    id: 2,
    name: 'P2',
    arrivalTime: 1000,
    burstTime: 2000,
    size: 30,
    status: ProcessStatus.WAITING,
    remainingTime: 2000,
  });

  const p3 = new Process({
    id: 3,
    name: 'P3',
    arrivalTime: 2000,
    burstTime: 1000,
    size: 20,
    status: ProcessStatus.WAITING,
    remainingTime: 1000,
  });

  scheduler.addProcess(p1);
  scheduler.addProcess(p2);
  scheduler.addProcess(p3);

  console.log('Procesos agregados:');
  console.log(`  P1: Arrival=0ms, Burst=8000ms`);
  console.log(`  P2: Arrival=1000ms, Burst=2000ms`);
  console.log(`  P3: Arrival=2000ms, Burst=1000ms\n`);

  console.log('Simulación SJF:');

  scheduler.execute(1000, 0);
  let state = scheduler.getCurrentState();
  console.log(
    `t=0ms: Running=${state.runningProcess?.name}, Ready=${state.readyQueue.length}`,
  );

  scheduler.execute(1000, 1000);
  state = scheduler.getCurrentState();
  console.log(
    `t=1000ms: Running=${state.runningProcess?.name}, Ready=${state.readyQueue.length}`,
  );
  console.log(`  ✓ P1 should continue running despite P2 arrival`);

  scheduler.execute(1000, 2000);
  state = scheduler.getCurrentState();
  console.log(
    `t=2000ms: Running=${state.runningProcess?.name}, Ready=${state.readyQueue.length}`,
  );
  console.log(`  ✓ P1 should continue running despite P3 arrival`);

  for (let t = 3000; t <= 8000; t += 1000) {
    scheduler.execute(1000, t);
    state = scheduler.getCurrentState();
    if (state.runningProcess?.name !== 'P1' && t < 8000) {
      console.log(`  ❌ ERROR: P1 was preempted at t=${t}ms!`);
      return;
    }
  }

  scheduler.execute(1000, 8000);
  state = scheduler.getCurrentState();
  console.log(
    `t=8000ms: Running=${state.runningProcess?.name}, Ready=${state.readyQueue.length}`,
  );

  if (state.runningProcess?.name === 'P3') {
    console.log(`  ✅ CORRECT: P3 selected (shortest job among available)`);
  } else {
    console.log(
      `  ❌ ERROR: Should select P3, but selected ${state.runningProcess?.name}`,
    );
  }

  console.log('\n✅ SJF Non-Preemptive Test Completed\n');
}

function testSRTFPreemptive(): void {
  console.log('🔄 Testing SRTF Preemptive Behavior...\n');

  const scheduler = new SRTFScheduler();

  const p1 = new Process({
    id: 1,
    name: 'P1',
    arrivalTime: 0,
    burstTime: 10000,
    size: 50,
    status: ProcessStatus.WAITING,
    remainingTime: 10000,
  });

  const p2 = new Process({
    id: 2,
    name: 'P2',
    arrivalTime: 2000,
    burstTime: 3000,
    size: 30,
    status: ProcessStatus.WAITING,
    remainingTime: 3000,
  });

  const p3 = new Process({
    id: 3,
    name: 'P3',
    arrivalTime: 3000,
    burstTime: 1000,
    size: 20,
    status: ProcessStatus.WAITING,
    remainingTime: 1000,
  });

  scheduler.addProcess(p1);
  scheduler.addProcess(p2);
  scheduler.addProcess(p3);

  console.log('Procesos agregados:');
  console.log(`  P1: Arrival=0ms, Burst=10000ms`);
  console.log(`  P2: Arrival=2000ms, Burst=3000ms`);
  console.log(`  P3: Arrival=3000ms, Burst=1000ms\n`);

  console.log('Simulación SRTF:');

  scheduler.execute(1000, 0);
  let state = scheduler.getCurrentState();
  console.log(
    `t=0ms: Running=${state.runningProcess?.name}, Remaining=${state.runningProcess?.remainingTime}ms`,
  );

  scheduler.execute(1000, 1000);
  state = scheduler.getCurrentState();
  console.log(
    `t=1000ms: Running=${state.runningProcess?.name}, Remaining=${state.runningProcess?.remainingTime}ms`,
  );

  scheduler.execute(1000, 2000);
  state = scheduler.getCurrentState();
  console.log(
    `t=2000ms: Running=${state.runningProcess?.name}, Remaining=${state.runningProcess?.remainingTime}ms`,
  );

  if (state.runningProcess?.name === 'P2') {
    console.log(`  ✅ CORRECT: P2 preempted P1 (shorter remaining time)`);
  } else {
    console.log(
      `  ❌ ERROR: P2 should have preempted P1, but ${state.runningProcess?.name} is running`,
    );
  }

  scheduler.execute(1000, 3000);
  state = scheduler.getCurrentState();
  console.log(
    `t=3000ms: Running=${state.runningProcess?.name}, Remaining=${state.runningProcess?.remainingTime}ms`,
  );

  if (state.runningProcess?.name === 'P3') {
    console.log(`  ✅ CORRECT: P3 preempted P2 (shortest remaining time)`);
  } else {
    console.log(
      `  ❌ ERROR: P3 should have preempted P2, but ${state.runningProcess?.name} is running`,
    );
  }

  scheduler.execute(1000, 4000);
  state = scheduler.getCurrentState();
  console.log(
    `t=4000ms: Running=${state.runningProcess?.name}, Remaining=${state.runningProcess?.remainingTime}ms`,
  );

  if (state.runningProcess?.name === 'P2') {
    console.log(
      `  ✅ CORRECT: P2 resumed (shortest remaining time after P3 completion)`,
    );
  } else {
    console.log(
      `  ❌ ERROR: P2 should resume, but ${state.runningProcess?.name} is running`,
    );
  }

  console.log('\n✅ SRTF Preemptive Test Completed\n');
}

function testAlgorithmCompliance(): void {
  console.log('=== ALGORITHM COMPLIANCE TEST ===\n');
  console.log(
    'Verificando que SJF y SRTF cumplan las reglas exactas de planificación\n',
  );

  testSJFNonPreemptive();
  testSRTFPreemptive();

  console.log('=== TEST COMPLETED ===');
  console.log(
    'Revisa los logs para verificar que los algoritmos cumplan las reglas:',
  );
  console.log('✅ SJF: No preemptivo, selecciona por burst time');
  console.log(
    '✅ SRTF: Preemptivo, selecciona por remaining time, preempta cuando llega proceso más corto',
  );
}

export { testAlgorithmCompliance };

(window as any).testAlgorithmCompliance = testAlgorithmCompliance;
