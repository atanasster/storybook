/* eslint no-underscore-dangle: 0 */
import EventEmitter from 'eventemitter3';
import memoize from 'memoizerific';
import debounce from 'lodash/debounce';
import dedent from 'ts-dedent';
import stable from 'stable';

import { Channel } from '@storybook/channels';
import Events from '@storybook/core-events';
import {
  ComponentControls,
  ComponentControlButton,
  loadControls,
  mergeControlValues,
  resetControlValues,
  getControlValues,
  LoadedComponentControls,
} from '@storybook/common';

import { logger } from '@storybook/client-logger';
import { Comparator, Parameters, StoryFn, StoryContext } from '@storybook/addons';

import {
  DecoratorFunction,
  LegacyData,
  LegacyItem,
  StoreData,
  AddStoryArgs,
  StoreItem,
  ErrorLike,
} from './types';
import { HooksContext } from './hooks';

import storySort from './storySort';

// TODO: these are copies from components/nav/lib
// refactor to DRY
const toKey = (input: string) =>
  input.replace(/[^a-z0-9]+([a-z0-9])/gi, (...params) => params[1].toUpperCase());

let count = 0;

const getId = (): number => {
  count += 1;
  return count;
};

const toExtracted = <T>(obj: T) =>
  Object.entries(obj).reduce((acc, [key, value]) => {
    if (typeof value === 'function') {
      return acc;
    }
    if (key === 'hooks') {
      return acc;
    }
    if (Array.isArray(value)) {
      return Object.assign(acc, { [key]: value.slice().sort() });
    }
    return Object.assign(acc, { [key]: value });
  }, {});

interface Selection {
  storyId: string;
  viewMode: string;
}

interface StoryOptions {
  includeDocsOnly?: boolean;
}

type KindOrder = Record<string, number>;

const isStoryDocsOnly = (parameters?: Parameters) => {
  return parameters && parameters.docsOnly;
};

const includeStory = (story: StoreItem, options: StoryOptions = { includeDocsOnly: false }) => {
  if (options.includeDocsOnly) {
    return true;
  }
  return !isStoryDocsOnly(story.parameters);
};

interface IdentificationType {
  id: string;
  kind: string;
  name: string;
  story: string;
}

const createStoreControls = (
  controls: ComponentControls,
  identification: IdentificationType,
  legacyContextProp: boolean
): LoadedComponentControls => {
  const reservedContextKeys = [
    'id',
    'kind',
    'name',
    'story',
    'storyFn',
    'controls',
    'parameters',
    'values',
    'hooks',
  ];

  // save default value for 'reset'
  Object.keys(controls).forEach(key => {
    if (legacyContextProp && reservedContextKeys.indexOf(key) >= 0) {
      logger.error(
        `Story "${identification.name}" in ${identification.kind} uses a reserved property id "${key}"`
      );
    }
  });
  return loadControls(controls);
};

export default class StoryStore extends EventEmitter {
  _error?: ErrorLike;

  _channel: Channel;

  _data: StoreData;

  _legacyData?: LegacyData;

  _legacydata: LegacyData;

  _revision: number;

  _selection: Selection;

  _kindOrder: KindOrder;

  constructor(params: { channel: Channel }) {
    super();

    this._legacydata = {} as any;
    this._data = {} as any;
    this._revision = 0;
    this._selection = {} as any;
    this.setChannel(params.channel);
    this._error = undefined;
    this._kindOrder = {};
  }

