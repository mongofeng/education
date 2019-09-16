/**
 *
 * @param data
 * @return {{}}
 */
export function formateTemplate(data: {[key in string]: string | number}) {
  return Object.keys(data).reduce((initVal, key) => {
    return {
      ...initVal,
      [key]: {
        value: data[key],
      },
    };
  }, {});
}
