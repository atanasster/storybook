/**
 * Property field types
 * examples are provided for the different types:
 *
 */
export enum PropertyTypes {
  /**
   * userName: {
   *   type: csf.PropertyTypes.TEXT,
   *   label: 'Name',
   *   value: 'Storyteller',
   * },
   */
  TEXT = 'text',

  /**
   *  age: {
   *   type: csf.PropertyTypes.NUMBER,
   *   label: 'Age',
   *   value: 78,
   *   range: true,
   *   min: 0,
   *   max: 90,
   *   step: 5,
   * },
   */
  NUMBER = 'number',

  /**
   * nice: {
   *  type: csf.PropertyTypes.BOOLEAN,
   *  label: 'Nice',
   *  value: true,
   * },
   */
  BOOLEAN = 'boolean',

  /**
   * fruit: {
   *   type: csf.PropertyTypes.OPTIONS,
   *   label: 'Fruit',
   *   value: 'apple',
   *   options: {
   *     Apple: 'apple',
   *     Banana: 'banana',
   *     Cherry: 'cherry',
   *   },
   * },
   */
  OPTIONS = 'options',

  /**
   *  birthday: {
   *   type: csf.PropertyTypes.DATE,
   *   label: 'Birthday',
   *   value: new Date(),
   *  },
   */
  DATE = 'date',

  /**
   * color: {
   *   type: 'color',
   *   value: '#000000',
   * },
   */
  COLOR = 'color',

  /**
   * button: {
   *  type: csf.PropertyTypes.BUTTON,
   *   onClick: () => {
   *    ... code to modify some variables
   *  }
   * },
   */
  BUTTON = 'button',

  /**
   * otherStyles: {
   *   type: csf.PropertyTypes.OBJECT,
   *   label: 'Styles',
   *   value: {
   *     border: '2px dashed silver',
   *     borderRadius: 10,
   *     padding: 10,
   *   },
   * },
   */
  OBJECT = 'object',

  /**
   * items: {
   *   type: csf.PropertyTypes.ARRAY,
   *   label: 'Items',
   *   value: ['Laptop', 'Book', 'Whiskey'],
   * },
   */
  ARRAY = 'array',

  /**
   * images: {
   *   type: csf.PropertyTypes.FILES,
   *   label: 'Happy Picture',
   *   accept: 'image/*',
   *   value: [
   *     'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAHdElNRQfiARwMCyEWcOFPAAAAP0lEQVQoz8WQMQoAIAwDL/7/z3GwghSp4KDZyiUpBMCYUgd8rehtH16/l3XewgU2KAzapjXBbNFaPS6lDMlKB6OiDv3iAH1OAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE4LTAxLTI4VDEyOjExOjMzLTA3OjAwlAHQBgAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxOC0wMS0yOFQxMjoxMTozMy0wNzowMOVcaLoAAAAASUVORK5CYII=',
   *   ],
   * },
   */
  FILES = 'files',
}

export interface StoryPropertyBase<T> {
  type: PropertyTypes;

  /**
   * label to display next to the field editor
   * by default uses the property name itself
   */

  label?: string;

  /**
   * a default value for the property
   */
  value?: T;

  /**
   * hide the label from the property editor
   */
  hideLabel?: boolean;
  /**
   * hide the property editor for this property
   * will only use the value
   */

  hidden?: boolean;
  /**
   * allows grouping of the properties
   * in a property editor
   * for example different editor tabs
   */
  groupId?: string;

  /**
   * allows custom sorting of the properties
   * if 'order' is not provided, the props
   * will be sorted by the order/key of the object (unreliable)
   */
  order?: number;
}

export interface StoryPropertyText extends StoryPropertyBase<string> {
  type: PropertyTypes.TEXT;

  /**
   * placeholder for empty properties
   * either undefined initial value
   * or user clears the field
   */
  placeholder?: string;

  /**
   * minimum number of rows in a TextArea field for longe textr
   * by default, only 1 row = means a Input field
   */
  minRows?: number;

  /**
   * number of rows in a TextArea field
   */
  maxRows?: number;
}

export interface StoryPropertyBoolean extends StoryPropertyBase<boolean> {
  type: PropertyTypes.BOOLEAN;
}

export interface StoryPropertyColor extends StoryPropertyBase<string> {
  type: PropertyTypes.COLOR;
}

export interface StoryPropertyDate extends StoryPropertyBase<Date> {
  type: PropertyTypes.DATE;
  /**
   * whether to display a date picker (calendar).
   * default: true
   */
  datePicker?: boolean;

  /**
   * whether to display a time picker (calendar).
   * default: true
   */

  timePicker?: boolean;
}

export interface StoryPropertyFiles extends StoryPropertyBase<string[]> {
  type: PropertyTypes.FILES;
  /**
   * type of files to accept user to open
   * ex 'image/*',
   */
  accept?: string;
}

export interface StoryPropertyArray extends StoryPropertyBase<string[]> {
  type: PropertyTypes.ARRAY;
  /**
   * the array items separator, by default comma
   */
  separator?: string;
}

export interface StoryPropertyObject extends StoryPropertyBase<object> {
  type: PropertyTypes.OBJECT;
  /**
   * minimum number of rows in a TextArea field
   */
  minRows?: number;

  /**
   * maximun number of rows in a TextArea field
   */
  maxRows?: number;
}

export interface StoryPropertyButton extends StoryPropertyBase<void> {
  type: PropertyTypes.BUTTON;

  /**
   * for button type fields, an onClick handler
   */
  onClick?: (prop: StoryPropertyButton) => void;
}

export type OptionsValueType =
  | string
  | number
  | string[]
  | number[]
  | { label: string; value: any };

/**
 * value/label pairs or array of OptionsValueType
 */
export type OptionsListType = { [key: string]: string } | OptionsValueType[];

/**
 * list of options can be
 * 1. key-value pair object: in format { label: value }
 * 2. array of strings
 * 3. array of key-value pair objects
 */

export interface StoryPropertyOptions extends StoryPropertyBase<OptionsValueType> {
  type: PropertyTypes.OPTIONS;

  options: OptionsListType;
  /**
   * how to render slecting the options:
   * default is 'select'
   */

  display?: 'select' | 'multi-select' | 'radio' | 'inline-radio' | 'check' | 'inline-check';
}

export interface StoryPropertyNumber extends StoryPropertyBase<number> {
  type: PropertyTypes.NUMBER;
  /**
   * for numeric type fields
   */

  /**
   * if true, will display a range type slider editor
   */
  range?: boolean;

  /**
   * minimum allowed value for numeric property
   */
  min?: number;

  /**
   * maximum allowed value for numeric property
   */
  max?: number;

  /**
   * stepper for numeric editor /i nc/dec value
   */

  step?: number;
}

/**
 * StoryProperty is a either an object of property settings
 * or a shortcut can be used:
 *  properties: {
 *   text: 'Hello',
 * },
 */

export type StoryProperty =
  | StoryPropertyText
  | StoryPropertyBoolean
  | StoryPropertyColor
  | StoryPropertyDate
  | StoryPropertyObject
  | StoryPropertyButton
  | StoryPropertyOptions
  | StoryPropertyNumber
  | StoryPropertyArray
  | StoryPropertyFiles;

/**
 * StoryProperties are defined in key value pairs
 * the name of the property is the key
 * and the value is the StoryProperty
 */
export interface StoryProperties {
  [name: string]: StoryProperty;
}
