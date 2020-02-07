import escape from 'escape-html';

import { ComponentControl, ControlTypes } from '.';

export type LoadedComponentControl = ComponentControl & { defaultValue: any };
export interface LoadedComponentControls {
  [name: string]: LoadedComponentControl;
}

const mergeValue = (control: ComponentControl, value: any): any => {
  if (control && control.type === ControlTypes.OBJECT) {
    return {
      ...control,
      value: mergeControlValues(control.value as LoadedComponentControls, null, value),
    };
  }
  return { ...control, value };
};

export const mergeControlValues = (
  controls: LoadedComponentControls,
  controlName: string | undefined,
  value: any
): LoadedComponentControls => {
  return controlName
    ? {
        ...controls,
        [controlName]: mergeValue(controls[controlName], value),
      }
    : Object.keys(controls).reduce(
        (acc, key) => ({
          ...acc,
          [key]: mergeValue(
            controls[key],
            value[key] === undefined ? controls[key].value : value[key]
          ),
        }),
        {}
      );
};

export const resetControlValues = (controls: LoadedComponentControls, controlName?: string) => {
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

export const getControlValues = (controls: LoadedComponentControls): { [name: string]: any } =>
  Object.keys(controls).reduce((acc, key) => {
    const control: ComponentControl = controls[key];
    let { value } = control;
    if (control.type === ControlTypes.TEXT && control.escapeValue) {
      if (typeof value === 'string') {
        value = escape(value);
      }
    } else if (control.type === ControlTypes.OBJECT && typeof value === 'object') {
      return { ...acc, [key]: getControlValues(value as LoadedComponentControls) };
    }
    return { ...acc, [key]: value };
  }, {});
