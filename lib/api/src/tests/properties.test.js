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

describe('controls API', () => {
  const parameters = {};
  const value = 'Tom Sawyer';
  const mewValue = 'Huckleberry Finn';
  const controls = {
    name: { type: 'text', value, defaultValue: value },
  };
  const storiesHash = {
    'a--1': { kind: 'a', name: '1', parameters, controls, id: 'a--1' },
  };
  const channel = mockChannel({ page: 'manager' });
  const provider = {
    channel,
  };
  describe('setControls', () => {
    it('stores basic stories w/ controls', () => {
      const navigate = jest.fn();
      const store = createMockStore();
      const {
        api: { setStories },
      } = initStories({ store, navigate });

      setStories(storiesHash);

      const { storiesHash: storedStoriesHash } = store.getState();
      expect(storedStoriesHash).toMatchObject(storiesHash);
    });
    it('change stories controls with api', () => {
      const navigate = jest.fn();
      const store = createMockStore();

      const {
        api: { setStories, setControlValue },
      } = initStories({ provider, store, navigate });

      setStories(storiesHash);
      setControlValue('a--1', 'name', mewValue);
      const { storiesHash: storedStoriesHash } = store.getState();

      expect(storedStoriesHash).toMatchObject({
        ...storiesHash,
        'a--1': {
          ...storiesHash['a--1'],
          controls: {
            name: { type: 'text', value: mewValue, defaultValue: value },
          },
        },
      });
    });
    it('reset stories controls with api', () => {
      const navigate = jest.fn();
      const store = createMockStore();

      const {
        api: { setStories, setControlValue, resetControlValue },
      } = initStories({ provider, store, navigate });

      setStories(storiesHash);
      setControlValue('a--1', 'name', mewValue);
      resetControlValue('a--1', 'name');
      const { storiesHash: storedStoriesHash } = store.getState();

      expect(storedStoriesHash).toMatchObject(storiesHash);
    });
  });
});
