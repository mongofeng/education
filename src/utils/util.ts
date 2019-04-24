export function debounce(fn: () => void, wait: number) {
  let timeout: any = null;
  return () => {
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(fn, wait);
  };
}


export function throttle(fn: () => void, interval: number) {
  let prev: number = Date.now(); // 记录时器
  let firstTime: boolean = true; // 是否第一次调用

  return () => {
    // tslint:disable-next-line
    if (firstTime) {
      fn();
      prev = Date.now();
      firstTime = false
      return;
    }

    const now: number = Date.now();
    console.log(now - prev)
    if (now - prev >= interval) {
      fn();
      prev = Date.now();
    }
  };
}


export function find<T> (array: T[], {props, value}: {props: string; value: string | number}): T | null {
  for (const item of array) {
    if (item[props] === value) {
      return item
    }
  }
  return null
}