
export function getAgeOptions(len?: number) {
  const length = len || 80
  const result: Array<ILabelVal<number>> = [];
  for (let i = 1; i <= length; i++) {
    result.push({
      label: `${i}岁`,
      value: i
    });
  }
  return result;
}
