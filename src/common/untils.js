export function debounce(func, delay) {
  let timer = null
  return function(...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      func.apply(this, ...args)
    }, delay);
  }
}

export function formatDate(date, fmt) {
  if(typeof date === 'string'){
      return date;
  }
  date = new Date(date *1000);
  var o = {
      'M+': date.getMonth() + 1, //月份
      'd+': date.getDate(), // 日
      'h+': date.getHours(), //时
      'm+': date.getMinutes(), // 分
      's+': date.getSeconds(), // 秒
      'q+': Math.floor((date.getMonth()+3) / 3), // 季度
      'S' : date.getMilliseconds(), //毫秒
  }

  if (!date || date == null) return null;

  if(/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  for(var k in o){
      if(new RegExp('('+k+')').test(fmt)){
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00'+o[k]).substr((''+o[k]).length)));
      }
  }
  return fmt;
}