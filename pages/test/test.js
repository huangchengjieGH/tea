// pages/test/test.js
const date = new Date()
const years = []
const months = []
const days = []

for (let i = 1990; i <= date.getFullYear(); i++) {
  years.push(i)
}

for (let i = 1; i <= 12; i++) {
  months.push(i)
}

for (let i = 1; i <= 31; i++) {
  days.push(i)
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    testData:[
      {
        url:'/images/icons/avatar2.jpeg',
        msg: '1'
      },
      {
        url: '/images/icons/avatar2.jpeg',
        msg: '2'
      },
      {
        url: '/images/icons/avatar2.jpeg',
        msg: '3'
      },
      {
        url: '/images/icons/avatar2.jpeg',
        msg: '4'
      },
      {
        url: '/images/icons/avatar2.jpeg',
        msg: '5'
      },
      {
        url: '/images/icons/avatar2.jpeg',
        msg: '6'
      },
      {
        url: '/images/icons/avatar2.jpeg',
        msg: '7'
      },
      {
        url: '/images/icons/avatar2.jpeg',
        msg: '8'
      },
      {
        url: '/images/icons/avatar2.jpeg',
        msg: '9'
      },
      {
        url: '/images/icons/avatar2.jpeg',
        msg: '10'
      },
      {
        url: '/images/icons/avatar2.jpeg',
        msg: '11'
      }

    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('onLoad');


  },
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
  },
  switch1Change: function (e) {
    console.log('switch1 发生 change 事件，携带值为', e.detail.value)
  },
  switch2Change: function (e) {
    console.log('switch2 发生 change 事件，携带值为', e.detail.value)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})