import {
  ChevronDown,
  ChevronUp,
  Pause,
  Play,
  RotateCcw,
  Settings,
} from 'lucide-react';
import React, { useState } from 'react';
import { SimulationConfig } from '../../domain/value-objects/SimulationConfig';
import { useSimulationStore } from '../stores/simulationStore';
import { EquityAnalysis } from './EquityAnalysis';

export const ControlPanelImproved: React.FC = () => {
  const {
    config,
    isRunning,
    startSimulation,
    pauseSimulation,
    resetSimulation,
    updateConfig,
  } = useSimulationStore();

  const [isConfigExpanded, setIsConfigExpanded] = useState(false);

  const handleConfigChange = (field: string, value: string) => {
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue > 0) {
      const newConfig = new SimulationConfig({
        ...config.toData(),
        [field]: numValue,
      });
      updateConfig(newConfig);
    }
  };

  return (
    <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-6'>
      <div className='flex items-center justify-between mb-6'>
        <div>
          <h2 className='text-lg font-semibold text-gray-900'>
            Control de Simulación
          </h2>
          <p className='text-sm text-gray-600'>
            Gestiona la simulación y parámetros
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <button
            onClick={() => setIsConfigExpanded(!isConfigExpanded)}
            className='flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors'
          >
            <Settings className='w-4 h-4' />
            Configuración
            {isConfigExpanded ? (
              <ChevronUp className='w-4 h-4' />
            ) : (
              <ChevronDown className='w-4 h-4' />
            )}
          </button>
        </div>
      </div>

      <div className='flex items-center gap-3 mb-6'>
        <button
          onClick={startSimulation}
          disabled={isRunning}
          className='flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white font-medium rounded-xl transition-colors'
        >
          <Play className='w-4 h-4' />
          Iniciar
        </button>

        <button
          onClick={pauseSimulation}
          disabled={!isRunning}
          className='flex items-center gap-2 px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-400 font-medium rounded-xl transition-colors'
        >
          <Pause className='w-4 h-4' />
          Pausar
        </button>

        <button
          onClick={resetSimulation}
          className='flex items-center gap-2 px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 font-medium rounded-xl transition-colors'
        >
          <RotateCcw className='w-4 h-4' />
          Reiniciar
        </button>
      </div>

      {isConfigExpanded && (
        <div className='border-t border-gray-200 pt-6'>
          {/* Selector de configuraciones preestablecidas */}
          <div className='mb-6 p-4 bg-blue-50 rounded-xl border border-blue-200'>
            <h3 className='text-sm font-semibold text-blue-900 mb-3'>
              ⚖️ Configuraciones de Equidad
            </h3>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3'>
              <button
                onClick={() => updateConfig(SimulationConfig.createBalanced())}
                className='p-3 text-left bg-white rounded-lg border border-blue-200 hover:border-blue-400 transition-colors'
              >
                <div className='font-medium text-sm text-blue-900'>
                  🎯 Balanceada
                </div>
                <div className='text-xs text-blue-700'>Más equitativa</div>
                <div className='text-xs text-gray-600 mt-1'>Ratio 2.3:1</div>
              </button>

              <button
                onClick={() =>
                  updateConfig(SimulationConfig.createFCFSFriendly())
                }
                className='p-3 text-left bg-white rounded-lg border border-green-200 hover:border-green-400 transition-colors'
              >
                <div className='font-medium text-sm text-green-900'>
                  📋 Pro-FCFS
                </div>
                <div className='text-xs text-green-700'>Procesos similares</div>
                <div className='text-xs text-gray-600 mt-1'>Ratio 1.5:1</div>
              </button>

              <button
                onClick={() =>
                  updateConfig(SimulationConfig.createSJFFriendly())
                }
                className='p-3 text-left bg-white rounded-lg border border-purple-200 hover:border-purple-400 transition-colors'
              >
                <div className='font-medium text-sm text-purple-900'>
                  ⚡ Pro-SJF
                </div>
                <div className='text-xs text-purple-700'>Alta variabilidad</div>
                <div className='text-xs text-gray-600 mt-1'>Ratio 12:1</div>
              </button>

              <button
                onClick={() => updateConfig(SimulationConfig.createDefault())}
                className='p-3 text-left bg-white rounded-lg border border-gray-200 hover:border-gray-400 transition-colors'
              >
                <div className='font-medium text-sm text-gray-900'>
                  🔧 Por Defecto
                </div>
                <div className='text-xs text-gray-700'>
                  Configuración mejorada
                </div>
                <div className='text-xs text-gray-600 mt-1'>Ratio 2.67:1</div>
              </button>
            </div>

            <div className='mt-3 text-xs text-blue-800 bg-blue-100 p-3 rounded-lg'>
              <strong>💡 Tip:</strong> La configuración "Balanceada" ofrece la
              comparación más justa entre algoritmos. El ratio indica la
              diferencia máxima/mínima entre duraciones de procesos.
            </div>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            <div className='space-y-2'>
              <label className='text-sm font-medium text-gray-700'>
                Intervalo de Generación
              </label>
              <input
                type='number'
                value={config.processGenerationInterval}
                onChange={(e) =>
                  handleConfigChange(
                    'processGenerationInterval',
                    e.target.value,
                  )
                }
                min={1}
                max={10}
                className='w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
              <p className='text-xs text-gray-500'>Segundos entre procesos</p>
            </div>

            <div className='space-y-2'>
              <label className='text-sm font-medium text-gray-700'>
                Tiempo Mínimo
              </label>
              <input
                type='number'
                value={config.minBurstTime}
                onChange={(e) =>
                  handleConfigChange('minBurstTime', e.target.value)
                }
                min={1}
                max={20}
                className='w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
              <p className='text-xs text-gray-500'>
                Duración mínima (segundos)
              </p>
            </div>

            <div className='space-y-2'>
              <label className='text-sm font-medium text-gray-700'>
                Tiempo Máximo
              </label>
              <input
                type='number'
                value={config.maxBurstTime}
                onChange={(e) =>
                  handleConfigChange('maxBurstTime', e.target.value)
                }
                min={1}
                max={50}
                className='w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
              <p className='text-xs text-gray-500'>
                Duración máxima (segundos)
              </p>
            </div>

            <div className='space-y-2'>
              <label className='text-sm font-medium text-gray-700'>
                Máximo de Procesos
              </label>
              <input
                type='number'
                value={config.maxProcesses}
                onChange={(e) =>
                  handleConfigChange('maxProcesses', e.target.value)
                }
                min={5}
                className='w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500'
              />
              <p className='text-xs text-gray-500'>
                Total de procesos a generar (sin límite)
              </p>
            </div>
          </div>

          {/* Análisis de Equidad */}
          <div className='mt-6'>
            <EquityAnalysis config={config} />
          </div>
        </div>
      )}
    </div>
  );
};
