import { createFlowPropDef } from './createPropDef';
import { DocgenInfo } from '../types';

const PROP_NAME = 'propName';

function createDocgenInfo({ flowType, ...others }: Partial<DocgenInfo>): DocgenInfo {
  return {
    flowType,
    required: false,
    ...others,
  };
}

describe('type', () => {
  ['string', 'number', 'boolean', 'any', 'void', 'Object', 'String', 'MyClass', 'literal'].forEach(
    x => {
      it(`should support ${x}`, () => {
        const docgenInfo = createDocgenInfo({
          flowType: { name: x },
        });

        const { type } = createFlowPropDef(PROP_NAME, docgenInfo);

        expect(type.summary).toBe(x);
        expect(type.detail).toBeUndefined();
      });
    }
  );

  ['Array', 'Class', 'MyClass'].forEach(x => {
    it(`should support untyped ${x}`, () => {
      const docgenInfo = createDocgenInfo({
        flowType: { name: x },
      });

      const { type } = createFlowPropDef(PROP_NAME, docgenInfo);

      expect(type.summary).toBe(x);
      expect(type.detail).toBeUndefined();
    });

    it(`should support typed ${x}`, () => {
      const docgenInfo = createDocgenInfo({
        flowType: {
          name: x,
          elements: [
            {
              name: 'any',
            },
          ],
          raw: `${x}<any>`,
        },
      });

      const { type } = createFlowPropDef(PROP_NAME, docgenInfo);

      expect(type.summary).toBe(`${x}<any>`);
      expect(type.detail).toBeUndefined();
    });
  });

  it('should support short object signature', () => {
    const docgenInfo = createDocgenInfo({
      flowType: {
        name: 'signature',
        type: 'object',
        raw: '{ foo: string, bar?: mixed }',
        signature: {
          properties: [
            {
              key: 'foo',
              value: {
                name: 'string',
                required: true,
              },
            },
            {
              key: 'bar',
              value: {
                name: 'mixed',
                required: false,
              },
            },
          ],
        },
      },
    });

    const { type } = createFlowPropDef(PROP_NAME, docgenInfo);

    expect(type.summary).toBe('{ foo: string, bar?: mixed }');
    expect(type.detail).toBeUndefined();
  });

  it('should support long object signature', () => {
    const docgenInfo = createDocgenInfo({
      flowType: {
        name: 'signature',
        type: 'object',
        raw:
          '{ (x: string): void, prop1: string, prop2: string, prop3: string, prop4: string, prop5: string }',
        signature: {
          properties: [
            {
              key: 'prop1',
              value: {
                name: 'string',
                required: true,
              },
            },
            {
              key: 'prop2',
              value: {
                name: 'string',
                required: true,
              },
            },
            {
              key: 'prop3',
              value: {
                name: 'string',
                required: true,
              },
            },
            {
              key: 'prop4',
              value: {
                name: 'string',
                required: true,
              },
            },
            {
              key: 'prop5',
              value: {
                name: 'string',
                required: true,
              },
            },
          ],
          constructor: {
            name: 'signature',
            type: 'function',
            raw: '(x: string): void',
            signature: {
              arguments: [
                {
                  name: 'x',
                  type: {
                    name: 'string',
                  },
                },
              ],
              return: {
                name: 'void',
              },
            },
          },
        },
      },
    });

    const { type } = createFlowPropDef(PROP_NAME, docgenInfo);

    expect(type.summary).toBe('object');
    expect(type.detail).toBe(
      '{ (x: string): void, prop1: string, prop2: string, prop3: string, prop4: string, prop5: string }'
    );
  });

  it('should support func signature', () => {
    const docgenInfo = createDocgenInfo({
      flowType: {
        name: 'signature',
        type: 'function',
        raw: '(x: string) => void',
        signature: {
          arguments: [
            {
              name: 'x',
              type: {
                name: 'string',
              },
            },
          ],
          return: {
            name: 'void',
          },
        },
      },
    });

    const { type } = createFlowPropDef(PROP_NAME, docgenInfo);

    expect(type.summary).toBe('(x: string) => void');
    expect(type.detail).toBeUndefined();
  });

  it('should support tuple', () => {
    const docgenInfo = createDocgenInfo({
      flowType: {
        name: 'tuple',
        raw: '[foo, "value", number]',
        elements: [
          {
            name: 'foo',
          },
          {
            name: 'literal',
            value: '"value"',
          },
          {
            name: 'number',
          },
        ],
      },
    });

    const { type } = createFlowPropDef(PROP_NAME, docgenInfo);

    expect(type.summary).toBe('[foo, "value", number]');
  });

  it('should support union', () => {
    const docgenInfo = createDocgenInfo({
      flowType: {
        name: 'union',
        raw: 'number | string',
        elements: [
          {
            name: 'number',
          },
          {
            name: 'string',
          },
        ],
      },
    });

    const { type } = createFlowPropDef(PROP_NAME, docgenInfo);

    expect(type.summary).toBe('number | string');
  });

  it('should support intersection', () => {
    const docgenInfo = createDocgenInfo({
      flowType: {
        name: 'intersection',
        raw: 'number & string',
        elements: [
          {
            name: 'number',
          },
          {
            name: 'string',
          },
        ],
      },
    });

    const { type } = createFlowPropDef(PROP_NAME, docgenInfo);

    expect(type.summary).toBe('number & string');
  });
});
