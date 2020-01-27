import { mockChannel } from '@storybook/addons';
import initStories from '../modules/stories';

function createMockStore() {
  let state = {};
  return {
    getState: jest.fn().mockImplementation(() => state),
    setState: jest.fn().mockImplementation(s => {
      state = { ...state, ...s };
    }),
  };
}

describe('properties API', () => {
  const parameters = {};
  const value = 'Tom Sawyer';
  const mewValue = 'Huckleberry Finn';
  const properties = {
    name: { type: 'text', value, defaultValue: value },
  };
  const storiesHash = {
    'a--1': { kind: 'a', name: '1', parameters, properties, id: 'a--1' },
  };
  const channel = mockChannel({ page: 'manager' });
  const provider = {
    channel,
  };
  describe('setProperties', () => {
    it('stores basic stories w/ properties', () => {
      const navigate = jest.fn();
      const store = createMockStore();
      const {
        api: { setStories },
      } = initStories({ store, navigate });

      setStories(storiesHash);

      const { storiesHash: storedStoriesHash } = store.getState();
      expect(storedStoriesHash).toMatchObject(storiesHash);
    });
    it('change stories properties with api', () => {
      const navigate = jest.fn();
      const store = createMockStore();

      const {
        api: { setStories, setPropertyValue },
      } = initStories({ provider, store, navigate });

      setStories(storiesHash);
      setPropertyValue('a--1', 'name', mewValue);
      const { storiesHash: storedStoriesHash } = store.getState();

      expect(storedStoriesHash).toMatchObject({
        ...storiesHash,
        'a--1': {
          ...storiesHash['a--1'],
          properties: {
            name: { type: 'text', value: mewValue, defaultValue: value },
          },
        },
      });
    });
    it('reset stories properties with api', () => {
      const navigate = jest.fn();
      const store = createMockStore();

      const {
        api: { setStories, setPropertyValue, resetPropertyValue },
      } = initStories({ provider, store, navigate });

      setStories(storiesHash);
      setPropertyValue('a--1', 'name', mewValue);
      resetPropertyValue('a--1', 'name');
      const { storiesHash: storedStoriesHash } = store.getState();

      expect(storedStoriesHash).toMatchObject(storiesHash);
    });
  });
});
