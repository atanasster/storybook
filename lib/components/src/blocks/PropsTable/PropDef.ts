export interface JsDocParam {
  name: string;
  description?: string;
}

export interface JsDocReturns {
  description?: string;
}

export interface JsDocTags {
  params?: JsDocParam[];
  returns?: JsDocReturns;
}

export interface PropSummaryValue {
  summary: string;
  detail?: string;
  value?: any;
  type?: string;
}

export type PropType = PropSummaryValue;
export type PropDefaultValue = PropSummaryValue;

export interface DocgenType {
  name: string;
  description?: string;
  required?: boolean;
}

export interface PropDef {
  name: string;
  type: PropType;
  required: boolean;
  description?: string;
  defaultValue?: PropDefaultValue;
  jsDocTags?: JsDocTags;
}
