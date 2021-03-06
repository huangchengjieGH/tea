const server = require('./server.js');
const url = server.domain;
const dhyurl = server.dhData;
module.exports = {
  iconImg:'/api/require/img',
  quote: dhyurl +'/spider/search_detail_new',
  getMyMsg:'/api/wx/user',
  requireUserId:'/api/wx/require/byUserId',
  unreadCount:'/api/wx/chat/unreadCount',
  unreadMessage:'/api/wx/chat/unread',
  sendMessage:'/api/wx/chat',
  setRead:'/api/wx/chat/setRead',
  message:'/api/wx/chat/',
  messageList:'/api/wx/chat/list',
  userPhone: '/api/wx/user/phone',
  userInfo:'/api/wx/user/userInfo',
  detaiResult: dhyurl+'/spider/detail_result/',
  historySearch:'/api/wx/search/history',
  hotSearch:'/api/wx/search/hot',
  searchTea: dhyurl + '/spider/search_detail/',
  getTeaclassify: dhyurl +'/spider/index_result/',
  qrcode: '/api/wx/require/qrcode',
  deletePublish: '/api/wx/require',
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
