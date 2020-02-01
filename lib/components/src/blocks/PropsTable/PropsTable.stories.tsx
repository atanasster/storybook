import React from 'react';
import { PropsTable, PropsTableError } from './PropsTable';
import { stringDef, numberDef } from './PropRow.stories';

export default {
  component: PropsTable,
  title: 'Docs/PropTable',
};

export const normal = () => <PropsTable rows={[stringDef, numberDef]} />;

export const sections = () => (
  <PropsTable sections={{ props: [stringDef, numberDef], events: [stringDef] }} />
);

export const error = () => <PropsTable error={PropsTableError.NO_COMPONENT} />;

export const empty = () => <PropsTable rows={[]} />;

export const extraColumns = () => (
  <PropsTable
    rows={[stringDef, numberDef]}
    extraColumns={[
      {
        name: 'trnslations',
        title: 'Translations',
        rows: {
          someNumber: (
            <>
              <img alt="" src="https://www.countryflags.io/bg/shiny/24.png" />
            </>
          ),
          someString: (
            <>
              <img alt="" src="https://www.countryflags.io/be/shiny/24.png" />
              <img alt="" src="https://www.countryflags.io/bg/shiny/24.png" />
              <img alt="" src="https://www.countryflags.io/fr/shiny/24.png" />
            </>
          ),
        },
      },
    ]}
  />
);
