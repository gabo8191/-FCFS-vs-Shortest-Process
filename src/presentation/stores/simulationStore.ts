import { create } from 'zustand';
import { SimulationUseCase } from '../../application/use-cases/SimulationUseCase';
import { SimulationConfig } from '../../domain/value-objects/SimulationConfig';
import { FCFSScheduler } from '../../infrastructure/algorithms/FCFSScheduler';
import { SJFScheduler } from '../../infrastructure/algorithms/SJFScheduler';
import { SRTFScheduler } from '../../infrastructure/algorithms/SRTFScheduler';

interface SimulationStore {
  // State
  isRunning: boolean;
  currentTime: number;
  config: SimulationConfig;
  totalProcessesGenerated: number;
  maxProcesses: number;

  // Actions
  startSimulation: () => void;
  pauseSimulation: () => void;
  resetSimulation: () => void;
  updateConfig: (config: SimulationConfig) => void;
  executeStep: (timeStep: number) => void;

  // Getters
  getScheduler: (algorithmName: string) => any;
  getMetrics: (algorithmName: string) => any;
  getAllProcesses: (algorithmName: string) => any[];

  // Internal
  _useCase: SimulationUseCase;
}

// Initialize the use case
const fcfsScheduler = new FCFSScheduler();
const sjfScheduler = new SJFScheduler();
const srtfScheduler = new SRTFScheduler();
const simulationUseCase = new SimulationUseCase([
  fcfsScheduler,
  sjfScheduler,
  srtfScheduler,
]);

export const useSimulationStore = create<SimulationStore>((set, get) => ({
  // Initial state
  isRunning: false,
  currentTime: 0,
  config: SimulationConfig.createDefault(),
  totalProcessesGenerated: 0,
  maxProcesses: 15, // Cantidad optimizada para mejor observación
  _useCase: simulationUseCase,

  // Actions
  startSimulation: () => {
    const { _useCase } = get();
    console.log('🚀 Starting simulation from store...');
    _useCase.startSimulation();
    console.log('✅ Simulation started, setting isRunning to true');
    set({ isRunning: true });
  },

  pauseSimulation: () => {
    const { _useCase } = get();
    console.log('⏸️ Pausing simulation from store...');
    _useCase.pauseSimulation();
    set({ isRunning: false });
  },

  resetSimulation: () => {
    const { _useCase } = get();
    console.log('🔄 Resetting simulation from store...');
    _useCase.resetSimulation();
    set({
      isRunning: false,
      currentTime: 0,
      totalProcessesGenerated: 0,
    });
  },

  updateConfig: (config: SimulationConfig) => {
    const { _useCase } = get();
    _useCase.updateConfig(config);
    set({
      config,
      maxProcesses: config.maxProcesses,
    });
  },

  executeStep: (timeStep: number) => {
    const { _useCase } = get();
    console.log(`⏱️ Executing step with timeStep: ${timeStep}ms`);
    _useCase.executeStep(timeStep);
    const state = _useCase.getState();
    console.log(`📊 State after step:`, {
      currentTime: state.currentTime,
      totalProcessesGenerated: state.totalProcessesGenerated,
      isRunning: state.isRunning,
    });
    set({
      currentTime: state.currentTime,
      totalProcessesGenerated: state.totalProcessesGenerated,
    });
  },

  // Getters
  getScheduler: (algorithmName: string) => {
    const { _useCase } = get();
    return _useCase.getScheduler(algorithmName);
  },

  getMetrics: (algorithmName: string) => {
    const { _useCase } = get();
    return _useCase.getMetrics(algorithmName);
  },

  getAllProcesses: (algorithmName: string) => {
    const { _useCase } = get();
    return _useCase.getAllProcesses(algorithmName);
  },
}));
