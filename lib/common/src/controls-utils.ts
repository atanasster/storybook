import escape from 'escape-html';

import { StoryControl, ControlTypes } from '.';

export type ContextStoryControl = StoryControl & { defaultValue: any };
export interface ContextStoryControls {
  [name: string]: ContextStoryControl;
}

export const mergeControlValues = (
  controls: ContextStoryControls,
  controlName: string | undefined,
  value: any
): ContextStoryControls => {
  return controlName
    ? {
        ...controls,
        [controlName]: { ...controls[controlName], value },
      }
    : Object.keys(controls).reduce(
        (acc, key) => ({
          ...acc,
          [key]: {
            ...controls[key],
            value: value[key] === undefined ? controls[key].value : value[key],
          },
        }),
        {}
      );
};

export const resetControlValues = (controls: ContextStoryControls, controlName?: string) => {
  return controlName
    ? {
        ...controls,
        [controlName]: {
          ...controls[controlName],
          value: controls[controlName].defaultValue,
        },
      }
    : Object.keys(controls).reduce(
        (acc, key) => ({
          ...acc,
          [key]: { ...controls[key], value: controls[key].defaultValue },
        }),
        {}
      );
};

export const getControlValues = (controls: ContextStoryControls): { [name: string]: any } =>
  Object.keys(controls).reduce((acc, key) => {
    const control: StoryControl = controls[key];
    let { value } = control;
    if (control.type === ControlTypes.TEXT && control.escapeValue) {
      if (typeof value === 'string') {
        value = escape(value);
      }
    } else if (control.type === ControlTypes.OBJECT && typeof value === 'object') {
      return { ...acc, [key]: getControlValues(value as ContextStoryControls) };
    }
    return { ...acc, [key]: value };
  }, {});
