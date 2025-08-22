import { SimulationService } from '../../application/services/SimulationService';
import { FCFSScheduler } from '../../infrastructure/algorithms/FCFSScheduler';
import { ShortestProcessScheduler } from '../../infrastructure/algorithms/ShortestProcessScheduler';
import { SimulationAdapter } from '../../presentation/adapters/SimulationAdapter';

const fcfsScheduler = new FCFSScheduler();
const spScheduler = new ShortestProcessScheduler();

const simulationService = new SimulationService(fcfsScheduler, spScheduler);
const simulationAdapter = new SimulationAdapter(simulationService);

export const container = {
  fcfsScheduler,
  spScheduler,
  simulationService,
  simulationAdapter,
};
