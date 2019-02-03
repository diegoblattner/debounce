/**
 * Simple debounce function
 * @param {*} fn callback function
 * @param {Number} time Default 100 milliseconds
 * @param {Number} maxWaitTime Ensures the callback is called after n milliseconds, in case debounce is called too often. Default 0 (no maximum wait time)
 */
function debounce(fn, time = 100, maxWaitTime = 0) {
  let timeout;
  let lastDebounce = 0;
  const execFunc = (...args) => () => {
    lastDebounce = 0;
    fn(...args);
  };
  const unsubscribe = () => {
    clearTimeout(timeout);
  };
  const subscribe = (...args) => {
    unsubscribe();
    const newDebounce = Date.now();
    const immidiate =
      maxWaitTime && lastDebounce && newDebounce - lastDebounce >= maxWaitTime;

    if (!lastDebounce) {
      lastDebounce = newDebounce;
    }

    timeout = setTimeout(execFunc(...args), immidiate ? 0 : time);

    return unsubscribe;
  };

  return subscribe;
}

module.exports = debounce;
