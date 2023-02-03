global.logFunction = (type, ...logs) => {
  if (type === 2) {
    console.error(...logs);
  } else if (type === 1) {
    console.warn(...logs);
  } else {
    // type === 0
    console.log(...logs);
  }
};
