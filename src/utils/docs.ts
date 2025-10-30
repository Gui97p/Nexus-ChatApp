/* eslint-disable @typescript-eslint/no-explicit-any */
export function stringElement(value?: string, props?: any) {
  return {
    type: 'string',
    example: value,
    ...props,
  };
}

export function numberElement(value?: number, props?: any) {
  return {
    type: 'number',
    example: value,
    ...props,
  };
}

export function boolElement(value?: boolean, props?: any) {
  return {
    type: 'boolean',
    example: value,
    ...props,
  };
}

export function objectElement(object?: any, props?: any) {
  return {
    type: 'object',
    properties: object,
    ...props,
  };
}

export function arrayElement(array?: any, props?: any) {
  return {
    type: 'array',
    items: array,
    ...props,
  };
}

export function reference(ref: string) {
  return {
    $ref: ref + '#',
  };
}

export const security = [{ bearerAuth: [] }];
