import React from 'react';
import { AlgorithmMetrics } from '../../domain/entities/AlgorithmMetrics';
import { Process } from '../../domain/entities/Process';
import { MetricsDisplayImproved } from './metrics/MetricsDisplayImproved';
import { ProcessFlowVisualizationImproved } from './simulation/ProcessFlowVisualizationImproved';

interface AlgorithmPanelProps {
  algorithmName: string;
  processes: Process[];
  metrics: AlgorithmMetrics | undefined;
  icon: string;
  color: string;
}

export const AlgorithmPanel: React.FC<AlgorithmPanelProps> = ({
  algorithmName,
  processes,
  icon,
  color,
}) => {
  return (
    <div
      className={`bg-white rounded-2xl shadow-lg p-4 border-l-4 ${color} h-full flex flex-col`}
    >
      {/* Header - Más compacto */}
      <div className='flex items-center gap-2 mb-3'>
        <div
          className={`w-8 h-8 bg-gradient-to-br ${color.replace(
            'border-',
            'from-',
          )} to-opacity-80 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg`}
        >
          <span>{icon}</span>
        </div>
        <div className='flex-1'>
          <h3 className='text-sm font-bold text-gray-800'>{algorithmName}</h3>
          <p className='text-xs text-gray-500'>{processes.length} procesos</p>
        </div>
      </div>

      {/* Process Flow Visualization - Sin scroll interno */}
      <div className='mb-3 flex-1 min-h-0'>
        <h4 className='text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1'>
          <span>📊</span>
          Cola de Procesos
        </h4>
        <div className='max-h-32'>
          {processes.length === 0 ? (
            <div className='text-center py-4 text-gray-400'>
              <span className='text-lg block mb-1'>⏳</span>
              <p className='text-xs'>Sin procesos</p>
            </div>
          ) : (
            <ProcessFlowVisualizationImproved
              algorithmName={algorithmName}
              isActive={true}
            />
          )}
        </div>
      </div>

      {/* Metrics - Más compacto */}
      <div className='border-t pt-3'>
        <h4 className='text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1'>
          <span>📈</span>
          Métricas
        </h4>
        <MetricsDisplayImproved algorithmName={algorithmName} />
      </div>
    </div>
  );
};
