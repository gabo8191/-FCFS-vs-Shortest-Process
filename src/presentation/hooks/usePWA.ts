import { useEffect, useState } from 'react';

interface PWAStatus {
  isInstalled: boolean;
  isUpdateAvailable: boolean;
  isOffline: boolean;
  updateApp: () => void;
}

export const usePWA = (): PWAStatus => {
  const [isInstalled, setIsInstalled] = useState(false);
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [updateCallback, setUpdateCallback] = useState<(() => void) | null>(
    null,
  );

  useEffect(() => {
    // Detectar si la app está instalada
    const checkInstallation = () => {
      const isStandalone = window.matchMedia(
        '(display-mode: standalone)',
      ).matches;
      const isInApp = (window.navigator as any).standalone;
      setIsInstalled(isStandalone || isInApp);
    };

    // Detectar cambios en la conectividad
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    // Verificar instalación inicial
    checkInstallation();

    // Escuchar cambios en el modo de visualización
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    mediaQuery.addEventListener('change', checkInstallation);

    // Escuchar cambios de conectividad
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Verificar actualizaciones de PWA
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (
                newWorker.state === 'installed' &&
                navigator.serviceWorker.controller
              ) {
                setIsUpdateAvailable(true);
                setUpdateCallback(() => () => {
                  newWorker.postMessage({ type: 'SKIP_WAITING' });
                  window.location.reload();
                });
              }
            });
          }
        });
      });
    }

    return () => {
      mediaQuery.removeEventListener('change', checkInstallation);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const updateApp = () => {
    if (updateCallback) {
      updateCallback();
    }
  };

  return {
    isInstalled,
    isUpdateAvailable,
    isOffline,
    updateApp,
  };
};
