import React, { memo, useEffect, useState } from 'react';
import { Process } from '../../../domain/entities/Process';
import { useProcessFlow } from '../../hooks/simulation/useProcessFlow';

interface ProcessFlowVisualizationProps {
  algorithmName: string;
  isActive: boolean;
}

const ProcessItem = memo<{ process: Process; isMoving?: boolean }>(
  ({ process, isMoving = false }) => {
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
      if (isMoving) {
        setIsAnimating(true);
        const timer = setTimeout(() => setIsAnimating(false), 400);
        return () => clearTimeout(timer);
      }
    }, [isMoving]);

    const getStatusColor = (status: string) => {
      switch (status) {
        case 'running':
          return 'bg-green-500 shadow-sm';
        case 'completed':
          return 'bg-blue-500 shadow-sm';
        case 'ready':
          return 'bg-orange-500 shadow-sm';
        case 'waiting':
          return 'bg-gray-400 opacity-75';
        default:
          return 'bg-gray-300';
      }
    };

    const getStatusBg = (status: string) => {
      switch (status) {
        case 'running':
          return 'ios-process-running';
        case 'completed':
          return 'ios-process-completed';
        case 'ready':
          return 'ios-process-waiting';
        case 'waiting':
          return 'bg-white border-gray-200 opacity-60';
        default:
          return 'bg-white border-gray-200';
      }
    };

    const getProgressBar = () => {
      if (!process.isRunning()) return null;
      const progress =
        ((process.burstTime - process.remainingTime) / process.burstTime) * 100;
      return (
        <div className='w-full bg-gray-200 rounded-full h-1 mt-2 overflow-hidden'>
          <div
            className='bg-green-500 h-1 rounded-full transition-all duration-1000 ease-out'
            style={{ width: `${progress}%` }}
          />
        </div>
      );
    };

    return (
      <div
        className={`
        ios-process-card
        ${getStatusBg(process.status)}
        ${isAnimating ? 'animate-ios-process-move' : ''}
        ${process.isRunning() ? 'animate-ios-process-execute' : ''}
      `}
      >
        <div className='flex items-center space-x-3'>
          <div className='relative'>
            <div
              className={`w-3 h-3 rounded-full ${getStatusColor(
                process.status,
              )}`}
            />
            {process.isRunning() && (
              <div className='absolute -inset-0.5 bg-green-400 rounded-full animate-ping opacity-40' />
            )}
          </div>
          <div className='flex-1 min-w-0'>
            <div className='text-sm font-semibold text-gray-900 truncate'>
              {process.name}
            </div>
            <div className='text-xs text-gray-600 flex items-center space-x-2 mt-0.5'>
              <span>{process.burstTime}s</span>
              <span>•</span>
              <span>{process.size}MB</span>
              {process.isRunning() && (
                <>
                  <span>•</span>
                  <span className='text-green-600 font-medium'>
                    {process.remainingTime.toFixed(1)}s restante
                  </span>
                </>
              )}
            </div>
          </div>
          {process.isRunning() && (
            <div className='text-xs font-semibold text-green-700 bg-green-100 px-2 py-1 rounded-full'>
              Ejecutando
            </div>
          )}
          {process.isCompleted() && (
            <div className='text-xs font-medium text-blue-700 bg-blue-100 px-2 py-1 rounded-full'>
              Completado
            </div>
          )}
        </div>
        {getProgressBar()}
      </div>
    );
  },
);

ProcessItem.displayName = 'ProcessItem';

