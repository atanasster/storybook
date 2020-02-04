import React, { FC } from 'react';
import { styled } from '@storybook/theming';
import { getSectionTitleStyle } from './SectionTitleStyles';

export interface SectionRowProps {
  section: string;
  colSpan?: number;
}

const SectionTh = styled.th<{}>(({ theme }) => ({
  ...getSectionTitleStyle(theme),
}));

export const SectionRow: FC<SectionRowProps> = ({ section, colSpan = 3 }) => (
  <tr>
    <SectionTh colSpan={colSpan}>{section}</SectionTh>
  </tr>
);
