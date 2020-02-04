import Hello from '../components/hello/index.marko';

export default {
  title: 'Addons/Controls/Hello',
  parameters: {
    component: Hello,
    options: { panelPosition: 'right' },
  },
};

export const Simple = ({ name, age }) => ({
  input: {
    name,
    age,
  },
});

Simple.story = {
  controls: {
    name: { type: 'text', label: 'Name', value: 'John Doe' },
    age: { type: 'number', label: 'Age', value: 44 },
  },
};
