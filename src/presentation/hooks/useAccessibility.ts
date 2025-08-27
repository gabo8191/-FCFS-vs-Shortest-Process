export const useAccessibility = () => {
  const announceToScreenReader = (
    message: string,
    priority: 'polite' | 'assertive' = 'polite',
  ) => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;

    document.body.appendChild(announcement);

    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  };

  const skipToContent = () => {
    const mainContent =
      document.querySelector('main') || document.querySelector('[role="main"]');
    if (mainContent) {
      (mainContent as HTMLElement).focus();
    }
  };

  return {
    announceToScreenReader,
    skipToContent,
  };
};
