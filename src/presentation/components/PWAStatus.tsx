import { CheckCircle, RefreshCw, WifiOff } from 'lucide-react';
import React from 'react';
import { usePWA } from '../hooks/usePWA';

export const PWAStatus: React.FC = () => {
  const { isInstalled, isUpdateAvailable, isOffline, updateApp } = usePWA();

  if (!isInstalled && !isUpdateAvailable && !isOffline) {
    return null;
  }

  return (
    <div className='space-y-2'>
      {/* Estado Offline estilo iOS */}
      {isOffline && (
        <div className='ios-card bg-yellow-50 border-yellow-200 flex items-center space-x-2 py-2 px-3'>
          <WifiOff className='w-3 h-3 text-yellow-600' />
          <span className='text-xs font-medium text-yellow-800'>Offline</span>
        </div>
      )}

      {/* Indicador de Instalada estilo iOS */}
      {isInstalled && (
        <div className='ios-card bg-green-50 border-green-200 flex items-center space-x-2 py-2 px-3'>
          <CheckCircle className='w-3 h-3 text-green-600' />
          <span className='text-xs font-medium text-green-800'>Instalada</span>
        </div>
      )}

      {/* Actualización Disponible estilo iOS */}
      {isUpdateAvailable && (
        <div className='ios-card bg-orange-50 border-orange-200'>
          <div className='flex items-center justify-between py-2 px-3'>
            <div className='flex items-center space-x-2'>
              <RefreshCw className='w-3 h-3 text-orange-600' />
              <span className='text-xs font-medium text-orange-800'>
                Actualización
              </span>
            </div>
            <button
              onClick={updateApp}
              className='bg-orange-500 hover:bg-orange-600 text-white px-2 py-1 rounded-lg text-xs font-medium transition-colors'
            >
              Actualizar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
