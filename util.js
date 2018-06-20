const formatTime = (date, flag = true) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  if (flag) {
    return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':');
  }
  return [year, month, day].map(formatNumber).join('-');
}

const formatNumber = n => {
  n = n.toString();
  return n[1] ? n : '0' + n;
}

const getParams = function (url) {
  let params = {};
  if (url.includes('?')) {
    let list = url.split('?')[1].split('&');
    list.forEach(item => {
      params[item.split('=')[0]] = decodeURIComponent(item.split('=')[1]);
    });
  }
  return params;
};

module.exports = {
  formatTime: formatTime,
  getParams: getParams,
}
