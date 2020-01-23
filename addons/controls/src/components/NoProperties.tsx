import React from 'react';
import { Placeholder, Link } from '@storybook/components';

export const NoProperties = () => (
  <Placeholder>
    <>No properties found</>
    <>
      Learn how to&nbsp;
      <Link
        href="https://github.com/storybookjs/storybook/tree/master/addons/controls"
        target="_blank"
        withArrow
        cancel={false}
      >
        dynamically interact with components
      </Link>
    </>
  </Placeholder>
);
