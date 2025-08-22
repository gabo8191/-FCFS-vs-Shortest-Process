import { create } from 'zustand';
import { SimulationUseCase } from '../../application/use-cases/SimulationUseCase';
import { SimulationConfig } from '../../domain/value-objects/SimulationConfig';
import { FCFSScheduler } from '../../infrastructure/algorithms/FCFSScheduler';
import { ShortestProcessScheduler } from '../../infrastructure/algorithms/ShortestProcessScheduler';

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
const spScheduler = new ShortestProcessScheduler();
const simulationUseCase = new SimulationUseCase([fcfsScheduler, spScheduler]);

export const useSimulationStore = create<SimulationStore>((set, get) => ({
  // Initial state
  isRunning: false,
  currentTime: 0,
  config: SimulationConfig.createDefault(),
  totalProcessesGenerated: 0,
  maxProcesses: 20,
  _useCase: simulationUseCase,

  // Actions
  startSimulation: () => {
    const { _useCase } = get();
    _useCase.startSimulation();
    set({ isRunning: true });
  },

  pauseSimulation: () => {
    const { _useCase } = get();
    _useCase.pauseSimulation();
    set({ isRunning: false });
  },

  resetSimulation: () => {
    const { _useCase } = get();
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
    _useCase.executeStep(timeStep);
    const state = _useCase.getState();
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
