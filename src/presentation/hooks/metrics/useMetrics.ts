import { useMemo } from 'react';
import { useSimulationStore } from '../../stores/simulationStore';

export const useMetrics = (algorithmName: string) => {
  const { getMetrics } = useSimulationStore();

  const metrics = useMemo(() => {
    return getMetrics(algorithmName);
  }, [getMetrics, algorithmName]);

  return {
    metrics,
  };
};
