import React, { FC } from 'react';
import { styled } from '@storybook/theming';
import { getSectionTitleStyle } from './SectionTitleStyles';

export interface SectionRowProps {
  section: string;
}

const SectionTh = styled.th<{}>(({ theme }) => ({
  ...getSectionTitleStyle(theme),
}));

export const SectionRow: FC<SectionRowProps> = ({ section }) => (
  <tr>
    <SectionTh colSpan={3}>{section}</SectionTh>
  </tr>
);
