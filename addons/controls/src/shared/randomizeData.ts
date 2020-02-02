import { ContextStoryControls, ControlTypes } from '@storybook/common';
import faker from 'faker';

export const randomizeData = (constrols: ContextStoryControls) => {
  return Object.keys(constrols)
    .map(name => {
      const control = constrols[name];
      const { type } = control;

      switch (type) {
        case ControlTypes.TEXT:
          return {
            name,
            value: faker.name.findName(),
          };

        case ControlTypes.COLOR:
          return {
            name,
            value: faker.internet.color(),
          };
        case ControlTypes.BOOLEAN:
          return {
            name,
            value: faker.random.boolean(),
          };
        case ControlTypes.NUMBER:
          return {
            name,
            value: Math.floor(Math.random() * (control.value as number) || 10),
          };

        default:
          return null;
      }
    })
    .reduce((acc, f) => (f ? { ...acc, [f.name]: f.value } : acc), {});
};
