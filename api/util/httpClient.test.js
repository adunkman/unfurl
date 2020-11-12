const Wreck = require('@hapi/wreck');
const { httpClient } = require('./httpClient');

describe('httpClient', () => {
  it('enables events from the wreck module', () => {
    const spy = jest.spyOn(Wreck, 'defaults');
    httpClient(jest.fn());

    expect(Wreck.defaults).toHaveBeenCalledWith(
      expect.objectContaining({
        events: true,
      }),
    );

    spy.mockRestore();
  });

  it('registers a log function when requests are completed', () => {
    const on = jest.fn();
    const spy = jest.spyOn(Wreck, 'defaults').mockReturnValue({
      events: { on },
    });

    const logger = jest.fn();
    httpClient(logger);

    expect(logger).not.toHaveBeenCalled();
    expect(on).toHaveBeenCalledWith('response', expect.any(Function));

    const eventHandler = on.mock.calls[0][1];
    const error = jest.fn();

    eventHandler(error, {
      start: Date.now(),
      uri: new URL('https://www.example.com'),
    });

    expect(logger).toHaveBeenCalledWith(
      'httpClient',
      expect.objectContaining({ error }),
    );

    spy.mockRestore();
  });
});
