
export const PATHS = {
  DOMAIN: {
    ENTITIES: '@core/domain/entities',
    REPOSITORIES: '@core/domain/repositories',
    VALUE_OBJECTS: '@core/domain/value-objects',
  },

  APPLICATION: {
    USE_CASES: '@core/application/use-cases',
  },

  INFRASTRUCTURE: {
    ALGORITHMS: '@core/infrastructure/algorithms',
    GENERATORS: '@core/infrastructure/generators',
  },

  PRESENTATION: {
    COMPONENTS: '@presentation/components',
    HOOKS: '@presentation/hooks',
    STORES: '@presentation/stores',
    VIEWS: '@presentation/views',
  },

  SHARED: {
    CONFIG: '@shared/config',
    UTILS: '@shared/utils',
    TYPES: '@shared/types',
  },
} as const;
