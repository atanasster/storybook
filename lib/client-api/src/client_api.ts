/* eslint no-underscore-dangle: 0 */
import isPlainObject from 'is-plain-object';
import { logger } from '@storybook/client-logger';
import { StoryContext, StoryFn, Parameters, StoryGetter } from '@storybook/addons';
import { toId } from '@storybook/csf';

import mergeWith from 'lodash/mergeWith';
import isEqual from 'lodash/isEqual';
import get from 'lodash/get';
import { StoryProperties, ContextStoryProperty, StoryProperty } from '@storybook/common';
import { ClientApiParams, DecoratorFunction, ClientApiAddons, StoryApi } from './types';
import { applyHooks } from './hooks';
import StoryStore from './story_store';

// merge with concatenating arrays, but no duplicates
const merge = (a: any, b: any) =>
  mergeWith({}, a, b, (objValue, srcValue) => {
    if (Array.isArray(srcValue) && Array.isArray(objValue)) {
      srcValue.forEach(s => {
        const existing = objValue.find(o => o === s || isEqual(o, s));
        if (!existing) {
          objValue.push(s);
        }
      });

      return objValue;
    }
    if (Array.isArray(objValue)) {
      logger.log('the types mismatch, picking', objValue);
      return objValue;
    }
    return undefined;
  });

const defaultContext: StoryContext = {
  id: 'unspecified',
  name: 'unspecified',
  kind: 'unspecified',
  parameters: {},
  properties: {},
};

export const defaultDecorateStory = (storyFn: StoryFn, decorators: DecoratorFunction[]) =>
  decorators.reduce(
    (decorated, decorator) => (context: StoryContext = defaultContext) =>
      decorator(
        p =>
          decorated(
            p
              ? {
                  ...context,
                  ...p,
                  parameters: { ...context.parameters, ...p.parameters },
                }
              : context
          ),
        context
      ),
    storyFn
  );

let _globalDecorators: DecoratorFunction[] = [];

let _globalParameters: Parameters = {};

export const addDecorator = (decoratorFn: DecoratorFunction) => {
  _globalDecorators.push(decoratorFn);
};

export const addParameters = (parameters: Parameters) => {
  _globalParameters = {
    ..._globalParameters,
    ...parameters,
    options: {
      ...merge(get(_globalParameters, 'options', {}), get(parameters, 'options', {})),
    },
    // FIXME: https://github.com/storybookjs/storybook/issues/7872
    docs: {
      ...merge(get(_globalParameters, 'docs', {}), get(parameters, 'docs', {})),
    },
  };
};

let _globalProperties: StoryProperties = {};

export const addProperties = (properties: StoryProperties) => {
  _globalProperties = {
    ..._globalProperties,
    ...properties,
  };
};

export default class ClientApi {
  private _storyStore: StoryStore;

  private _addons: ClientApiAddons<unknown>;

  private _decorateStory: (storyFn: StoryGetter, decorators: DecoratorFunction[]) => any;

  constructor({ storyStore, decorateStory = defaultDecorateStory }: ClientApiParams) {
    this._storyStore = storyStore;
    this._addons = {};

    this._decorateStory = decorateStory;

    if (!storyStore) {
      throw new Error('storyStore is required');
    }
  }

  setAddon = (addon: any) => {
    this._addons = {
      ...this._addons,
      ...addon,
    };
  };

  getSeparators = () => {
    const { hierarchySeparator, hierarchyRootSeparator, showRoots } =
      _globalParameters.options || {};

    // Note these checks will be removed in 6.0, leaving this much simpler
    if (
      typeof hierarchySeparator !== 'undefined' ||
      typeof hierarchyRootSeparator !== 'undefined'
    ) {
      return { hierarchySeparator, hierarchyRootSeparator };
    }
    if (
      typeof showRoots === 'undefined' &&
      this.store()
        .getStoryKinds()
        .some(kind => kind.match(/\.|\|/))
    ) {
      return {
        hierarchyRootSeparator: '|',
        hierarchySeparator: /\/|\./,
      };
    }
    return { hierarchySeparator: '/' };
  };

  addDecorator = (decorator: DecoratorFunction) => {
    addDecorator(decorator);
  };

  addParameters = (parameters: Parameters) => {
    addParameters(parameters);
  };

  clearDecorators = () => {
    _globalDecorators = [];
  };

  clearParameters = () => {
    // Utility function FOR TESTING USE ONLY
    _globalParameters = {};
  };

  addProperties = (properties: StoryProperties) => {
    addProperties(properties);
  };

  clearPproperties = () => {
    // Utility function FOR TESTING USE ONLY
    _globalProperties = {};
  };

  setPropertyValue = (storyId: string, propertyName: string | undefined, value: any) => {
    this._storyStore.setPropertyValue(storyId, propertyName, value);
  };

  resetPropertyValue = (storyId: string, propertyName?: string) => {
    this._storyStore.resetPropertyValue(storyId, propertyName);
  };

  clickProperty = (storyId: string, propertyName: string, property: ContextStoryProperty) => {
    this._storyStore.clickProperty(storyId, propertyName, property);
  };

  setProperties = (storyId: string, properties: StoryProperties) => {
    this._storyStore.setProperties(storyId, properties);
  };

