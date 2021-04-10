
// time이 한자리인 경우 두자리로 만들어줍니다.
function toDisgits (time: number): string {
  let prefix = '';
  if (time < 9) {
    prefix += '0';
  } 
  return prefix + String(time);
} 

// schema 와 migration 폴더명에 쓰일 timestamp
function timestamp () {
  const now = new Date();
  const year = toDisgits(now.getFullYear());
  const month = toDisgits(now.getMonth() + 1);
  const hour = toDisgits(now.getHours());
  const minute = toDisgits(now.getMinutes());
  const second = toDisgits(now.getSeconds());
  return `${year}${month}${hour}${minute}${second}`;
}

export default timestamp