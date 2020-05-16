import { isPlaceholderValue, removePlaceholders } from '../src/utils';

describe('isPlaceholderValue', () => {
  // eslint-disable-next-line no-template-curly-in-string
  test('works for for ${VARNAME}', () => {
    // eslint-disable-next-line no-template-curly-in-string
    expect(isPlaceholderValue('${VARNAME}')).toBe(true);
  });
  test('works for $VARNAME', () => {
    expect(isPlaceholderValue('$VARNAME')).toBe(true);
  });
  test('works for $VAR_NAME_2', () => {
    expect(isPlaceholderValue('$VAR_NAME_2')).toBe(true);
  });
  // eslint-disable-next-line no-template-curly-in-string
  test('does not work for ${VARNAME-default}', () => {
    // eslint-disable-next-line no-template-curly-in-string
    expect(isPlaceholderValue('${VARNAME-default}')).toBe(false);
  });
});

describe('removePlaceholders', () => {
  test('replaces any placeholders by undefined and leaves values', () => {
    const input = {
      test: 'test',
      value: '$PLACEHOLDER',
      // eslint-disable-next-line no-template-curly-in-string
      value2: '${PLACEHOLDER2}',
      value3: '$PLACE_HOLDER_3',
    };
    const expected = {
      test: 'test',
      /* eslint-disable no-undefined */
      value: undefined,
      value2: undefined,
      value3: undefined,
      /* eslint-enable no-undefined */
    };
    expect(removePlaceholders(input)).toStrictEqual(expected);
  });

  test('works with nested configuration objects', () => {
    const input = {
      test: 'test',
      nested: {
        value: '$PLACEHOLDER',
        // eslint-disable-next-line no-template-curly-in-string
        value2: '${PLACEHOLDER2}',
      },
      value3: '$PLACE_HOLDER_3',
    };
    const expected = {
      test: 'test',
      nested: {
        /* eslint-disable no-undefined */
        value: undefined,
        value2: undefined,
      },
      value3: undefined,
      /* eslint-enable no-undefined */
    };
    expect(removePlaceholders(input)).toStrictEqual(expected);
  });
});
