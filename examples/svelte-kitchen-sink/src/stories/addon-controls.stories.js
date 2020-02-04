import ActionKnobView from './views/ActionKnobView.svelte';

export default {
  title: 'Addon/Controls',
};

export const Simple = ({ backgroundColor, width, height }) => {
  return {
    Component: ActionKnobView,
    props: {
      backgroundColor,
      width,
      height,
    },
  };
};

Simple.story = {
  controls: {
    backgroundColor: { type: 'color', label: 'Background', value: 'green' },
    width: { type: 'number', value: 200, range: true, min: 100, max: 1000, step: 100 },

    height: {
      type: 'number',
      label: 'Height',
      value: 200,
      range: true,
      min: 100,
      max: 1000,
      step: 100,
    },
  },
};
