import { ContextStoryControls, ControlTypes, StoryControlOptions } from '@storybook/common';
import faker from 'faker';

const arrayElements = (arr: any[], c?: number) => {
  const array = arr || ['a', 'b', 'c'];
  let count = 0;
  if (typeof c !== 'number') {
    count = faker.random.number({ min: 1, max: array.length });
  } else if (c > array.length) {
    count = array.length;
  } else if (c < 0) {
    count = 0;
  }

  const arrayCopy = array.slice();
  const countToRemove = arrayCopy.length - count;
  for (let i = 0; i < countToRemove; i += 1) {
    const indexToRemove = faker.random.number({ max: arrayCopy.length - 1 });
    arrayCopy.splice(indexToRemove, 1);
  }

  return arrayCopy;
};
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
            value: faker.random.number({
              min: (control.value as number) / 2,
              max: (control.value as number) * 2,
            }),
          };
        case ControlTypes.OPTIONS: {
          const optionsControl = control as StoryControlOptions;
          let value;
          if (Array.isArray(optionsControl.options)) {
            if (
              optionsControl.display === 'multi-select' ||
              optionsControl.display === 'check' ||
              optionsControl.display === 'inline-check'
            ) {
              value = arrayElements(optionsControl.options);
            } else {
              value = faker.random.arrayElement(optionsControl.options);
            }
          } else if (typeof optionsControl.options === 'object') {
            if (
              optionsControl.display === 'multi-select' ||
              optionsControl.display === 'check' ||
              optionsControl.display === 'inline-check'
            ) {
              value = arrayElements(Object.values(optionsControl.options));
            } else {
              value = faker.random.objectElement(optionsControl.options);
            }
          } else {
            return null;
          }
          return {
            name,
            value,
          };
        }
        default:
          return null;
      }
    })
    .reduce((acc, f) => (f ? { ...acc, [f.name]: f.value } : acc), {});
};
