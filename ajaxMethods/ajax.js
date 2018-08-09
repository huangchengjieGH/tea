const Tools = require('../tools.js');

class Ajax {
  constructor(params) {
    params = params || {};
    for (let attr in params) {
      this[attr] = params[params];
    }
  }

  getRankList() {
    return new Promise(function(resolve, reject) {
      Tools.requestByLogin({
          url: `/api/wx/customer/rank`,
          method: 'get',
          isRes: true
        },
        res => {
          resolve(res);
        },
        err => {
          reject(err);
        });
    });
  }

  getCustomer() {
    return new Promise(function(resolve, reject) {
      Tools.requestByLogin({
          url: `/api/wx/customer`,
          method: 'get',
          isRes: true
        },
        res => {
          resolve(res);
        },
        err => {
          reject(err);
        });
    });
  }
}

module.exports = Ajax;