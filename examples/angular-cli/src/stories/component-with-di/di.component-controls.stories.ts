import { DiComponent } from './di.component';

export default {
  title: 'Custom/Dependencies/Controls',
};

export const InputsAndInjectDependencies = () => ({
  component: DiComponent,
  props: {
    title: 'Component dependencies',
  },
});

InputsAndInjectDependencies.story = {
  name: 'inputs and inject dependencies',
};

export const InputsAndInjectDependenciesWithControls = ({ title }) => ({
  component: DiComponent,
  props: {
    title,
  },
});

InputsAndInjectDependenciesWithControls.story = {
  name: 'inputs and inject dependencies with controls',
  controls: {
    title: { type: 'text', value: 'Component dependencies' },
  },
};
