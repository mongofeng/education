
const moment = require('moment')
export default function (birthday: string) {
  const text = moment(birthday, 'YYYY-MM-DD').fromNow();
  const age = parseInt(text, 10);  // 注意：parseInt(string, radix);第二个参数不能省略，否则会报Lint错误
  return isNaN(age) ? 0 : age;
}
