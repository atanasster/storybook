import { StoryProperty, PropertyTypes } from '@storybook/core-events';
import { PropertyEditor } from './types';
import { TextEditor } from './TextEditor';
import { NumberEditor } from './NumberEditor';

import { BooleanEditor } from './BooleanEditor';
import { OptionsEditor } from './OptionsEditor';

import { DateEditor } from './DateEditor';
import { ColorEditor } from './ColorEditor';
import { ButtonEditor } from './ButtonEditor';

import { ObjectEditor } from './ObjectEditor';
import { ArrayEditor } from './ArrayEditor';
import { FilesEditor } from './FilesEditor';

const PropertyEditors: {
  [name in PropertyTypes]: PropertyEditor;
} = {
  [PropertyTypes.TEXT]: TextEditor,
  [PropertyTypes.NUMBER]: NumberEditor,
  [PropertyTypes.BOOLEAN]: BooleanEditor,
  [PropertyTypes.OPTIONS]: OptionsEditor,
  [PropertyTypes.DATE]: DateEditor,
  [PropertyTypes.COLOR]: ColorEditor,
  [PropertyTypes.BUTTON]: ButtonEditor,
  [PropertyTypes.OBJECT]: ObjectEditor,
  [PropertyTypes.ARRAY]: ArrayEditor,
  [PropertyTypes.FILES]: FilesEditor,
};

export const getPropertyEditor = (type: PropertyTypes): PropertyEditor => PropertyEditors[type];
