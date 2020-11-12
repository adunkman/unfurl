const { pluck } = require('./pluck');

describe('pluck', () => {
  it('defaults to an empty string', () => {
    expect(pluck({}, 'propertyThatDoesNotExist')).toBe('');
  });

  it('returns the first matched property when two properties have values', () => {
    expect(
      pluck(
        {
          keyZ: 'valueZ',
          keyA: 'valueA',
        },
        'keyA',
        'keyZ',
      ),
    ).toBe('valueA');
  });

  it('returns the first matched property when only one property is defined', () => {
    expect(
      pluck(
        {
          keyA: 'valueA',
        },
        'propertyThatDoesNotExist',
        'keyA',
      ),
    ).toBe('valueA');
  });
});
