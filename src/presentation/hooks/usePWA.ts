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
    const checkInstallation = () => {
      const isStandalone = window.matchMedia(
        '(display-mode: standalone)',
      ).matches;
      const isInApp = (window.navigator as any).standalone;
      setIsInstalled(isStandalone || isInApp);
    };

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    checkInstallation();

    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    mediaQuery.addEventListener('change', checkInstallation);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

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