  // what are the occasions that "m" is a boolean vs an obj
  storiesOf = <StoryFnReturnType = unknown>(
    kind: string,
    m: NodeModule
  ): StoryApi<StoryFnReturnType> => {
    if (!kind && typeof kind !== 'string') {
      throw new Error('Invalid or missing kind provided for stories, should be a string');
    }

    if (!m) {
      logger.warn(
        `Missing 'module' parameter for story with a kind of '${kind}'. It will break your HMR`
      );
    }

    if (m) {
      const proto = Object.getPrototypeOf(m);
      if (proto.exports && proto.exports.default) {
        // FIXME: throw an error in SB6.0
        logger.error(
          `Illegal mix of CSF default export and storiesOf calls in a single file: ${proto.i}`
        );
      }
    }

    if (m && m.hot && m.hot.dispose) {
      m.hot.dispose(() => {
        const { _storyStore } = this;
        _storyStore.removeStoryKind(kind);
        _storyStore.incrementRevision();
      });
    }

    const localDecorators: DecoratorFunction<StoryFnReturnType>[] = [];
    let localParameters: Parameters = {};
    let localProperties: StoryProperties = {};
    let hasAdded = false;
    const api: StoryApi<StoryFnReturnType> = {
      kind: kind.toString(),
      add: () => api,
      addDecorator: () => api,
      setPropertyValue: () => api,
      clickProperty: () => api,
      addParameters: () => api,
      addProperties: () => api,
    };

    // apply addons
    Object.keys(this._addons).forEach(name => {
      const addon = this._addons[name];
      api[name] = (...args: any[]) => {
        addon.apply(api, args);
        return api;
      };
    });
    api.setPropertyValue = ({
      id,
      propertyName,
      value,
    }: {
      id: string;
      propertyName?: string;
      value: any;
    }) => {
      this._storyStore.setPropertyValue(id, propertyName, value);
      return api;
    };

    api.clickProperty = ({
      id,
      propertyName,
      property,
    }: {
      id: string;
      propertyName?: string;
      property: ContextStoryProperty;
    }) => {
      this._storyStore.clickProperty(id, propertyName, property);
      return api;
    };

    api.add = (
      storyName,
      storyFn,
      parameters: Parameters = {},
      properties: StoryProperties = {}
    ) => {
      hasAdded = true;

      const id = parameters.__id || toId(kind, storyName);

      if (typeof storyName !== 'string') {
        throw new Error(`Invalid or missing storyName provided for a "${kind}" story.`);
      }
      if (m && m.hot && m.hot.dispose) {
        m.hot.dispose(() => {
          const { _storyStore } = this;
          _storyStore.remove(id);
        });
      }

      const fileName = m && m.id ? `${m.id}` : undefined;

      const allParam = [_globalParameters, localParameters, parameters].reduce(
        (acc: Parameters, p) => {
          if (p) {
            Object.entries(p).forEach(([key, value]) => {
              const existingValue = acc[key];

              if (Array.isArray(value)) {
                acc[key] = value;
              } else if (isPlainObject(value) && isPlainObject(existingValue)) {
                acc[key] = merge(existingValue, value);
              } else {
                acc[key] = value;
              }
            });
          }
          return acc;
        },
        { fileName }
      );
      const { properties: storyProperties } = (storyFn as any).story || {};
      const allProperties = {
        ..._globalProperties,
        ...localProperties,
        ...storyProperties,
        ...properties,
      };

      this._storyStore.addStory(
        {
          id,
          kind,
          name: storyName,
          storyFn,
          properties: allProperties,
          parameters: allParam,
        },
        {
          applyDecorators: applyHooks(this._decorateStory),
          getDecorators: () => [
            ...(allParam.decorators || []),
            ...localDecorators,
            ..._globalDecorators,
          ],
        }
      );
      return api;
    };

    api.addDecorator = (decorator: DecoratorFunction<StoryFnReturnType>) => {
      if (hasAdded) {
        logger.warn(`You have added a decorator to the kind '${kind}' after a story has already been added.
In Storybook 4 this applied the decorator only to subsequent stories. In Storybook 5+ it applies to all stories.
This is probably not what you intended. Read more here: https://github.com/storybookjs/storybook/blob/master/MIGRATION.md`);
      }

      localDecorators.push(decorator);
      return api;
    };

    api.addParameters = (parameters: Parameters) => {
      localParameters = { ...localParameters, ...parameters };
      return api;
    };
    api.addProperties = (properties: StoryProperties) => {
      localProperties = { ...localProperties, ...properties };
      return api;
    };

    return api;
  };

  // legacy
  getStorybook = () =>
    this._storyStore.getStoryKinds().map(kind => {
      const fileName = this._storyStore.getStoryFileName(kind);

      const stories = this._storyStore.getStories(kind).map(name => {
        const render = this._storyStore.getStoryWithContext(kind, name);
        return { name, render };
      });

      return { kind, fileName, stories };
    });

  raw = () => this._storyStore.raw();

  // FIXME: temporary expose the store for react-native
  // Longer term react-native should use the Provider/Consumer api
  store = () => this._storyStore;
}
