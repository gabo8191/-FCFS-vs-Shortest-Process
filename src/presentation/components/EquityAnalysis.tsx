import { AlertTriangle, CheckCircle, Info } from 'lucide-react';
import React from 'react';
import { SimulationConfig } from '../../domain/value-objects/SimulationConfig';

interface EquityAnalysisProps {
  config: SimulationConfig;
}

export const EquityAnalysis: React.FC<EquityAnalysisProps> = ({ config }) => {
  const analyzeEquity = () => {
    const ratio = config.maxBurstTime / config.minBurstTime;
    const rangeSpread = config.maxBurstTime - config.minBurstTime;

    // Análisis de equidad basado en investigación de algoritmos de planificación
    let equityLevel: 'excellent' | 'good' | 'fair' | 'poor';
    let favorsAlgorithm: 'balanced' | 'fcfs' | 'sjf';
    let recommendation: string;

    if (ratio <= 2.0) {
      equityLevel = 'excellent';
      favorsAlgorithm = 'fcfs';
      recommendation =
        'Configuración excelente para FCFS. Los procesos tienen duraciones similares.';
    } else if (ratio <= 3.0) {
      equityLevel = 'good';
      favorsAlgorithm = 'balanced';
      recommendation =
        'Configuración balanceada. Comparación justa entre algoritmos.';
    } else if (ratio <= 5.0) {
      equityLevel = 'fair';
      favorsAlgorithm = 'sjf';
      recommendation =
        'Favorece ligeramente a SJF. Hay suficiente variabilidad para mostrar ventajas.';
    } else {
      equityLevel = 'poor';
      favorsAlgorithm = 'sjf';
      recommendation =
        'Favorece significativamente a SJF. FCFS estará en desventaja.';
    }

    return {
      ratio,
      rangeSpread,
      equityLevel,
      favorsAlgorithm,
      recommendation,
      generationPressure:
        config.processGenerationInterval <= 2
          ? 'high'
          : config.processGenerationInterval <= 4
          ? 'medium'
          : 'low',
    };
  };

  const analysis = analyzeEquity();

  const getEquityColor = () => {
    switch (analysis.equityLevel) {
      case 'excellent':
        return 'green';
      case 'good':
        return 'blue';
      case 'fair':
        return 'yellow';
      case 'poor':
        return 'red';
    }
  };

  const getEquityIcon = () => {
    switch (analysis.equityLevel) {
      case 'excellent':
      case 'good':
        return <CheckCircle className='w-4 h-4' />;
      case 'fair':
        return <Info className='w-4 h-4' />;
      case 'poor':
        return <AlertTriangle className='w-4 h-4' />;
    }
  };

  const getAlgorithmIndicator = () => {
    switch (analysis.favorsAlgorithm) {
      case 'balanced':
        return '⚖️ Balanceada';
      case 'fcfs':
        return '📋 Favorece FCFS';
      case 'sjf':
        return '⚡ Favorece SJF';
    }
  };

  const color = getEquityColor();

  return (
    <div
      className={`p-4 border-l-4 border-${color}-400 bg-${color}-50 rounded-r-xl`}
    >
      <div className='flex items-start gap-3'>
        <div className={`text-${color}-600 mt-0.5`}>{getEquityIcon()}</div>

        <div className='flex-1'>
          <div className='flex items-center justify-between mb-2'>
            <h4 className={`font-medium text-${color}-900`}>
              Análisis de Equidad
            </h4>
            <span
              className={`text-xs px-2 py-1 bg-${color}-100 text-${color}-800 rounded-full`}
            >
              {getAlgorithmIndicator()}
            </span>
          </div>

          <div className='grid grid-cols-2 gap-4 mb-3 text-sm'>
            <div>
              <span className='text-gray-600'>Ratio:</span>
              <span className={`ml-2 font-medium text-${color}-800`}>
                {analysis.ratio.toFixed(2)}:1
              </span>
            </div>
            <div>
              <span className='text-gray-600'>Rango:</span>
              <span className={`ml-2 font-medium text-${color}-800`}>
                {analysis.rangeSpread}s
              </span>
            </div>
            <div>
              <span className='text-gray-600'>Presión:</span>
              <span className={`ml-2 font-medium text-${color}-800 capitalize`}>
                {analysis.generationPressure}
              </span>
            </div>
            <div>
              <span className='text-gray-600'>Equidad:</span>
              <span className={`ml-2 font-medium text-${color}-800 capitalize`}>
                {analysis.equityLevel}
              </span>
            </div>
          </div>

          <p className={`text-sm text-${color}-800`}>
            {analysis.recommendation}
          </p>

          {analysis.equityLevel === 'poor' && (
            <div
              className={`mt-3 text-xs p-2 bg-${color}-100 rounded border border-${color}-200`}
            >
              <strong>⚠️ Sugerencia:</strong> Considera usar la configuración
              "Balanceada" para una comparación más justa entre algoritmos.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