export const ProcessFlowVisualizationImproved: React.FC<ProcessFlowVisualizationProps> =
  memo(({ algorithmName, isActive }) => {
    const { processes } = useProcessFlow(algorithmName);
    const [previousProcesses, setPreviousProcesses] = useState<Process[]>([]);

    const runningProcesses = processes.filter((p) => p.isRunning());
    const readyProcesses = processes.filter((p) => p.isReady());
    const completedProcesses = processes.filter((p) => p.isCompleted());

    // Detectar movimientos de procesos
    useEffect(() => {
      setPreviousProcesses(processes);
    }, [processes]);

    const getMovingProcesses = () => {
      const previousRunning = previousProcesses
        .filter((p) => p.isRunning())
        .map((p) => p.id);
      const currentRunning = runningProcesses.map((p) => p.id);
      const newlyRunning = currentRunning.filter(
        (id) => !previousRunning.includes(id),
      );
      return newlyRunning;
    };

    const movingProcessIds = getMovingProcesses();

    return (
      <div className='ios-card-elevated h-full'>
        <div className='space-y-5'>
          {/* Header estilo iOS */}
          <div className='pb-3 border-b border-gray-100'>
            <div className='flex items-center justify-between'>
              <div>
                <h3 className='text-lg font-semibold text-gray-900 flex items-center space-x-2'>
                  <span className='text-xl'>
                    {algorithmName.includes('FCFS') ? '🚂' : '⚡'}
                  </span>
                  <span>{algorithmName}</span>
                </h3>
                <p className='text-xs text-gray-500 mt-0.5'>
                  {isActive ? 'Simulación activa' : 'Pausada'}
                </p>
              </div>
              <div className='flex items-center space-x-2'>
                <div className='flex items-center space-x-1 bg-gray-100 px-2 py-1 rounded-lg'>
                  <span className='text-xs text-gray-600'>
                    {processes.length}
                  </span>
                </div>
                <div
                  className={`w-3 h-3 rounded-full ${
                    isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* CPU - Proceso en Ejecución estilo iOS */}
          <div>
            <div className='flex items-center space-x-2 mb-3'>
              <div
                className={`w-2 h-2 rounded-full ${
                  runningProcesses.length > 0
                    ? 'bg-green-500 animate-pulse'
                    : 'bg-gray-400'
                }`}
              ></div>
              <h4 className='text-sm font-medium text-gray-700'>
                CPU - Procesador
              </h4>
            </div>

            <div
              className={`ios-card ${
                runningProcesses.length > 0
                  ? 'bg-green-50 border-green-200'
                  : 'bg-gray-50'
              } min-h-[80px] flex items-center justify-center`}
            >
              {runningProcesses.length > 0 ? (
                <div className='w-full space-y-2'>
                  {runningProcesses.map((process) => (
                    <ProcessItem
                      key={process.id}
                      process={process}
                      isMoving={movingProcessIds.includes(process.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className='text-center py-4'>
                  <div className='text-2xl mb-1 opacity-60'>💤</div>
                  <div className='text-gray-500 text-xs'>CPU inactiva</div>
                </div>
              )}
            </div>
          </div>

          {/* Cola de Listos estilo iOS */}
          <div>
            <div className='flex items-center justify-between mb-3'>
              <div className='flex items-center space-x-2'>
                <div className='w-2 h-2 bg-orange-500 rounded-full'></div>
                <h4 className='text-sm font-medium text-gray-700'>
                  Cola de Procesos
                </h4>
              </div>
              <span className='text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-lg'>
                {readyProcesses.length}
              </span>
            </div>

            <div className='ios-card bg-orange-50 border-orange-200 min-h-[80px]'>
              <div className='space-y-2 max-h-48 overflow-y-auto'>
                {readyProcesses.length > 0 ? (
                  readyProcesses.map((process, index) => (
                    <div
                      key={process.id}
                      className={`relative ${
                        index < 3 ? 'animate-ios-queue-waiting' : ''
                      }`}
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      {index === 0 && (
                        <div className='absolute -left-2 top-1/2 transform -translate-y-1/2 text-sm'>
                          {algorithmName.includes('FCFS') ? '👆' : '⚡'}
                        </div>
                      )}
                      <ProcessItem process={process} />
                    </div>
                  ))
                ) : (
                  <div className='text-center py-6'>
                    <div className='text-2xl mb-1 opacity-60'>📭</div>
                    <div className='text-gray-500 text-xs'>Cola vacía</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Procesos Completados estilo iOS */}
          <div>
            <div className='flex items-center justify-between mb-3'>
              <div className='flex items-center space-x-2'>
                <div className='w-2 h-2 bg-blue-500 rounded-full'></div>
                <h4 className='text-sm font-medium text-gray-700'>
                  Completados
                </h4>
              </div>
              <span className='text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-lg'>
                {completedProcesses.length}
              </span>
            </div>

            <div className='ios-card bg-blue-50 border-blue-200 min-h-[60px]'>
              <div className='space-y-2 max-h-32 overflow-y-auto'>
                {completedProcesses.length > 0 ? (
                  completedProcesses.map((process) => (
                    <ProcessItem key={process.id} process={process} />
                  ))
                ) : (
                  <div className='text-center py-4'>
                    <div className='text-xl mb-1 opacity-60'>🎯</div>
                    <div className='text-gray-500 text-xs'>
                      Sin procesos completados
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Estadísticas rápidas estilo iOS */}
          <div className='ios-card bg-gray-50'>
            <div className='grid grid-cols-3 gap-3 text-center'>
              <div>
                <div className='text-lg font-semibold text-green-600'>
                  {runningProcesses.length}
                </div>
                <div className='text-xs text-gray-600'>Ejecutándose</div>
              </div>
              <div>
                <div className='text-lg font-semibold text-orange-600'>
                  {readyProcesses.length}
                </div>
                <div className='text-xs text-gray-600'>En Cola</div>
              </div>
              <div>
                <div className='text-lg font-semibold text-blue-600'>
                  {completedProcesses.length}
                </div>
                <div className='text-xs text-gray-600'>Completados</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  });

ProcessFlowVisualizationImproved.displayName =
  'ProcessFlowVisualizationImproved';
