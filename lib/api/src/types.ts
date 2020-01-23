export interface StoryProperty {
  name: string;
  label?: string;
  used?: boolean;
  placeholder?: string;
  defaultValue?: any;
  hideLabel?: boolean;
  callback?: () => any;
  [key: string]: any;
}

export interface StoryProperties {
  [key: string]: StoryProperty;
}

export interface StoryValues {
  [key: string]: any;
}
