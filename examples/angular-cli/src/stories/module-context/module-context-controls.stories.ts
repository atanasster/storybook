import { storiesOf, moduleMetadata } from '@storybook/angular';
import { action } from '@storybook/addon-actions';
import { ControlTypes } from '@storybook/common';
import { ChipsModule } from './chips.module';
import { ChipsGroupComponent } from './chips-group.component';
import { ChipComponent } from './chip.component';
import { CHIP_COLOR } from './chip-color.token';

storiesOf('Custom/Feature Module as Context with controls', module)
  .addDecorator(
    moduleMetadata({
      imports: [ChipsModule],
    })
  )
  .addControls({
    chips: {
      type: ControlTypes.OBJECT,
      label: 'Chips',
      value: [
        {
          id: 1,
          text: 'Chip 1',
        },
        {
          id: 2,
          text: 'Chip 2',
        },
      ],
    },
    removeChipClick: { type: ControlTypes.BUTTON, value: action('Remove chip') },
    removeAllChipsClick: { type: ControlTypes.BUTTON, value: action('Remove all') },
  })
  .add(
    'Component with self and dependencies declared in its feature module',
    ({ chips, removeChipClick, removeAllChipsClick }) => {
      const props: { [K in keyof ChipsGroupComponent]?: any } = {
        chips,
        removeChipClick,
        removeAllChipsClick,
      };
      return {
        component: ChipsGroupComponent,
        props,
      };
    },
    {
      notes: `This component includes a child component, a pipe, and a default provider, all which come from 
        the specified feature module.`,
    }
  );
storiesOf('Custom/Feature Module as Context with controls', module)
  .addDecorator(
    moduleMetadata({
      imports: [ChipsModule],
    })
  )
  .addControls({
    displayText: { type: ControlTypes.TEXT, label: 'Display Text', value: 'My Chip' },
    removeClicked: { type: ControlTypes.BUTTON, value: action('Remove icon clicked') },
  })
  .add('Component with default providers', ({ displayText, removeClicked }) => {
    const props: { [K in keyof ChipComponent]?: any } = {
      displayText,
      removeClicked,
    };
    return {
      component: ChipComponent,
      props,
    };
  })
  .add('Component with overridden provider', ({ displayText, removeClicked }) => {
    const props: { [K in keyof ChipComponent]?: any } = {
      displayText,
      removeClicked,
    };
    return {
      component: ChipComponent,
      moduleMetadata: {
        providers: [
          {
            provide: CHIP_COLOR,
            useValue: 'yellow',
          },
        ],
      },
      props,
    };
  });
