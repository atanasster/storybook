import { ButtonComponent } from './doc-button.component';

export default {
  title: 'DocButton',
  component: ButtonComponent,
  parameters: { docs: { iframeHeight: 120 } },
};

export const Basic = props => ({
  component: ButtonComponent,
  props,
});
