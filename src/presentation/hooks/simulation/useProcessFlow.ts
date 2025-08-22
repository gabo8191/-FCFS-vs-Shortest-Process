import { useMemo } from 'react';
import { useSimulationStore } from '../../stores/simulationStore';

export const useProcessFlow = (algorithmName: string) => {
  const { getAllProcesses, getScheduler } = useSimulationStore();

  const processes = useMemo(() => {
    return getAllProcesses(algorithmName);
  }, [getAllProcesses, algorithmName]);

  const scheduler = useMemo(() => {
    return getScheduler(algorithmName);
  }, [getScheduler, algorithmName]);

  const currentState = useMemo(() => {
    return scheduler?.getCurrentState();
  }, [scheduler]);

  return {
    processes,
    currentState,
    scheduler,
  };
};
