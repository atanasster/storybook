import { ADDON_STATE_CHANGED, ADDON_STATE_SET } from '@storybook/core-events';
import addons, {
  HooksContext,
  applyHooks,
  useMemo,
  useCallback,
  useRef,
  useState,
  useReducer,
  useEffect,
  useChannel,
  useStoryContext,
  useParameter,
} from '@storybook/addons';

export {
  HooksContext,
  applyHooks,
  useMemo,
  useCallback,
  useRef,
  useState,
  useReducer,
  useEffect,
  useChannel,
  useStoryContext,
  useParameter,
};

export function useAddonState<S>(addonId: string, defaultValue: S): [S, (s: S) => void] {
  const [state, setState] = useState<S>(defaultValue);
  const updateState = (newState: S) => {
    if (newState !== state) {
      setState(newState);
    }
  };
  console.log('@storybook/client-api ', addonId);
  const emit = useChannel(
    {
      [`${ADDON_STATE_CHANGED}-${addonId}`]: s => {
        console.log('@storybook/client-api - changed ', s);
        updateState(s);
      },
      [`${ADDON_STATE_SET}-${addonId}`]: s => {
        console.log('@storybook/client-api - set ', s);
        updateState(s);
      },
    },
    [addonId]
  );
  useEffect(() => {
    // init
    emit(`${ADDON_STATE_SET}-${addonId}`, state);
  }, [state]);

  return [
    state,
    s => {
      emit(`${ADDON_STATE_CHANGED}-${addonId}`, s);
    },
  ];
}
