import React from 'react';
import { ControlPanelImproved } from '../components/ControlPanelImproved';
import { PWAStatus } from '../components/PWAStatus';
import { useSimulationLoop } from '../hooks/simulation/useSimulationLoop';
import { useAccessibility } from '../hooks/useAccessibility';
import { useSimulationStore } from '../stores/simulationStore';

export const SimulationView: React.FC = () => {
  const {
    isRunning,
    currentTime,
    totalProcessesGenerated,
    maxProcesses,
    getAllProcesses,
    getMetrics,
  } = useSimulationStore();
  const { announceToScreenReader } = useAccessibility();

  useSimulationLoop();

  const fcfsProcesses = getAllProcesses('FCFS (First Come, First Serve)');
  const spProcesses = getAllProcesses('Shortest Process (SP)');
  const fcfsMetrics = getMetrics('FCFS (First Come, First Serve)');
  const spMetrics = getMetrics('Shortest Process (SP)');

  React.useEffect(() => {
    if (isRunning) {
      announceToScreenReader('Simulación iniciada', 'polite');
    }
  }, [isRunning, announceToScreenReader]);

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='container mx-auto px-4 py-6 max-w-7xl'>
        {/* Header */}
        <header className='text-center mb-8'>
          <div className='inline-flex items-center justify-center mb-4'>
            <div className='w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg'>
              <span className='text-2xl'>⚡</span>
            </div>
          </div>
          <h1 className='text-2xl font-bold text-gray-900 mb-2'>
            Process Scheduler
          </h1>
          <p className='text-sm text-gray-600'>
            Compara FCFS vs Shortest Process en tiempo real
          </p>
        </header>

        {/* Controls */}
        <div className='mb-6'>
          <ControlPanelImproved />
        </div>

        {/* Algorithm Comparison */}
        <main className='space-y-6'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            {/* FCFS Algorithm */}
            <div className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden'>
              <div className='bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4'>
                <h2 className='text-lg font-semibold text-white flex items-center gap-2'>
                  <span>🚂</span>
                  FCFS (First Come, First Serve)
                </h2>
                <p className='text-blue-100 text-sm mt-1'>
                  Se ejecutan en orden de llegada (arrival time)
                </p>
              </div>

              <div className='p-6'>
                {/* Process Queue */}
                <div className='mb-4'>
                  <h3 className='text-sm font-medium text-gray-700 mb-3'>
                    Cola de Procesos ({fcfsProcesses.length})
                  </h3>
                  <div className='space-y-2'>
                    {fcfsProcesses.length === 0 ? (
                      <div className='text-center py-8 text-gray-500'>
                        <div className='text-2xl mb-2'>📭</div>
                        <p className='text-sm'>No hay procesos</p>
                      </div>
                    ) : (
                      fcfsProcesses.map((process, index) => (
                        <div
                          key={process.id}
                          className='flex items-center justify-between p-3 bg-gray-50 rounded-xl'
                        >
                          <div className='flex items-center gap-3'>
                            <div
                              className={`w-3 h-3 rounded-full ${
                                process.status === 'running'
                                  ? 'bg-green-500 animate-pulse'
                                  : process.status === 'completed'
                                  ? 'bg-blue-500'
                                  : 'bg-orange-400'
                              }`}
                            />
                            <div className='flex items-center gap-2'>
                              <span className='font-medium text-sm'>
                                {process.name}
                              </span>
                              {process.startTime !== undefined && (
                                <span className='text-xs bg-gray-200 px-1 rounded text-gray-600'>
                                  #{index + 1}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className='flex items-center gap-2 text-xs text-gray-600'>
                            {process.startTime !== undefined && (
                              <span>Inicio: {process.startTime}ms</span>
                            )}
                            <span>
                              {process.remainingTime > 0
                                ? `${process.remainingTime}ms`
                                : 'Completado'}
                            </span>
                            {process.endTime !== undefined && (
                              <span className='bg-green-200 px-1 rounded text-green-700'>
                                {process.endTime - (process.startTime || 0)}ms
                              </span>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Metrics */}
                <div className='grid grid-cols-2 gap-4'>
                  <div className='text-center p-3 bg-blue-50 rounded-xl'>
                    <div className='text-lg font-bold text-blue-600'>
                      {fcfsMetrics?.averageWaitingTime?.toFixed(1) || '0.0'}
                    </div>
                    <div className='text-xs text-blue-600'>Tiempo Espera</div>
                  </div>
                  <div className='text-center p-3 bg-green-50 rounded-xl'>
                    <div className='text-lg font-bold text-green-600'>
                      {fcfsMetrics?.throughput?.toFixed(2) || '0.00'}
                    </div>
                    <div className='text-xs text-green-600'>Throughput</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Shortest Process Algorithm */}
            <div className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden'>
              <div className='bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-4'>
                <h2 className='text-lg font-semibold text-white flex items-center gap-2'>
                  <span>⚡</span>
                  Shortest Process (SP)
                </h2>
                <p className='text-purple-100 text-sm mt-1'>
                  Se ejecuta el proceso con menor tiempo restante (⚡)
                </p>
              </div>

              <div className='p-6'>
                {/* Process Queue */}
                <div className='mb-4'>
                  <h3 className='text-sm font-medium text-gray-700 mb-3'>
                    Cola de Procesos ({spProcesses.length})
                  </h3>
                  <div className='space-y-2'>
                    {spProcesses.length === 0 ? (
                      <div className='text-center py-8 text-gray-500'>
                        <div className='text-2xl mb-2'>📭</div>
                        <p className='text-sm'>No hay procesos</p>
                      </div>
                    ) : (
                      spProcesses.map((process, index) => (
                        <div
                          key={process.id}
                          className='flex items-center justify-between p-3 bg-gray-50 rounded-xl'
                        >
                          <div className='flex items-center gap-3'>
                            <div
                              className={`w-3 h-3 rounded-full ${
                                process.status === 'running'
                                  ? 'bg-green-500 animate-pulse'
                                  : process.status === 'completed'
                                  ? 'bg-blue-500'
                                  : 'bg-orange-400'
                              }`}
                            />
                            <div className='flex items-center gap-2'>
                              <span className='font-medium text-sm'>
                                {process.name}
                              </span>
                              {process.startTime !== undefined && (
                                <span className='text-xs bg-gray-200 px-1 rounded text-gray-600'>
                                  #{index + 1}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className='flex items-center gap-2 text-xs text-gray-600'>
                            {process.startTime !== undefined && (
                              <span>Inicio: {process.startTime}ms</span>
                            )}
                            <span>
                              {process.remainingTime > 0
                                ? `${process.remainingTime}ms`
                                : 'Completado'}
                            </span>
                            {process.endTime !== undefined && (
                              <span className='bg-green-200 px-1 rounded text-green-700'>
                                {process.endTime - (process.startTime || 0)}ms
                              </span>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Metrics */}
                <div className='grid grid-cols-2 gap-4'>
                  <div className='text-center p-3 bg-purple-50 rounded-xl'>
                    <div className='text-lg font-bold text-purple-600'>
                      {spMetrics?.averageWaitingTime?.toFixed(1) || '0.0'}
                    </div>
                    <div className='text-xs text-purple-600'>Tiempo Espera</div>
                  </div>
                  <div className='text-center p-3 bg-green-50 rounded-xl'>
                    <div className='text-lg font-bold text-green-600'>
                      {spMetrics?.throughput?.toFixed(2) || '0.00'}
                    </div>
                    <div className='text-xs text-green-600'>Throughput</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Comparison Results */}
          <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-6'>
            <h2 className='text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2'>
              <span>📊</span>
              Comparación de Eficiencia
            </h2>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div className='text-center p-4 bg-gray-50 rounded-xl'>
                <div className='text-2xl font-bold text-gray-900 mb-1'>
                  {totalProcessesGenerated}/{maxProcesses}
                </div>
                <div className='text-sm text-gray-600'>Procesos Generados</div>
              </div>

              <div className='text-center p-4 bg-gray-50 rounded-xl'>
                <div className='text-2xl font-bold text-gray-900 mb-1'>
                  {(currentTime / 1000).toFixed(1)}s
                </div>
                <div className='text-sm text-gray-600'>Tiempo Transcurrido</div>
              </div>

              <div className='text-center p-4 bg-gray-50 rounded-xl'>
                <div className='text-2xl font-bold text-gray-900 mb-1'>
                  {isRunning ? '🟢' : '🔴'}
                </div>
                <div className='text-sm text-gray-600'>
                  {isRunning ? 'Ejecutando' : 'Detenido'}
                </div>
              </div>
            </div>

            {/* Winner Indicator */}
            {fcfsMetrics && spMetrics && (
              <div className='mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100'>
                <div className='text-center'>
                  <div className='text-lg font-semibold text-gray-900 mb-2'>
                    {fcfsMetrics.averageWaitingTime <
                    spMetrics.averageWaitingTime
                      ? '🏆 FCFS es más eficiente'
                      : fcfsMetrics.averageWaitingTime >
                        spMetrics.averageWaitingTime
                      ? '🏆 Shortest Process es más eficiente'
                      : '🤝 Ambos algoritmos tienen la misma eficiencia'}
                  </div>
                  <div className='text-sm text-gray-600 mb-3'>
                    Basado en tiempo de espera promedio
                  </div>

                  {/* Detailed Metrics Comparison */}
                  <div className='grid grid-cols-2 gap-4 text-sm'>
                    <div className='text-center'>
                      <div className='font-semibold text-blue-600'>FCFS</div>
                      <div className='text-gray-600'>
                        Espera: {fcfsMetrics.averageWaitingTime.toFixed(1)}ms
                      </div>
                      <div className='text-gray-600'>
                        Throughput: {fcfsMetrics.throughput.toFixed(2)}
                      </div>
                    </div>
                    <div className='text-center'>
                      <div className='font-semibold text-purple-600'>SP</div>
                      <div className='text-gray-600'>
                        Espera: {spMetrics.averageWaitingTime.toFixed(1)}ms
                      </div>
                      <div className='text-gray-600'>
                        Throughput: {spMetrics.throughput.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Visual Legend */}
          <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-6'>
            <h2 className='text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2'>
              <span>📖</span>
              Cómo Comparar los Algoritmos
            </h2>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              {/* FCFS Legend */}
              <div>
                <h3 className='text-sm font-semibold text-blue-600 mb-3'>
                  🚂 FCFS - First Come, First Serve
                </h3>
                <p className='text-sm text-gray-600 mb-2'>
                  Los procesos se ejecutan en orden de llegada, sin importar su
                  duración.
                </p>
                <p className='text-xs text-gray-500 italic'>
                  "El primero que llega, es el primero que se atiende"
                </p>
              </div>

              {/* SP Legend */}
              <div>
                <h3 className='text-sm font-semibold text-purple-600 mb-3'>
                  ⚡ SP - Shortest Process
                </h3>
                <p className='text-sm text-gray-600 mb-2'>
                  Siempre ejecuta el proceso con menor tiempo restante. Puede
                  interrumpir procesos.
                </p>
                <p className='text-xs text-gray-500 italic'>
                  "El más corto primero, optimizando el tiempo de espera"
                </p>
              </div>
            </div>

            {/* Status Legend */}
            <div className='mt-6 pt-4 border-t border-gray-100'>
              <h3 className='text-sm font-semibold text-gray-700 mb-3'>
                Estados de Proceso
              </h3>
              <div className='flex flex-wrap gap-4 text-xs'>
                <div className='flex items-center gap-2'>
                  <div className='w-3 h-3 bg-orange-400 rounded-full'></div>
                  <span>Esperando</span>
                </div>
                <div className='flex items-center gap-2'>
                  <div className='w-3 h-3 bg-green-500 rounded-full animate-pulse'></div>
                  <span>Ejecutando</span>
                </div>
                <div className='flex items-center gap-2'>
                  <div className='w-3 h-3 bg-blue-500 rounded-full'></div>
                  <span>Completado</span>
                </div>
                <div className='flex items-center gap-2'>
                  <span className='bg-gray-200 px-1 rounded text-gray-600'>
                    #X
                  </span>
                  <span>Orden de ejecución</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <div className='fixed bottom-4 right-4 z-40'>
        <PWAStatus />
      </div>
    </div>
  );
};
