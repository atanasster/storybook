import React from 'react';
import JSXMarkdown from 'markdown-to-jsx';
import { ResetWrapper } from '../typography/DocumentFormatting';
import { components } from '../html';

export interface MarkdownProps {
  children: string;
}

/**
 * A markdown component, typically used to show formatted imported markdown file.
 * import readMe from './readme.md'
 *
 * `<Markdown>{readMe}</Markdown>`
 */
export const Markdown: React.FunctionComponent<MarkdownProps> = ({ children }) => (
  <ResetWrapper>
    <JSXMarkdown options={{ forceBlock: true, overrides: components }}>{children}</JSXMarkdown>
  </ResetWrapper>
);
