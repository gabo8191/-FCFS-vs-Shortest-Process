// Path aliases for better imports
export const PATHS = {
  // Core domain
  DOMAIN: {
    ENTITIES: '@core/domain/entities',
    REPOSITORIES: '@core/domain/repositories',
    VALUE_OBJECTS: '@core/domain/value-objects',
  },

  // Application layer
  APPLICATION: {
    USE_CASES: '@core/application/use-cases',
  },

  // Infrastructure
  INFRASTRUCTURE: {
    ALGORITHMS: '@core/infrastructure/algorithms',
    GENERATORS: '@core/infrastructure/generators',
  },

  // Presentation layer
  PRESENTATION: {
    COMPONENTS: '@presentation/components',
    HOOKS: '@presentation/hooks',
    STORES: '@presentation/stores',
    VIEWS: '@presentation/views',
  },

  // Shared
  SHARED: {
    CONFIG: '@shared/config',
    UTILS: '@shared/utils',
    TYPES: '@shared/types',
  },
} as const;
