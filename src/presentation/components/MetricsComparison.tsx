import React from 'react';
import { AlgorithmMetrics } from '../../domain/entities/AlgorithmMetrics';

interface MetricsComparisonProps {
  fcfsMetrics: AlgorithmMetrics | undefined;
  sjfMetrics: AlgorithmMetrics | undefined;
  srtfMetrics: AlgorithmMetrics | undefined;
}

export const MetricsComparison: React.FC<MetricsComparisonProps> = ({
  fcfsMetrics,
  sjfMetrics,
  srtfMetrics,
}) => {
  if (!fcfsMetrics || !sjfMetrics || !srtfMetrics) {
    return (
      <div className='bg-white rounded-xl shadow-sm border border-gray-200 p-8'>
        <div className='text-center text-gray-500'>
          <div className='w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4'>
            <span className='text-2xl'>📊</span>
          </div>
          <h3 className='text-lg font-semibold text-gray-800 mb-2'>
            Análisis en Progreso
          </h3>
          <p className='text-sm text-gray-500'>
            Esperando datos de todos los algoritmos...
          </p>
        </div>
      </div>
    );
  }

  const compareMetric = (fcfs: number, sjf: number, srtf: number) => {
    const values = [
      { name: 'FCFS', value: fcfs, color: 'bg-gray-600' },
      { name: 'SJF', value: sjf, color: 'bg-gray-700' },
      { name: 'SRTF', value: srtf, color: 'bg-gray-800' },
    ];

    const sorted = [...values].sort((a, b) => a.value - b.value);
    const best = sorted[0];
    const worst = sorted[2];

    return values.map((item) => ({
      ...item,
      isBest: item.value === best.value,
      isWorst: item.value === worst.value,
    }));
  };

  const waitingTimeComparison = compareMetric(
    fcfsMetrics.averageWaitingTime,
    sjfMetrics.averageWaitingTime,
    srtfMetrics.averageWaitingTime,
  );

  const throughputComparison = compareMetric(
    -fcfsMetrics.throughput, // Negative because higher is better
    -sjfMetrics.throughput,
    -srtfMetrics.throughput,
  ).map((item) => ({ ...item, value: -item.value })); // Convert back to positive

  const turnaroundComparison = compareMetric(
    fcfsMetrics.averageTurnaroundTime,
    sjfMetrics.averageTurnaroundTime,
    srtfMetrics.averageTurnaroundTime,
  );

  const MetricBar = ({
    items,
    title,
    unit,
    icon,
  }: {
    items: any[];
    title: string;
    unit: string;
    icon: string;
  }) => (
    <div className='bg-white rounded-xl border border-gray-200 p-6'>
      <div className='flex items-center gap-2 mb-4'>
        <span className='text-lg'>{icon}</span>
        <h4 className='font-semibold text-gray-900'>{title}</h4>
      </div>
      <div className='space-y-3'>
        {items.map((item) => (
          <div key={item.name} className='flex items-center justify-between'>
            <div className='flex items-center gap-3 flex-1'>
              <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
              <span className='font-medium text-sm text-gray-800'>
                {item.name}
              </span>
              <div className='flex-1 mx-3'>
                <div className='h-2 bg-gray-100 rounded-full overflow-hidden'>
                  <div
                    className={`h-full ${item.color} transition-all duration-500`}
                    style={{
                      width: `${Math.min(
                        100,
                        (item.value / Math.max(...items.map((i) => i.value))) *
                          100,
                      )}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <span className='font-semibold text-sm text-gray-900'>
                {item.value.toFixed(2)}
                {unit}
              </span>
              {item.isBest && (
                <span className='text-green-600 text-xs'>🏆</span>
              )}
              {item.isWorst && <span className='text-red-500 text-xs'>⚠️</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className='bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden'>
      <div className='px-6 py-4 border-b border-gray-100'>
        <h3 className='text-lg font-semibold text-gray-900 mb-1'>
          Análisis Comparativo de Rendimiento
        </h3>
        <p className='text-sm text-gray-500'>
          Comparación en tiempo real de los tres algoritmos de planificación
        </p>
      </div>

      <div className='p-6 space-y-6'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
          <MetricBar
            items={waitingTimeComparison}
            title='Tiempo de Espera Promedio'
            unit='ms'
            icon='⏳'
          />

          <MetricBar
            items={turnaroundComparison}
            title='Tiempo de Retorno Promedio'
            unit='ms'
            icon='🔄'
          />

          <MetricBar
            items={throughputComparison}
            title='Rendimiento (Throughput)'
            unit=' proc/s'
            icon='⚡'
          />
        </div>

        {/* Algorithm Summary Cards */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          <div className='bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200'>
            <div className='flex items-center gap-3 mb-2'>
              <div className='w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-sm'>
                �
              </div>
              <div>
                <h5 className='font-bold text-blue-800'>FCFS</h5>
                <p className='text-xs text-blue-600'>No Apropiativo</p>
              </div>
            </div>
            <p className='text-sm text-blue-700'>
              Simple y justo. Procesa en orden de llegada sin interrupciones.
            </p>
          </div>

          <div className='bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200'>
            <div className='flex items-center gap-3 mb-2'>
              <div className='w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-white font-bold text-sm'>
                ⚡
              </div>
              <div>
                <h5 className='font-bold text-green-800'>SJF</h5>
                <p className='text-xs text-green-600'>No Apropiativo</p>
              </div>
            </div>
            <p className='text-sm text-green-700'>
              Optimiza tiempos de espera priorizando trabajos más cortos.
            </p>
          </div>

          <div className='bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200'>
            <div className='flex items-center gap-3 mb-2'>
              <div className='w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-sm'>
                🔄
              </div>
              <div>
                <h5 className='font-bold text-purple-800'>SRTF</h5>
                <p className='text-xs text-purple-600'>Apropiativo</p>
              </div>
            </div>
            <p className='text-sm text-purple-700'>
              Interrumpe procesos cuando llega uno con menor tiempo restante.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
