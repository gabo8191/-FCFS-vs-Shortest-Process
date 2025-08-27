import { useEffect, useRef } from 'react';
import { useSimulationStore } from '../../stores/simulationStore';

export const useSimulationLoop = () => {
  const { isRunning, executeStep } = useSimulationStore();
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRunning) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      intervalRef.current = window.setInterval(() => {
        executeStep(100);
      }, 100);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, executeStep]);

  return {
    isRunning,
  };
};
