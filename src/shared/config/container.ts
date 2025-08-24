import { SimulationService } from '../../application/services/SimulationService';
import { FCFSScheduler } from '../../infrastructure/algorithms/FCFSScheduler';
import { SJFScheduler } from '../../infrastructure/algorithms/SJFScheduler';
import { SRTFScheduler } from '../../infrastructure/algorithms/SRTFScheduler';
import { SimulationAdapter } from '../../presentation/adapters/SimulationAdapter';

const fcfsScheduler = new FCFSScheduler();
const sjfScheduler = new SJFScheduler();
const srtfScheduler = new SRTFScheduler();

const simulationService = new SimulationService(
  fcfsScheduler,
  sjfScheduler,
  srtfScheduler,
);
const simulationAdapter = new SimulationAdapter(simulationService);

export const container = {
  fcfsScheduler,
  sjfScheduler,
  srtfScheduler,
  simulationService,
  simulationAdapter,
};
