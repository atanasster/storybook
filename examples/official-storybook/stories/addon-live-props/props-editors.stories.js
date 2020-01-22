export default {
  title: 'Addons/Live Props/examples',
};

export const textProp = ({ text }) => text;

textProp.story = {
  properties: {
    text: { type: 'text', label: 'Text', defaultValue: 'Hello' },
  },
};