  setChannel = (channel: Channel) => {
    const onSetControlValue = ({
      id,
      propertyName,
      value,
    }: {
      id: string;
      propertyName: string | undefined;
      value: any;
    }) => {
      const story = this._data[id];
      if (story) {
        const controls = mergeControlValues(story.controls, propertyName, value);
        this._data[id] = {
          ...story,
          controls,
        };
        channel.emit(Events.FORCE_RE_RENDER);
      }
    };

    const onResetControlValue = ({ id, propertyName }: { id: string; propertyName?: string }) => {
      const story = this._data[id];
      if (story) {
        const controls = resetControlValues(story.controls, propertyName);
        this._data[id] = {
          ...story,
          controls,
        };
        channel.emit(Events.FORCE_RE_RENDER);
      }
    };

    const onClickControl = ({ id, propertyName }: { id: string; propertyName: string }) => {
      const story = this._data[id];
      if (story) {
        this.clickControl(id, propertyName);
        this._channel.emit(Events.FORCE_RE_RENDER);
      }
    };
    if (this._channel) {
      this._channel.off(Events.STORY_SET_CONTROL_VALUE, onSetControlValue);
      this._channel.off(Events.STORY_RESET_CONTROL_VALUE, onResetControlValue);
      this._channel.off(Events.STORY_CLICK_CONTROL, onClickControl);
    }
    this._channel = channel;
    if (this._channel) {
      this._channel.on(Events.STORY_SET_CONTROL_VALUE, onSetControlValue);
      this._channel.on(Events.STORY_RESET_CONTROL_VALUE, onResetControlValue);
      this._channel.on(Events.STORY_CLICK_CONTROL, onClickControl);
    }
  };

  // NEW apis
  fromId = (id: string): StoreItem | null => {
    try {
      const data = this._data[id as string];

      if (!data || !data.getDecorated) {
        return null;
      }

      return data;
    } catch (e) {
      logger.warn('failed to get story:', this._data);
      logger.error(e);
      return null;
    }
  };

  raw(options?: StoryOptions) {
    return Object.values(this._data)
      .filter(i => !!i.getDecorated)
      .filter(i => includeStory(i, options))
      .map(({ id }) => this.fromId(id));
  }

  extract(options?: StoryOptions) {
    const stories = Object.entries(this._data);
    // determine if we should apply a sort to the stories or use default import order
    if (Object.values(this._data).length > 0) {
      const index = Object.keys(this._data).find(
        key =>
          !!(this._data[key] && this._data[key].parameters && this._data[key].parameters.options)
      );
      if (index && this._data[index].parameters.options.storySort) {
        const storySortParameter = this._data[index].parameters.options.storySort;
        let sortFn: Comparator<any>;
        if (typeof storySortParameter === 'function') {
          sortFn = storySortParameter;
        } else {
          sortFn = storySort(storySortParameter);
        }
        stable.inplace(stories, sortFn);
      } else {
        // NOTE: when kinds are HMR'ed they get temporarily removed from the `_data` array
        // and thus lose order. However `_kindOrder` preservers the original load order
        stable.inplace(
          stories,
          (s1, s2) => this._kindOrder[s1[1].kind] - this._kindOrder[s2[1].kind]
        );
      }
    }
    // removes function values from all stories so they are safe to transport over the channel
    return stories.reduce(
      (a, [k, v]) => (includeStory(v, options) ? Object.assign(a, { [k]: toExtracted(v) }) : a),
      {}
    );
  }

  setSelection(data: Selection | undefined, error: ErrorLike): void {
    this._selection =
      data === undefined ? this._selection : { storyId: data.storyId, viewMode: data.viewMode };
    this._error = error === undefined ? this._error : error;

    // Try and emit the STORY_RENDER event synchronously, but if the channel is not ready (RN),
    // we'll try again later.
    let isStarted = false;
    if (this._channel) {
      this._channel.emit(Events.STORY_RENDER);
      isStarted = true;
    }

    setTimeout(() => {
      if (this._channel && !isStarted) {
        this._channel.emit(Events.STORY_RENDER);
      }

      // should be deprecated in future.
      this.emit(Events.STORY_RENDER);
    }, 1);
  }

  getSelection = (): Selection => this._selection;

  getError = (): ErrorLike | undefined => this._error;

  remove = (id: string): void => {
    const { _data } = this;
    const story = _data[id];
    delete _data[id];

    if (story) {
      story.hooks.clean();
      const { kind, name } = story;
      const kindData = this._legacydata[toKey(kind)];
      if (kindData) {
        delete kindData.stories[toKey(name)];
      }
    }
  };

