const server = require('./server.js');
const url = server.domain;
 
module.exports = {
  visit:'/api/wx/require/visit',
  myPublish:'/api/wx/require/myRequire',
  myLikeRequire:'/api/wx/require/myLikeRequire',
  myVisitRequire:'/api/wx/require/myVisitRequire',
  uncollect: '/api/wx/require/unlike',
  collect:'/api/wx/require/like',
  modify:'/api/wx/require',
  search:'/api/wx/search',
  recommend:'/api/wx/require/recommend',
  getPublish:'/api/wx/require',
  publish:'/api/wx/require',
  parse:'/api/wx/require/parse',
  login: '/api/wx/custom/login',
  userMsg: '/api/wx/custom/current',
  wxlogin: url + '/api/wx/user/login',
  postUserInfo: '/api/wx/user/userInfo',
  register: '/api/wx/custom/register',
  smsCode: '/api/wx/custom/smsCode',
};
