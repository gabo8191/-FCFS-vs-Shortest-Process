import { useEffect, useRef } from 'react';
import { useSimulationStore } from '../../stores/simulationStore';

export const useSimulationLoop = () => {
  const { isRunning, executeStep } = useSimulationStore();
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRunning) {
      // Limpiar intervalo anterior si existe
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      // Crear nuevo intervalo
      intervalRef.current = window.setInterval(() => {
        executeStep(100); // 100ms = 10 FPS
      }, 100);
    } else {
      // Limpiar intervalo cuando se pausa
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    // Cleanup al desmontar
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