  addStory(
    { id, kind, name, storyFn: original, parameters = {}, controls: storyProps = {} }: AddStoryArgs,
    {
      getDecorators,
      applyDecorators,
    }: {
      getDecorators: () => DecoratorFunction[];
      applyDecorators: (fn: StoryFn, decorators: DecoratorFunction[]) => any;
    }
  ) {
    const { _data } = this;

    if (_data[id]) {
      logger.warn(dedent`
        Story with id ${id} already exists in the store!

        Perhaps you added the same story twice, or you have a name collision?
        Story ids need to be unique -- ensure you aren't using the same names modulo url-sanitization.
      `);
    }

    const identification = {
      id,
      kind,
      name,
      story: name, // legacy
    };

    const { legacyContextProp, enhanceControls } = parameters.options || {};
    let controls: ComponentControls;
    if (typeof enhanceControls === 'function') {
      controls = { ...enhanceControls(id, parameters), ...storyProps };
    } else {
      controls = storyProps;
    }

    // immutable original storyFn
    const getOriginal = () => (context: StoryContext) => {
      const values = getControlValues(this._data[id].controls);
      return legacyContextProp ? original({ ...values, ...context }) : original(values, context);
    };

    // lazily decorate the story when it's loaded
    const getDecorated: () => StoryFn = memoize(1)(() =>
      applyDecorators(getOriginal(), getDecorators())
    );

    const hooks = new HooksContext();

    const storyFn: StoryFn = (p: any) => {
      return getDecorated()({
        ...identification,
        ...p,
        controls,
        hooks,
        parameters: { ...parameters, ...(p && p.parameters) },
      });
    };
    const props = createStoreControls(controls, identification, legacyContextProp);
    _data[id] = {
      ...identification,
      hooks,
      getDecorated,
      getOriginal,
      storyFn,
      controls: props,
      parameters,
    };

    // Don't store docs-only stories in legacy data because
    // existing clients (at the time?!), e.g. storyshots/chromatic
    // are not necessarily equipped to process them
    if (!isStoryDocsOnly(parameters)) {
      this.addLegacyStory({ kind, name, storyFn, parameters });
    }

    // Store 1-based order of kind loading to preserve sorting on HMR
    if (!this._kindOrder[kind]) {
      this._kindOrder[kind] = 1 + Object.keys(this._kindOrder).length;
    }

    // LET'S SEND IT TO THE MANAGER
    this.pushToManager();
  }

  getStoriesForManager = () => {
    return this.extract({ includeDocsOnly: true });
  };

  pushToManager = debounce(() => {
    if (this._channel) {
      const stories = this.getStoriesForManager();

      // send to the parent frame.
      this._channel.emit(Events.SET_STORIES, { stories });
    }
  }, 0);

  // Unlike a bunch of deprecated APIs below, these lookup functions
  // use the `_data` member, which is the new data structure. They should
  // be the preferred way of looking up stories in the future.

  getStoriesForKind(kind: string) {
    return this.raw().filter(story => story.kind === kind);
  }

  getRawStory(kind: string, name: string) {
    return this.getStoriesForKind(kind).find(s => s.name === name);
  }

  // OLD apis
  getRevision() {
    return this._revision;
  }

  incrementRevision() {
    this._revision += 1;
  }

  addLegacyStory({
    kind,
    name,
    storyFn,
    parameters,
  }: {
    kind: string;
    name: string;
    storyFn: StoryFn;
    parameters: Parameters;
  }) {
    const k = toKey(kind);
    if (!this._legacydata[k as string]) {
      this._legacydata[k as string] = {
        kind,
        fileName: parameters.fileName,
        index: getId(),
        stories: {},
      };
    }

    this._legacydata[k as string].stories[toKey(name)] = {
      name,
      // kind,
      index: getId(),
      story: storyFn,
      parameters,
    };
  }

  getStoryKinds() {
    return Object.values(this._legacydata)
      .filter((kind: LegacyItem) => Object.keys(kind.stories).length > 0)
      .sort((info1: LegacyItem, info2: LegacyItem) => info1.index - info2.index)
      .map((info: LegacyItem) => info.kind);
  }

