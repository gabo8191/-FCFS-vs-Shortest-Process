import { Clock, Hash, Pause, Play, Target } from 'lucide-react';
import React from 'react';
import { Badge } from './ui/Badge';
import { ProgressBar } from './ui/ProgressBar';

interface SimulationStatusImprovedProps {
  totalProcessesGenerated: number;
  maxProcesses: number;
  currentTime: number;
  isRunning: boolean;
}

export const SimulationStatusImproved: React.FC<
  SimulationStatusImprovedProps
> = ({ totalProcessesGenerated, maxProcesses, currentTime, isRunning }) => {
  const progressPercentage = (totalProcessesGenerated / maxProcesses) * 100;
  const remainingProcesses = maxProcesses - totalProcessesGenerated;
  const isComplete = totalProcessesGenerated >= maxProcesses;

  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  };

  const getStatusConfig = () => {
    if (isComplete) {
      return {
        variant: 'success' as const,
        text: 'Simulación Completada',
        icon: Target,
        description: 'Todos los procesos han sido generados',
      };
    } else if (isRunning) {
      return {
        variant: 'info' as const,
        text: 'Simulación Activa',
        icon: Play,
        description: 'Generando y ejecutando procesos',
      };
    } else {
      return {
        variant: 'warning' as const,
        text: 'Simulación Pausada',
        icon: Pause,
        description: 'La simulación está temporalmente detenida',
      };
    }
  };

  const status = getStatusConfig();
  const StatusIcon = status.icon;

  return (
    <div className='ios-card bg-blue-50 border-blue-200'>
      <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4'>
        {/* Estado principal estilo iOS */}
        <div className='flex items-center gap-3'>
          <div className='p-2 bg-white rounded-xl shadow-sm'>
            <StatusIcon className='w-5 h-5 text-blue-500' />
          </div>
          <div>
            <div className='flex items-center gap-2 mb-0.5'>
              <h2 className='text-base font-semibold text-gray-900'>
                Estado de Simulación
              </h2>
              <Badge variant={status.variant} size='sm'>
                {status.text}
              </Badge>
            </div>
            <p className='text-xs text-gray-600'>{status.description}</p>
          </div>
        </div>

        {/* Métricas rápidas estilo iOS */}
        <div className='grid grid-cols-4 gap-3'>
          <div className='text-center'>
            <div className='flex items-center justify-center gap-1 mb-0.5'>
              <Clock className='w-3 h-3 text-gray-500' />
              <span className='text-xs text-gray-600'>Tiempo</span>
            </div>
            <div className='text-sm font-semibold text-gray-900'>
              {formatTime(currentTime / 1000)}
            </div>
          </div>

          <div className='text-center'>
            <div className='flex items-center justify-center gap-1 mb-0.5'>
              <Hash className='w-3 h-3 text-gray-500' />
              <span className='text-xs text-gray-600'>Generados</span>
            </div>
            <div className='text-sm font-semibold text-gray-900'>
              {totalProcessesGenerated}
              <span className='text-xs text-gray-500 ml-1'>
                / {maxProcesses}
              </span>
            </div>
          </div>

          <div className='text-center'>
            <div className='flex items-center justify-center gap-1 mb-0.5'>
              <Target className='w-3 h-3 text-gray-500' />
              <span className='text-xs text-gray-600'>Restantes</span>
            </div>
            <div className='text-sm font-semibold text-gray-900'>
              {remainingProcesses}
            </div>
          </div>

          <div className='text-center'>
            <div className='flex items-center justify-center gap-1 mb-0.5'>
              <div className='w-3 h-3 text-gray-500' />
              <span className='text-xs text-gray-600'>Estado</span>
            </div>
            <div className='text-sm font-semibold text-gray-900'>
              {isRunning ? 'Ejecutando' : 'Pausado'}
            </div>
          </div>
        </div>
      </div>

      {/* Barra de progreso estilo iOS */}
      <div className='mt-4'>
        <ProgressBar
          value={progressPercentage}
          variant={isComplete ? 'success' : isRunning ? 'default' : 'warning'}
          size='md'
          showPercentage
          label='Progreso de Generación'
          aria-label={`${Math.round(
            progressPercentage,
          )}% de procesos generados`}
        />
      </div>

      {/* Información adicional estilo iOS */}
      <div className='mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-600'>
        <div className='flex items-center gap-3'>
          <span>
            Velocidad: <strong className='text-gray-900'>10 FPS</strong>
          </span>
          <span>
            Paso: <strong className='text-gray-900'>100ms</strong>
          </span>
        </div>

        {isRunning && !isComplete && (
          <div className='flex items-center gap-1'>
            <div className='w-2 h-2 bg-green-500 rounded-full animate-pulse' />
            <span className='text-green-600 font-medium'>En curso</span>
          </div>
        )}

        {isComplete && (
          <div className='flex items-center gap-1'>
            <div className='w-2 h-2 bg-blue-500 rounded-full' />
            <span className='text-blue-600 font-medium'>Finalizada</span>
          </div>
        )}
      </div>
    </div>
  );
};
