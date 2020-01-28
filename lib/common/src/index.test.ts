import { PropertyTypes } from './properties';
import { mergePropertyValues, resetPropertyValues, ContextStoryProperties } from './index';

describe('Property utils', () => {
  const properties: ContextStoryProperties = {
    name: { type: PropertyTypes.TEXT, value: 'hello', defaultValue: 'hello' },
    age: { type: PropertyTypes.NUMBER, value: 19, defaultValue: 19 },
  };
  const modifiedProperties: ContextStoryProperties = {
    name: { type: PropertyTypes.TEXT, value: 'today', defaultValue: 'hello' },
    age: { type: PropertyTypes.NUMBER, value: 19, defaultValue: 19 },
  };

  it('Should merge property value', () => {
    expect(mergePropertyValues(properties, 'name', 'today')).toMatchObject(modifiedProperties);
  });
  it('Should merge property object', () => {
    expect(mergePropertyValues(properties, undefined, modifiedProperties)).toMatchObject(
      modifiedProperties
    );
  });

  it('Should reset property value', () => {
    expect(resetPropertyValues(modifiedProperties, 'name')).toMatchObject(properties);
  });
  it('Should reset property object', () => {
    expect(resetPropertyValues(modifiedProperties)).toMatchObject(properties);
  });
});
