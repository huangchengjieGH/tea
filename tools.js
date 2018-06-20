let settings = require('settings.js');
let api = require('api.js');
const todoEvent = (function () {
  let todo = {};

  let listen = function (key, callback) {
    if (typeof callback === 'function') {
      !todo[key] && (todo[key] = new Set());
      todo[key].add(callback);
      callback();
    }
  }

  let trigger = function () {
    let key = Array.prototype.shift.call(arguments);
    if (key && todo[key]) {
      todo[key].forEach(cb => {
        cb.apply(this, arguments);
      });
    }

    if (!key) {
      Object.keys(todo).forEach(key => {
        todo[key].forEach(cb => {
          cb.apply(this, arguments);
        });
      });
    }
  }

  let remove = function (key, callback) {
    if (!key) {
      todo = {};
    }

    if (key) {
      let cbList = todo[key];
      if (cbList) {
        !callback && (todo[key] = new Set());
        cbList.forEach((cb, i) => {
          if (cb === callback) {
            cbList.splice(i, 1);
          }
        });
      }
    }
  }

  return {
    listen,
    trigger,
    remove
  }

})();

let tools = {

  todoEvent,

  requestByLogin(request, callback, errCallback, requestTimes) {
    let that = this;
    requestTimes = requestTimes || 1;
    let token = wx.getStorageSync('token') || '';
    if (!request.url.includes('sid')) {
      let flag = request.url.includes('?') ? '&' : '?';
      request.url = request.url + `${flag}sid=` + token;
    }else{
      var lac = request.url.indexOf("sid");
      request.url = request.url.substr(0,lac+4);
      request.url = request.url + token;
    }
    if (!request.url.includes('http')) {
      request.url = `${settings.domain}${request.url}`;
    }


    request.method = (request.method || 'get').toUpperCase();

    if (request.isFormData) {
      request.header = request.header || {};
      request.header['content-type'] = 'application/x-www-form-urlencoded';
    }

    wx.request({
      url: request.url,
      data: request.data,
      header: request.header,
      method: request.method,
      dataType: request.dataType,
      success: function (res) {
        console.log(res)
        if (res.data.status >= 0) {
          let data = null;
          request.isRes && (data = res.data);
          !request.isRes && (data = res.data.data);
          callback && callback(data);
        }else if (res.data.status == -3) {
          if (requestTimes % 5 !== 0) {
            that.login().then(() => {
              setTimeout(function () {
                that.requestByLogin(request, callback, errCallback, requestTimes);
              }, 1000 * requestTimes++);
            });
          }
        }else{
          if (errCallback) {
            errCallback(res)
          }
        }
      }
    });
  },


  login: (function () {
    let prev = Date.now()-1000
    let todoList = [];
    return function (callback) {
      return new Promise(function (resolve) {
        let now = Date.now();
        // console.log('prev=' + prev);
        // console.log('now=' + now);
        // console.log(now - prev);
        if (now - prev > 1000 * 1) {
          prev = now;
          wx.login({
            success: function (res) {
              wx.request({
                url: api.wxlogin + '?code=' + res.code,
                method: 'POST',
                success: function (res) {
                  wx.setStorageSync('token', res.data.data);
                  resolve(res);
                  todoList.forEach(resolve => {
                    resolve(res);
                  });
                  todoList = [];
                  callback && callback(res.data.data);
                }
              });
            }
          });
        } else {
          todoList.push(resolve);
        }
      });
    }
  })(),



  uploadUserInfo() {
    let that = this;
    return new Promise(function (resove, reject) {
      wx.getUserInfo({
        complete: function (res) {
          console.log(res);
          resove(res.userInfo);
          that.todoEvent.trigger('userInfo');
          that.requestByLogin({
            url: api.postUserInfo,
            method: 'POST',
            data: res.userInfo || {},
          });
        },
        success:function(res){
          console.log(res);
        }
      });
    });
  },


  updateVersion() {
    let that = this;
    that.requestByLogin(
      {
        url: `${settings.domain}/wx/shop/type`,
        method: 'GET',
      },
      function (data) {
        settings.setVersion(data);
        that.todoEvent.trigger('version');
      }
    );
  },

  updatePhone() {
    let that = this;
    that.requestByLogin(
      {
        url: `${settings.domain}/wx/shop/phone`,
        method: 'GET',
      },
      function (data) {
        settings.setPhone(data);
        that.todoEvent.trigger('phone');
      }
    );
  }

}

module.exports = tools;
