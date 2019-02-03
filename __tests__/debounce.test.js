const debounce = require('../src/debounce');

let callback;
const args1 = { testing: 123 };
const args2 = { testing: 456 };
const originalNow = global.Date.now;

describe('Testing the debounce function', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    callback = jest.fn();
  });

  afterAll(() => {
    global.Date.now = originalNow;
  });

  it('Expects callback to be called after 100 milliseconds', () => {
    debounce(callback)();
    expect(callback).not.toBeCalled();
    jest.advanceTimersByTime(99);
    expect(callback).not.toBeCalled();
    jest.advanceTimersByTime(1);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('Tests multiple debounce calls before the debounce time is reached', () => {
    const debounced = debounce(callback, 200);

    for (let i = 0; i <= 5; i += 1) {
      debounced();
      jest.advanceTimersByTime(199);
      expect(callback).not.toBeCalled();
    }

    jest.advanceTimersByTime(200);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('Tests maxWaitTime argument', () => {
    const debounced = debounce(callback, 200, 400);

    for (let i = 1; i <= 10; i += 1) {
      global.Date.now = () => i * 100; // mocks Date.now to control ellapsedtime
      debounced();
      jest.advanceTimersByTime(0);
      jest.runAllImmediates();
      jest.advanceTimersByTime(100);
    }

    expect(callback).toHaveBeenCalledTimes(2);
  });

  it('Tests normal debounce with maxWaitTime argument', () => {
    const debounced = debounce(callback, 200, 400);

    debounced();
    jest.advanceTimersByTime(200);
    expect(callback).toHaveBeenCalledTimes(1);

    for (let i = 1; i <= 10; i += 1) {
      global.Date.now = () => i * 100; // ticks date.now forward
      debounced();
      jest.advanceTimersByTime(100);
    }

    expect(callback).toHaveBeenCalledTimes(3);
  });

  it('Ensures debouned gets called with the right arguments', () => {
    const debounced = debounce(callback);
    debounced(args1, args2);
    jest.advanceTimersByTime(100);
    expect(callback).toHaveBeenCalledWith(args1, args2);
  });

  it('Expects to unsubscribe from the debounce function', () => {
    const debounced = debounce(callback)();

    jest.advanceTimersByTime(99);
    debounced(); // Should remove the subscription

    jest.advanceTimersByTime(1);
    expect(callback).not.toHaveBeenCalled();
  });
});
