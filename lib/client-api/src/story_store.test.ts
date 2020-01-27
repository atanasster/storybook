import createChannel from '@storybook/channel-postmessage';
import { logger } from '@storybook/client-logger';
import { toId } from '@storybook/csf';
import addons from '@storybook/addons';
import Events from '@storybook/core-events';

import StoryStore from './story_store';
import { defaultDecorateStory } from './client_api';

jest.mock('@storybook/client-logger', () => ({
  logger: { warn: jest.fn(), log: jest.fn(), error: jest.fn() },
}));

const channel = createChannel({ page: 'preview' });

const make = (kind, name, storyFn, parameters = {}, properties = {}) => [
  {
    kind,
    name,
    storyFn,
    parameters,
    properties,
    id: toId(kind, name),
  },
  {
    applyDecorators: defaultDecorateStory,
    getDecorators: () => [],
  },
];

describe('preview.story_store', () => {
  describe('raw storage', () => {
    it('stores hash object', () => {
      const store = new StoryStore({ channel });
      store.addStory(...make('a', '1', () => 0), undefined);
      store.addStory(...make('a', '2', () => 0));
      store.addStory(...make('b', '1', () => 0));

      const extracted = store.extract();

      // We need exact key ordering, even if in theory JS doesn't guarantee it
      expect(Object.keys(extracted)).toEqual(['a--1', 'a--2', 'b--1']);

      // content of item should be correct
      expect(extracted['a--1']).toMatchObject({
        id: 'a--1',
        kind: 'a',
        name: '1',
        parameters: expect.any(Object),
      });
    });
  });

  describe('storySort', () => {
    it('sorts stories using given function', () => {
      const parameters = {
        options: {
          // Test function does reverse alphabetical ordering.
          storySort: (a: any, b: any): number =>
            a[1].kind === b[1].kind
              ? 0
              : -1 * a[1].id.localeCompare(b[1].id, undefined, { numeric: true }),
        },
      };
      const store = new StoryStore({ channel });
      store.addStory(...make('a/a', '1', () => 0, parameters));
      store.addStory(...make('a/a', '2', () => 0, parameters));
      store.addStory(...make('a/b', '1', () => 0, parameters));
      store.addStory(...make('b/b1', '1', () => 0, parameters));
      store.addStory(...make('b/b10', '1', () => 0, parameters));
      store.addStory(...make('b/b9', '1', () => 0, parameters));
      store.addStory(...make('c', '1', () => 0, parameters));

      const extracted = store.extract();

      expect(Object.keys(extracted)).toEqual([
        'c--1',
        'b-b10--1',
        'b-b9--1',
        'b-b1--1',
        'a-b--1',
        'a-a--1',
        'a-a--2',
      ]);
    });

    it('sorts stories alphabetically', () => {
      const parameters = {
        options: {
          storySort: {
            method: 'alphabetical',
          },
        },
      };
      const store = new StoryStore({ channel });
      store.addStory(...make('a/b', '1', () => 0, parameters));
      store.addStory(...make('a/a', '2', () => 0, parameters));
      store.addStory(...make('a/a', '1', () => 0, parameters));
      store.addStory(...make('c', '1', () => 0, parameters));
      store.addStory(...make('b/b10', '1', () => 0, parameters));
      store.addStory(...make('b/b9', '1', () => 0, parameters));
      store.addStory(...make('b/b1', '1', () => 0, parameters));

      const extracted = store.extract();

      expect(Object.keys(extracted)).toEqual([
        'a-a--2',
        'a-a--1',
        'a-b--1',
        'b-b1--1',
        'b-b9--1',
        'b-b10--1',
        'c--1',
      ]);
    });

    it('sorts stories in specified order or alphabetically', () => {
      const parameters = {
        options: {
          storySort: {
            method: 'alphabetical',
            order: ['b', ['bc', 'ba', 'bb'], 'a', 'c'],
          },
        },
      };
      const store = new StoryStore({ channel });
      store.addStory(...make('a/b', '1', () => 0, parameters));
      store.addStory(...make('a', '1', () => 0, parameters));
      store.addStory(...make('c', '1', () => 0, parameters));
      store.addStory(...make('b/bd', '1', () => 0, parameters));
      store.addStory(...make('b/bb', '1', () => 0, parameters));
      store.addStory(...make('b/ba', '1', () => 0, parameters));
      store.addStory(...make('b/bc', '1', () => 0, parameters));
      store.addStory(...make('b', '1', () => 0, parameters));

      const extracted = store.extract();

      expect(Object.keys(extracted)).toEqual([
        'b--1',
        'b-bc--1',
        'b-ba--1',
        'b-bb--1',
        'b-bd--1',
        'a--1',
        'a-b--1',
        'c--1',
      ]);
    });

    it('sorts stories in specified order or by configure order', () => {
      const parameters = {
        options: {
          storySort: {
            method: 'configure',
            order: ['b', 'a', 'c'],
          },
        },
      };
      const store = new StoryStore({ channel });
      store.addStory(...make('a/b', '1', () => 0, parameters));
      store.addStory(...make('a', '1', () => 0, parameters));
      store.addStory(...make('c', '1', () => 0, parameters));
      store.addStory(...make('b/bd', '1', () => 0, parameters));
      store.addStory(...make('b/bb', '1', () => 0, parameters));
      store.addStory(...make('b/ba', '1', () => 0, parameters));
      store.addStory(...make('b/bc', '1', () => 0, parameters));
      store.addStory(...make('b', '1', () => 0, parameters));

      const extracted = store.extract();

      expect(Object.keys(extracted)).toEqual([
        'b--1',
        'b-bd--1',
        'b-bb--1',
        'b-ba--1',
        'b-bc--1',
        'a--1',
        'a-b--1',
        'c--1',
      ]);
    });
  });

  describe('emitting behaviour', () => {
    it('is syncronously emits STORY_RENDER if the channel is defined', async () => {
      const onChannelRender = jest.fn();
      const testChannel = createChannel({ page: 'preview' });
      testChannel.on(Events.STORY_RENDER, onChannelRender);

      const onStoreRender = jest.fn();
      const store = new StoryStore({ channel: testChannel });
      store.on(Events.STORY_RENDER, onStoreRender);

      store.setSelection({ storyId: 'storyId', viewMode: 'viewMode' }, undefined);
      expect(onChannelRender).toHaveBeenCalled();
      expect(onStoreRender).not.toHaveBeenCalled();

      onChannelRender.mockClear();
      await new Promise(r => setTimeout(r, 10));
      expect(onChannelRender).not.toHaveBeenCalled();
      expect(onStoreRender).toHaveBeenCalled();
    });

    it('is asychronously emits STORY_RENDER if the channel is not yet defined', async () => {
      const onChannelRender = jest.fn();
      const testChannel = createChannel({ page: 'preview' });
      testChannel.on(Events.STORY_RENDER, onChannelRender);

      const onStoreRender = jest.fn();
      const store = new StoryStore({ channel: undefined });
      store.on(Events.STORY_RENDER, onStoreRender);

      store.setSelection({ storyId: 'storyId', viewMode: 'viewMode' }, undefined);
      expect(onChannelRender).not.toHaveBeenCalled();
      expect(onStoreRender).not.toHaveBeenCalled();

      store.setChannel(testChannel);
      await new Promise(r => setTimeout(r, 10));
      expect(onChannelRender).toHaveBeenCalled();
      expect(onStoreRender).toHaveBeenCalled();
    });
  });

  describe('dumpStoryBook/getStoriesForManager', () => {
    it('should return nothing when empty', () => {
      const store = new StoryStore({ channel });
      expect(store.dumpStoryBook()).toEqual([]);
      expect(Object.keys(store.getStoriesForManager())).toEqual([]);
    });

    it('should return storybook with stories', () => {
      const store = new StoryStore({ channel });

      store.addStory(...make('kind-1', 'story-1.1', () => 0));
      store.addStory(...make('kind-1', 'story-1.2', () => 0));
      store.addStory(...make('kind-2', 'story-2.1', () => 0));
      store.addStory(...make('kind-2', 'story-2.2', () => 0));

      expect(store.dumpStoryBook()).toEqual([
        {
          kind: 'kind-1',
          stories: ['story-1.1', 'story-1.2'],
        },
        {
          kind: 'kind-2',
          stories: ['story-2.1', 'story-2.2'],
        },
      ]);

      expect(Object.keys(store.getStoriesForManager())).toEqual([
        'kind-1--story-1-1',
        'kind-1--story-1-2',
        'kind-2--story-2-1',
        'kind-2--story-2-2',
      ]);
    });
  });

  describe('getStoryFileName', () => {
    it('should return the filename of the first story passed for the kind', () => {
      const store = new StoryStore({ channel });
      store.addStory(...make('kind-1', 'story-1.1', () => 0, { fileName: 'foo.js' }));
      store.addStory(...make('kind-1', 'story-1.2', () => 0, { fileName: 'foo-2.js' }));
      store.addStory(...make('kind-2', 'story-2.1', () => 0, { fileName: 'bar.js' }));

      expect(store.getStoryFileName('kind-1')).toBe('foo.js');
      expect(store.getStoryFileName('kind-2')).toBe('bar.js');
    });
  });

  describe('removeStoryKind', () => {
    it('should not error even if there is no kind', () => {
      const store = new StoryStore({ channel });
      store.removeStoryKind('kind');
    });
    it('should remove the kind in both modern and legacy APIs', () => {
      const store = new StoryStore({ channel });
      addons.setChannel(channel);
      store.addStory(...make('kind-1', 'story-1.1', () => 0));
      store.addStory(...make('kind-1', 'story-1.2', () => 0));
      store.addStory(...make('kind-2', 'story-2.1', () => 0));
      store.addStory(...make('kind-2', 'story-2.2', () => 0));

      store.removeStoryKind('kind-1');

      // _legacydata
      expect(store.hasStory('kind-1', 'story-1.1')).toBeFalsy();
      expect(store.hasStory('kind-2', 'story-2.1')).toBeTruthy();

      // _data
      expect(store.fromId(toId('kind-1', 'story-1.1'))).toBeFalsy();
      expect(store.fromId(toId('kind-2', 'story-2.1'))).toBeTruthy();
    });
  });

  describe('remove', () => {
    it('should remove the kind in both modern and legacy APIs', () => {
      const store = new StoryStore({ channel });
      addons.setChannel(channel);
      store.addStory(...make('kind-1', 'story-1.1', () => 0));
      store.addStory(...make('kind-1', 'story-1.2', () => 0));

      store.remove(toId('kind-1', 'story-1.1'));

      // _legacydata
      expect(store.hasStory('kind-1', 'story-1.1')).toBeFalsy();
      expect(store.hasStory('kind-1', 'story-1.2')).toBeTruthy();

      // _data
      expect(store.fromId(toId('kind-1', 'story-1.1'))).toBeFalsy();
      expect(store.fromId(toId('kind-1', 'story-1.2'))).toBeTruthy();
    });
  });

  describe('getStoryAndParameters', () => {
    it('should return parameters that we passed in', () => {
      const store = new StoryStore({ channel });
      const story = jest.fn();
      const parameters = {
        fileName: 'foo.js',
        parameter: 'value',
      };
      store.addStory(...make('kind', 'name', story, parameters));

      expect(store.getStoryAndParameters('kind', 'name').parameters).toEqual(parameters);
    });
  });

  describe('getStoryWithContext', () => {
    it('should return a function that calls the story with the context', () => {
      const store = new StoryStore({ channel });
      const storyFn = jest.fn();
      const parameters = {
        fileName: 'foo.js',
        parameter: 'value',
      };
      store.addStory(...make('kind', 'name', storyFn, parameters));

      const storyWithContext = store.getStoryWithContext('kind', 'name');
      storyWithContext();
      const { hooks } = store.fromId(toId('kind', 'name'));
      expect(storyFn).toHaveBeenCalledWith(
        {},
        {
          id: 'kind--name',
          name: 'name',
          kind: 'kind',
          story: 'name',
          properties: {},
          parameters,
          hooks,
        }
      );
    });
  });

  describe('story sorting', () => {
    const storySort = (a, b) => a[1].id.localeCompare(b[1].id);
    it('should use the sorting function of the story parameter object', () => {
      const store = new StoryStore({ channel });
      store.addStory(
        ...make('kind-2', 'a-story-2.1', () => 0, { fileName: 'bar.js', options: { storySort } })
      );
      store.addStory(
        ...make('kind-1', 'z-story-1.1', () => 0, { fileName: 'foo.js', options: { storySort } })
      );
      store.addStory(
        ...make('kind-1', 'story-1.2', () => 0, { fileName: 'foo-2.js', options: { storySort } })
      );
      store.addStory(
        ...make('kind-2', 'story-2.1', () => 0, { fileName: 'bar.js', options: { storySort } })
      );

      const stories = Object.values(store.extract()) as any[];
      expect(stories[0].id).toBe('kind-1--story-1-2');
      expect(stories[1].id).toBe('kind-1--z-story-1-1');
      expect(stories[2].id).toBe('kind-2--a-story-2-1');
      expect(stories[3].id).toBe('kind-2--story-2-1');
    });
  });
  describe('story properties', () => {
    it('should return a function that is called with the propety values and context', () => {
      const store = new StoryStore({ channel });
      const storyFn = jest.fn();
      const name = 'Tom Sawyer';
      const parameters = {};
      const properties = {
        firstName: { type: 'text', value: name },
      };
      store.addStory(...make('kind', 'name', storyFn, parameters, properties));
      const storyWithContext = store.getStoryWithContext('kind', 'name');
      storyWithContext();
      const { hooks } = store.fromId(toId('kind', 'name'));
      expect(storyFn).toHaveBeenCalledWith(
        { firstName: name },
        {
          id: 'kind--name',
          name: 'name',
          kind: 'kind',
          story: 'name',
          properties,
          parameters,
          hooks,
        }
      );
    });

    it('should modify property value on channel message', () => {
      const store = new StoryStore({ channel });
      const storyFn = jest.fn();
      const parameters = {};
      const properties = {
        name: { type: 'text', value: 'Tom Sawyer' },
      };
      store.addStory(...make('kind', 'name', storyFn, parameters, properties));

      channel.emit(Events.STORY_SET_PROPERTY_VALUE, {
        id: toId('kind', 'name'),
        propertyName: 'name',
        value: 'Huckleberry Finn',
      });
      const storyWithContext = store.getStoryWithContext('kind', 'name');
      storyWithContext();
      const { hooks } = store.fromId(toId('kind', 'name'));
      expect(logger.error).not.toHaveBeenCalled();
      expect(storyFn).toHaveBeenCalledWith(
        { name: 'Huckleberry Finn' },
        {
          id: 'kind--name',
          name: 'name',
          kind: 'kind',
          story: 'name',
          properties,
          parameters,
          hooks,
        }
      );
    });
  });
  it('should modify properties on channel message with empty propertyName parameter', () => {
    const store = new StoryStore({ channel });
    const storyFn = jest.fn();
    const parameters = {};
    const properties = {
      firstName: { type: 'text', value: 'Tom' },
      lastName: { type: 'text', value: 'Sawyer' },
    };
    store.addStory(...make('kind', 'name', storyFn, parameters, properties));
    const newProps = { firstName: 'Huckleberry', lastName: 'Finn' };
    channel.emit(Events.STORY_SET_PROPERTY_VALUE, {
      id: toId('kind', 'name'),
      value: newProps,
    });
    const storyWithContext = store.getStoryWithContext('kind', 'name');
    storyWithContext();
    const { hooks } = store.fromId(toId('kind', 'name'));
    expect(storyFn).toHaveBeenCalledWith(newProps, {
      id: 'kind--name',
      name: 'name',
      kind: 'kind',
      story: 'name',
      properties,
      parameters,
      hooks,
    });
  });
  it('should modify properties on channel and then reset to default values', () => {
    const store = new StoryStore({ channel });
    const storyFn = jest.fn();
    const parameters = {};
    const properties = {
      firstName: { type: 'text', value: 'Tom' },
      lastName: { type: 'text', value: 'Sawyer' },
    };
    store.addStory(...make('kind', 'name', storyFn, parameters, properties));
    const newProps = { firstName: 'Huckleberry', lastName: 'Finn' };
    channel.emit(Events.STORY_SET_PROPERTY_VALUE, {
      id: toId('kind', 'name'),
      value: newProps,
    });
    channel.emit(Events.STORY_RESET_PROPERTY_VALUE, {
      id: toId('kind', 'name'),
    });

    const storyWithContext = store.getStoryWithContext('kind', 'name');
    storyWithContext();
    const { hooks } = store.fromId(toId('kind', 'name'));
    expect(storyFn).toHaveBeenCalledWith(
      { firstName: 'Tom', lastName: 'Sawyer' },
      {
        id: 'kind--name',
        name: 'name',
        kind: 'kind',
        story: 'name',
        properties,
        parameters,
        hooks,
      }
    );
  });
  it('should onClick event', () => {
    const store = new StoryStore({ channel });
    const storyFn = jest.fn();
    const parameters = {};
    const onClick = jest.fn();
    const property = { type: 'button', onClick };
    const properties = {
      button: property,
    };
    store.addStory(...make('kind', 'name', storyFn, parameters, properties));
    channel.emit(Events.STORY_CLICK_PROPERTY, {
      id: toId('kind', 'name'),
      propertyName: 'button',
      property,
    });
    const storyWithContext = store.getStoryWithContext('kind', 'name');
    storyWithContext();
    expect(onClick).toHaveBeenCalledWith(property);
  });
});
