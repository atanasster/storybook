import React from 'react';
import { PropertyTypes } from '@storybook/core-events';
import { FilesEditor } from './FilesEditor';

export default {
  title: 'Other/PropEditors/FilesEditor',
  component: FilesEditor,
};

export const sample = () => {
  const [state, setState] = React.useState([
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAHdElNRQfiARwMCyEWcOFPAAAAP0lEQVQoz8WQMQoAIAwDL/7/z3GwghSp4KDZyiUpBMCYUgd8rehtH16/l3XewgU2KAzapjXBbNFaPS6lDMlKB6OiDv3iAH1OAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE4LTAxLTI4VDEyOjExOjMzLTA3OjAwlAHQBgAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxOC0wMS0yOFQxMjoxMTozMy0wNzowMOVcaLoAAAAASUVORK5CYII=',
  ]);
  return (
    <>
      <FilesEditor
        name="prop"
        onChange={(name, newVal) => setState(newVal)}
        prop={{
          type: PropertyTypes.FILES,
          accept: 'image/*',
          value: state,
        }}
      />
      <img src={state[0]} alt="files editor" />
    </>
  );
};
