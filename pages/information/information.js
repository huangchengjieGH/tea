const app = getApp();
const prefixUrl = `https://zhaocha.yf-gz.cn/zhaocha/article/mp/homepage`;

Page({
  data: {
    articleUrl: `${prefixUrl}?__biz=Mzg4NjAwMDY3NQ%3D%3D&hid=1&sn=20daaf3a4ef42565b79028dec6e25eae`,
    articleList: []
  },
  getUnreadCount: function(requireId) {
    var that = this;
    app.apiFunctions.requestUrl(
      app.api.unreadCount,
      'GET',
      true,
      true,
      '',
      function(data) {
        console.log(data);
        if (data.status == 1) {
          that.setData({
            unReadCount: data.data
          })
        }
      }
    );
  },

  initData() {
    let articleList = [];
    let item = {
      title: '东盟企业家俱乐部会员问禅-鸡足山',
      subTitle: '禅茶一味，身心大益。',
      imgUrl: '/images/aboutyf/index_10.jpg'
    }
    for (let i = 0; i < 10; i++) {
      articleList.push(item);
    }
    this.setData({
      articleList
    })
  },

  onLoad: function(options) {
    this.initData();
  },

  onShow: function() {
    wx.showTabBar();
    this.getUnreadCount();
    this.interval = setInterval(this.getUnreadCount, 20000);
  }
});