  getStories(kind: string) {
    const key = toKey(kind);

    if (!this._legacydata[key as string]) {
      return [];
    }

    return Object.keys(this._legacydata[key as string].stories)
      .map(name => this._legacydata[key as string].stories[name])
      .sort((info1, info2) => info1.index - info2.index)
      .map(info => info.name);
  }

  getStoryFileName(kind: string) {
    const key = toKey(kind);
    const storiesKind = this._legacydata[key as string];
    if (!storiesKind) {
      return null;
    }

    return storiesKind.fileName;
  }

  getStoryAndParameters(kind: string, name: string) {
    if (!kind || !name) {
      return null;
    }

    const storiesKind = this._legacydata[toKey(kind) as string];
    if (!storiesKind) {
      return null;
    }

    const storyInfo = storiesKind.stories[toKey(name)];
    if (!storyInfo) {
      return null;
    }

    const { story, parameters } = storyInfo;
    return {
      story,
      parameters,
    };
  }

  getStory(kind: string, name: string) {
    const data = this.getStoryAndParameters(kind, name);
    return data && data.story;
  }

  getStoryWithContext(kind: string, name: string) {
    const data = this.getStoryAndParameters(kind, name);
    if (!data) {
      return null;
    }
    const { story } = data;
    return story;
  }

  removeStoryKind(kind: string) {
    if (this.hasStoryKind(kind)) {
      this._legacydata[toKey(kind)].stories = {};
      this.cleanHooksForKind(kind);
      this._data = Object.entries(this._data).reduce((acc, [id, story]) => {
        if (story.kind !== kind) {
          Object.assign(acc, { [id]: story });
        }
        return acc;
      }, {});
      this.pushToManager();
    }
  }

  hasStoryKind(kind: string) {
    return Boolean(this._legacydata[toKey(kind) as string]);
  }

  hasStory(kind: string, name: string) {
    return Boolean(this.getStory(kind, name));
  }

  dumpStoryBook() {
    const data = this.getStoryKinds().map(kind => ({
      kind,
      stories: this.getStories(kind),
    }));

    return data;
  }

  size() {
    return Object.keys(this._legacydata).length;
  }

  clean() {
    this.getStoryKinds().forEach(kind => delete this._legacydata[toKey(kind) as string]);
  }

  cleanHooks(id: string) {
    if (this._data[id]) {
      this._data[id].hooks.clean();
    }
  }

  cleanHooksForKind(kind: string) {
    this.getStoriesForKind(kind).map(story => this.cleanHooks(story.id));
  }

  setControlValue(id: string, propertyName: string, value: any) {
    if (this._data[id]) {
      const story = this._data[id];
      story.controls = mergeControlValues(story.controls, propertyName, value);
      this._channel.emit(Events.STORY_SET_CONTROL_VALUE, { id, propertyName, value });
      this._channel.emit(Events.FORCE_RE_RENDER);
    }
  }

  resetControlValue(id: string, propertyName?: string) {
    if (this._data[id]) {
      const story = this._data[id];
      this._channel.emit(Events.STORY_RESET_CONTROL_VALUE, { id, propertyName });
      story.controls = resetControlValues(story.controls, propertyName);
    }
  }

  clickControl(id: string, propName: string) {
    if (this._data[id]) {
      if (this._data[id].controls && this._data[id].controls[propName]) {
        const prop = this._data[id].controls[propName];
        if (typeof (prop as ComponentControlButton).onClick === 'function') {
          (prop as ComponentControlButton).onClick(
            this._data[id].controls[propName] as ComponentControlButton
          );
        }
      }
    }
  }

  addControls(id: string, controls: ComponentControls) {
    if (this._data[id]) {
      const story = this._data[id];
      this._data[id].controls = {
        ...this._data[id].controls,
        ...createStoreControls(
          controls,
          story,
          this._data[id].parameters.options.legacyContextProp
        ),
      };
    }
  }

  setControls(id: string, controls: ComponentControls) {
    if (this._data[id]) {
      const story = this._data[id];
      story.controls = {
        ...createStoreControls(controls, story, story.parameters.options.legacyContextProp),
      };
      story.smartControls = true;
      this._channel.emit(Events.FORCE_RE_RENDER);
    }
  }
}
