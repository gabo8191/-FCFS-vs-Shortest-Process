import React from 'react';
import { ControlPanelImproved } from '../components/ControlPanelImproved';
import { MetricsComparison } from '../components/MetricsComparison';
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

  // ¡¡¡ESTO ES CRÍTICO!!! - Sin esto el loop no funciona
  useSimulationLoop();

  // Get processes for each algorithm
  const fcfsProcesses = getAllProcesses('FCFS (First Come, First Serve)');
  const sjfProcesses = getAllProcesses(
    'SJF (Shortest Job First - Non-Preemptive)',
  );
  const srtfProcesses = getAllProcesses(
    'SRTF (Shortest Remaining Time First - Preemptive)',
  );
  const fcfsMetrics = getMetrics('FCFS (First Come, First Serve)');
  const sjfMetrics = getMetrics('SJF (Shortest Job First - Non-Preemptive)');
  const srtfMetrics = getMetrics(
    'SRTF (Shortest Remaining Time First - Preemptive)',
  );

  React.useEffect(() => {
    if (isRunning) {
      announceToScreenReader('Simulación iniciada', 'polite');
    }
  }, [isRunning, announceToScreenReader]);

  // Debug logging
  React.useEffect(() => {
    console.log('🔍 SimulationView Debug:', {
      isRunning,
      currentTime,
      totalProcessesGenerated,
      maxProcesses,
      fcfsProcessesCount: fcfsProcesses.length,
      sjfProcessesCount: sjfProcesses.length,
      srtfProcessesCount: srtfProcesses.length,
      fcfsProcesses: fcfsProcesses.map((p) => ({
        id: p.id,
        name: p.name,
        status: p.status,
        arrivalTime: p.arrivalTime,
        burstTime: p.burstTime,
        remainingTime: p.remainingTime,
      })),
    });
  }, [
    isRunning,
    currentTime,
    totalProcessesGenerated,
    fcfsProcesses,
    sjfProcesses,
    srtfProcesses,
  ]);

  return (
    <div className='min-h-screen bg-gray-50 p-6 overflow-y-auto'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-semibold text-gray-900 mb-2'>
            Simulador de Algoritmos de Planificación
          </h1>
          <p className='text-gray-500 text-lg font-light'>
            Comparación en tiempo real de FCFS, SJF y SRTF
          </p>
        </div>

        {/* Status Bar */}
        <div className='bg-white rounded-3xl shadow-sm border border-gray-100 p-6 mb-8'>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-6 text-center'>
            <div>
              <div className='text-3xl font-light text-gray-900'>
                {totalProcessesGenerated}
              </div>
              <div className='text-sm text-gray-500 font-medium mt-1'>
                Procesos Generados
              </div>
            </div>
            {/* <div>
              <div className='text-3xl font-light text-gray-900'>
                {maxProcesses}
              </div>
              <div className='text-sm text-gray-500 font-medium mt-1'>
                Máximo Procesos
              </div>
            </div> */}
            <div>
              <div className='text-3xl font-light text-gray-900'>
                {Math.round(currentTime / 1000)}s
              </div>
              <div className='text-sm text-gray-500 font-medium mt-1'>
                Tiempo Transcurrido
              </div>
            </div>
            <div>
              <div
                className={`text-3xl font-light ${
                  isRunning ? 'text-green-600' : 'text-gray-400'
                }`}
              >
                {isRunning ? '●' : '○'}
              </div>
              <div className='text-sm text-gray-500 font-medium mt-1'>
                {isRunning ? 'Ejecutando' : 'Pausado'}
              </div>
            </div>
          </div>
        </div>

        {/* Control Panel */}
        <div className='mb-8'>
          <ControlPanelImproved />
        </div>

        {/* Main Comparison Table */}
        <div className='bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-8'>
          <div className='bg-gray-50 border-b border-gray-100 px-6 py-4'>
            <h2 className='text-xl font-semibold text-gray-900 text-center'>
              Comparación de Algoritmos
            </h2>
          </div>

          <div className='p-1'>
            <table className='w-full'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-6 py-4 text-left text-sm font-semibold text-gray-700'>
                    Algoritmo
                  </th>
                  <th className='px-6 py-4 text-center text-sm font-semibold text-gray-700'>
                    Estado
                  </th>
                  <th className='px-6 py-4 text-center text-sm font-semibold text-gray-700'>
                    En Cola
                  </th>
                  <th className='px-6 py-4 text-center text-sm font-semibold text-gray-700'>
                    Completados
                  </th>
                  <th className='px-6 py-4 text-center text-sm font-semibold text-gray-700'>
                    T. Espera
                  </th>
                  <th className='px-6 py-4 text-center text-sm font-semibold text-gray-700'>
                    T. Retorno
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-50'>
                {/* FCFS Row */}
                <tr className='hover:bg-gray-25 transition-colors duration-200'>
                  <td className='px-6 py-5'>
                    <div className='flex items-center gap-4'>
                      <div className='w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center'>
                        <span className='text-lg'>📋</span>
                      </div>
                      <div>
                        <div className='flex items-center gap-3'>
                          <span className='font-semibold text-gray-900'>
                            FCFS
                          </span>
                          <span className='px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium'>
                            No Apropiativo
                          </span>
                        </div>
                        <div className='text-sm text-gray-500 mt-1'>
                          Primero en Llegar, Primero en Servirse
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className='px-6 py-5 text-center'>
                    <div className='inline-flex items-center gap-2'>
                      <div
                        className={`w-2 h-2 rounded-full ${
                          fcfsProcesses.find((p) => p.status === 'running')
                            ? 'bg-green-500'
                            : 'bg-gray-300'
                        }`}
                      ></div>
                      <span className='text-sm font-medium text-gray-700'>
                        {fcfsProcesses.find((p) => p.status === 'running')
                          ?.name || 'Inactivo'}
                      </span>
                    </div>
                  </td>
                  <td className='px-6 py-5 text-center'>
                    <div className='text-lg font-semibold text-gray-900'>
                      {
                        fcfsProcesses.filter(
                          (p) => p.status === 'waiting' || p.status === 'ready',
                        ).length
                      }
                    </div>
                  </td>
                  <td className='px-6 py-5 text-center'>
                    <div className='text-lg font-semibold text-gray-900'>
                      {
                        fcfsProcesses.filter((p) => p.status === 'completed')
                          .length
                      }
                    </div>
                  </td>
                  <td className='px-6 py-5 text-center'>
                    <div className='text-sm font-medium text-gray-700'>
                      {fcfsMetrics?.averageWaitingTime?.toFixed(1) || '0.0'}ms
                    </div>
                  </td>
                  <td className='px-6 py-5 text-center'>
                    <div className='text-sm font-medium text-gray-700'>
                      {fcfsMetrics?.averageTurnaroundTime?.toFixed(1) || '0.0'}
                      ms
                    </div>
                  </td>
                </tr>

                {/* SJF Row */}
                <tr className='hover:bg-gray-25 transition-colors duration-200'>
                  <td className='px-6 py-5'>
                    <div className='flex items-center gap-4'>
                      <div className='w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center'>
                        <span className='text-lg'>⚡</span>
                      </div>
                      <div>
                        <div className='flex items-center gap-3'>
                          <span className='font-semibold text-gray-900'>
                            SJF
                          </span>
                          <span className='px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium'>
                            No Apropiativo
                          </span>
                        </div>
                        <div className='text-sm text-gray-500 mt-1'>
                          Trabajo Más Corto Primero
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className='px-6 py-5 text-center'>
                    <div className='inline-flex items-center gap-2'>
                      <div
                        className={`w-2 h-2 rounded-full ${
                          sjfProcesses.find((p) => p.status === 'running')
                            ? 'bg-green-500'
                            : 'bg-gray-300'
                        }`}
                      ></div>
                      <span className='text-sm font-medium text-gray-700'>
                        {sjfProcesses.find((p) => p.status === 'running')
                          ?.name || 'Inactivo'}
                      </span>
                    </div>
                  </td>
                  <td className='px-6 py-5 text-center'>
                    <div className='text-lg font-semibold text-gray-900'>
                      {
                        sjfProcesses.filter(
                          (p) => p.status === 'waiting' || p.status === 'ready',
                        ).length
                      }
                    </div>
                  </td>
                  <td className='px-6 py-5 text-center'>
                    <div className='text-lg font-semibold text-gray-900'>
                      {
                        sjfProcesses.filter((p) => p.status === 'completed')
                          .length
                      }
                    </div>
                  </td>
                  <td className='px-6 py-5 text-center'>
                    <div className='text-sm font-medium text-gray-700'>
                      {sjfMetrics?.averageWaitingTime?.toFixed(1) || '0.0'}ms
                    </div>
                  </td>
                  <td className='px-6 py-5 text-center'>
                    <div className='text-sm font-medium text-gray-700'>
                      {sjfMetrics?.averageTurnaroundTime?.toFixed(1) || '0.0'}ms
                    </div>
                  </td>
                </tr>

                {/* SRTF Row */}
                <tr className='hover:bg-gray-25 transition-colors duration-200'>
                  <td className='px-6 py-5'>
                    <div className='flex items-center gap-4'>
                      <div className='w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center'>
                        <span className='text-lg'>🔄</span>
                      </div>
                      <div>
                        <div className='flex items-center gap-3'>
                          <span className='font-semibold text-gray-900'>
                            SRTF
                          </span>
                          <span className='px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium'>
                            Apropiativo
                          </span>
                        </div>
                        <div className='text-sm text-gray-500 mt-1'>
                          Tiempo Restante Más Corto Primero
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className='px-6 py-5 text-center'>
                    <div className='inline-flex items-center gap-2'>
                      <div
                        className={`w-2 h-2 rounded-full ${
                          srtfProcesses.find((p) => p.status === 'running')
                            ? 'bg-green-500'
                            : 'bg-gray-300'
                        }`}
                      ></div>
                      <span className='text-sm font-medium text-gray-700'>
                        {srtfProcesses.find((p) => p.status === 'running')
                          ?.name || 'Inactivo'}
                      </span>
                    </div>
                  </td>
                  <td className='px-6 py-5 text-center'>
                    <div className='text-lg font-semibold text-gray-900'>
                      {
                        srtfProcesses.filter(
                          (p) => p.status === 'waiting' || p.status === 'ready',
                        ).length
                      }
                    </div>
                  </td>
                  <td className='px-6 py-5 text-center'>
                    <div className='text-lg font-semibold text-gray-900'>
                      {
                        srtfProcesses.filter((p) => p.status === 'completed')
                          .length
                      }
                    </div>
                  </td>
                  <td className='px-6 py-5 text-center'>
                    <div className='text-sm font-medium text-gray-700'>
                      {srtfMetrics?.averageWaitingTime?.toFixed(1) || '0.0'}ms
                    </div>
                  </td>
                  <td className='px-6 py-5 text-center'>
                    <div className='text-sm font-medium text-gray-700'>
                      {srtfMetrics?.averageTurnaroundTime?.toFixed(1) || '0.0'}
                      ms
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Process Lists */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6'>
          <div className='bg-white rounded-xl shadow-sm border border-gray-200'>
            <div className='px-6 py-4 border-b border-gray-100'>
              <h3 className='font-semibold text-gray-900 text-center'>
                Lista de Procesos FCFS
              </h3>
            </div>
            <div className='p-4'>
              {fcfsProcesses.length === 0 ? (
                <div className='text-center text-gray-500 py-8'>
                  No hay procesos
                </div>
              ) : (
                <div className='space-y-3'>
                  {fcfsProcesses.map((process, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border transition-all duration-200 ${
                        process.status === 'running'
                          ? 'bg-green-50 border-green-200'
                          : process.status === 'completed'
                          ? 'bg-gray-50 border-gray-200'
                          : 'bg-white border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className='flex justify-between items-center'>
                        <span className='font-medium text-gray-900'>
                          {process.name}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            process.status === 'running'
                              ? 'bg-green-100 text-green-700'
                              : process.status === 'completed'
                              ? 'bg-gray-100 text-gray-600'
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {process.status === 'running'
                            ? 'Ejecutando'
                            : process.status === 'completed'
                            ? 'Completado'
                            : process.status === 'ready'
                            ? 'Listo'
                            : 'Esperando'}
                        </span>
                      </div>
                      <div className='text-xs text-gray-500 mt-1'>
                        Llegada: {process.arrivalTime}ms | Ráfaga:{' '}
                        {process.burstTime}ms | Restante:{' '}
                        {process.remainingTime}ms
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className='bg-white rounded-xl shadow-sm border border-gray-200'>
            <div className='px-6 py-4 border-b border-gray-100'>
              <h3 className='font-semibold text-gray-900 text-center'>
                Lista de Procesos SJF
              </h3>
            </div>
            <div className='p-4'>
              {sjfProcesses.length === 0 ? (
                <div className='text-center text-gray-500 py-8'>
                  No hay procesos
                </div>
              ) : (
                <div className='space-y-3'>
                  {sjfProcesses.map((process, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border transition-all duration-200 ${
                        process.status === 'running'
                          ? 'bg-green-50 border-green-200'
                          : process.status === 'completed'
                          ? 'bg-gray-50 border-gray-200'
                          : 'bg-white border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className='flex justify-between items-center'>
                        <span className='font-medium text-gray-900'>
                          {process.name}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            process.status === 'running'
                              ? 'bg-green-100 text-green-700'
                              : process.status === 'completed'
                              ? 'bg-gray-100 text-gray-600'
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {process.status === 'running'
                            ? 'Ejecutando'
                            : process.status === 'completed'
                            ? 'Completado'
                            : process.status === 'ready'
                            ? 'Listo'
                            : 'Esperando'}
                        </span>
                      </div>
                      <div className='text-xs text-gray-500 mt-1'>
                        Llegada: {process.arrivalTime}ms | Ráfaga:{' '}
                        {process.burstTime}ms | Restante:{' '}
                        {process.remainingTime}ms
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className='bg-white rounded-xl shadow-sm border border-gray-200'>
            <div className='px-6 py-4 border-b border-gray-100'>
              <h3 className='font-semibold text-gray-900 text-center'>
                Lista de Procesos SRTF
              </h3>
            </div>
            <div className='p-4'>
              {srtfProcesses.length === 0 ? (
                <div className='text-center text-gray-500 py-8'>
                  No hay procesos
                </div>
              ) : (
                <div className='space-y-3'>
                  {srtfProcesses.map((process, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border transition-all duration-200 ${
                        process.status === 'running'
                          ? 'bg-green-50 border-green-200'
                          : process.status === 'completed'
                          ? 'bg-gray-50 border-gray-200'
                          : 'bg-white border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className='flex justify-between items-center'>
                        <span className='font-medium text-gray-900'>
                          {process.name}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            process.status === 'running'
                              ? 'bg-green-100 text-green-700'
                              : process.status === 'completed'
                              ? 'bg-gray-100 text-gray-600'
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {process.status === 'running'
                            ? 'Ejecutando'
                            : process.status === 'completed'
                            ? 'Completado'
                            : process.status === 'ready'
                            ? 'Listo'
                            : 'Esperando'}
                        </span>
                      </div>
                      <div className='text-xs text-gray-500 mt-1'>
                        Llegada: {process.arrivalTime}ms | Ráfaga:{' '}
                        {process.burstTime}ms | Restante:{' '}
                        {process.remainingTime}ms
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Metrics Comparison */}
        <div className='mb-6'>
          <MetricsComparison
            fcfsMetrics={fcfsMetrics}
            sjfMetrics={sjfMetrics}
            srtfMetrics={srtfMetrics}
          />
        </div>

        {/* PWA Status */}
        <PWAStatus />
      </div>
    </div>
  );
};

export default SimulationView;
