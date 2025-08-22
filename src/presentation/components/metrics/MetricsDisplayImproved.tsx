import React, { memo } from 'react';
import { useMetrics } from '../../hooks/metrics/useMetrics';
import { Card } from '../ui/Card';

interface MetricsDisplayProps {
  algorithmName: string;
}

const MetricCard = memo<{
  label: string;
  value: string | number;
  unit?: string;
  color?: string;
  icon?: string;
}>(({ label, value, unit = '', color = 'text-gray-800', icon }) => (
  <div className='bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all duration-200'>
    <div className='flex items-center justify-between mb-3'>
      <div className='text-xs font-medium text-gray-500 uppercase tracking-wide'>
        {label}
      </div>
      {icon && <div className='text-lg opacity-60'>{icon}</div>}
    </div>
    <div className={`text-2xl font-bold ${color} leading-none`}>
      {typeof value === 'number' ? value.toFixed(2) : value}
      <span className='text-sm font-normal text-gray-500 ml-1'>{unit}</span>
    </div>
  </div>
));

MetricCard.displayName = 'MetricCard';

export const MetricsDisplayImproved: React.FC<MetricsDisplayProps> = memo(
  ({ algorithmName }) => {
    const { metrics } = useMetrics(algorithmName);

    if (!metrics) {
      return (
        <Card variant='elevated'>
          <div className='text-center text-gray-500'>
            No hay métricas disponibles para {algorithmName}
          </div>
        </Card>
      );
    }

    return (
      <Card variant='elevated' className='overflow-hidden'>
        <div className='space-y-6'>
          {/* Header */}
          <div className='pb-4 border-b border-gray-100'>
            <h3 className='text-xl font-bold text-gray-800'>{algorithmName}</h3>
            <p className='text-sm text-gray-500 mt-1'>
              Métricas de rendimiento en tiempo real
            </p>
          </div>

          {/* Primary Metrics */}
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <MetricCard
              label='Procesos Totales'
              value={metrics.totalProcesses}
              color='text-blue-600'
              icon='📊'
            />
            <MetricCard
              label='Throughput'
              value={metrics.throughput}
              unit='proc/s'
              color='text-purple-600'
              icon='⚡'
            />
          </div>

          {/* Time Metrics */}
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <MetricCard
              label='Tiempo de Espera'
              value={metrics.averageWaitingTime}
              unit='s'
              color='text-amber-600'
              icon='⏳'
            />
            <MetricCard
              label='Tiempo de Retorno'
              value={metrics.averageTurnaroundTime}
              unit='s'
              color='text-emerald-600'
              icon='🔄'
            />
          </div>

          {/* System Metrics */}
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <MetricCard
              label='Utilización de CPU'
              value={metrics.cpuUtilization}
              unit='%'
              color='text-red-600'
              icon='🖥️'
            />
            <MetricCard
              label='Tiempo Total'
              value={metrics.totalExecutionTime / 1000}
              unit='s'
              color='text-cyan-600'
              icon='⏱️'
            />
          </div>
        </div>
      </Card>
    );
  },
);

MetricsDisplayImproved.displayName = 'MetricsDisplayImproved';
