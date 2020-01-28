import { document } from 'global';
import React from 'react';
import { SketchPicker, ColorResult } from 'react-color';
import { StoryPropertyColor } from '@storybook/common';

import { styled } from '@storybook/theming';
import { Form } from '@storybook/components';
import { PropertyControlProps, PropertyEditor } from '../types';

interface ColorButtonProps {
  name: string;
  type: string;
  size: string;
  active: boolean;
  width: string;
  onClick: () => any;
}

const { Button } = Form;

const Swatch = styled.div<{}>(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  left: 6,
  width: 16,
  height: 16,
  boxShadow: `${theme.appBorderColor} 0 0 0 1px inset`,
  borderRadius: '1rem',
}));

const ColorButton = styled(Button)<ColorButtonProps>(({ active }) => ({
  zIndex: active ? 3 : 'unset',
  paddingLeft: '30px',
}));

const Popover = styled.div({
  position: 'absolute',
  zIndex: 2,
});

interface ColorEditorProps extends PropertyControlProps {
  prop: StoryPropertyColor;
}

export const ColorEditor: PropertyEditor<ColorEditorProps> = ({ prop, name, onChange }) => {
  const [displayColorPicker, setDisplayColorPicker] = React.useState(false);
  const popoverRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const handleWindowMouseDown = (e: MouseEvent) => {
      if (
        !displayColorPicker ||
        (popoverRef && popoverRef.current && popoverRef.current.contains(e.target as HTMLElement))
      ) {
        return;
      }
      setDisplayColorPicker(false);
    };
    document.addEventListener('mousedown', handleWindowMouseDown);
    return () => {
      document.removeEventListener('mousedown', handleWindowMouseDown);
    };
  }, []);

  const handleChange = (color: ColorResult) => {
    onChange(name, `rgba(${color.rgb.r},${color.rgb.g},${color.rgb.b},${color.rgb.a})`);
  };

  const colorStyle = {
    background: prop.value,
  };
  return (
    <ColorButton
      active={displayColorPicker}
      type="button"
      name={name}
      onClick={() => setDisplayColorPicker(!displayColorPicker)}
      size="flex"
    >
      {prop.value && prop.value.toUpperCase()}
      <Swatch style={colorStyle} />
      {displayColorPicker ? (
        <Popover ref={popoverRef}>
          <SketchPicker color={prop.value} onChange={handleChange} />
        </Popover>
      ) : null}
    </ColorButton>
  );
};
