let tools = require('tools.js');

const apiFunctions = {
  requestUrl(url, method, isRes, isFormData, data, callback, errcallback) {
    tools.requestByLogin({
        url: url,
        method: method,
        isRes: isRes,
        isFormData: isFormData,
        data: data
      },
      callback,
      errcallback
    );
  },
}
module.exports = apiFunctions