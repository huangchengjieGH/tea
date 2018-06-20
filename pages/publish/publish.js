// pages/publish/publish.js
let app = getApp();
const tools = require('../../tools.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ifpreview: true,
    flag: true,
    down: true,
    product: '',
    edit: false,
    style: [
      '找',
      '代客找',
      '出',
      '代客出'
    ],
    index: '0',
    items: [
      { name: '上线', value: '0', checked: 'true' },
      { name: '下架', value: '1' },
    ],
    userId: '3',
    chooseTea: {
    },
    canvasId: 'shareCanvas',
    windowWidth: 320,
    canvasWHRate: 9 / 16,
    showCanvas: false,
    qrCode: '',
    // textFindList: [
    //   '1501 御贡圆茶',
    //   '1801-0562',
    //   '1801黄金甲',
    //   '101女儿贡饼',
    //   '101女儿贡饼',
    //   '101女儿贡饼'
    // ],
    // textSoldList: [
    //   '1702-7572',
    //   '1801-0562',
    //   '1801黄金甲',
    //   '101女儿贡饼',
    //   '101女儿贡饼',
    //   '101女儿贡饼'
    // ],
    contact: [
    ],
    showCan: true,
    previewOrMore: 0   //0 预览  1 更多
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(app.grobalData.userId);
    this.getPublish();
  },
  onEditTap: function (e) {
    var edit = !this.data.edit;
    this.setData({
      edit: edit
    })
  },
  onConfirmTap: function (e) {
    this.modifyRequire();
  },
  onCancelTap: function (e) {
    this.setData({
      edit: false
    })
  },
  // onClickTap: function (e) {
  //   var down = !this.data.down;
  //   this.setData({
  //     down: down
  //   });
  // },
  // bindPickerChange: function (e) {
  //   console.log('bindPickerChange')
  //   var down = !this.data.down;
  //   this.setData({
  //     index: e.detail.value,
  //     down: down
  //   });
  // },
  // bindCancelTap: function (e) {
  //   var down = !this.data.down;
  //   this.setData({
  //     down: down
  //   });
  // },
  onClickTap: function (e) {
    var down = !this.data.down;
    this.setData({
      down: down
    });
  },
  bindPickerChange: function (e) {
    console.log(e.detail.value)
    var down = !this.data.down;
    var teaIndex = e.currentTarget.dataset.teaindex;
    var index = e.detail.value;
    var teaList = this.data.teaList;
    teaList.objects[teaIndex].type = parseInt(index) + 1;
    this.setData({
      index: e.detail.value,
      down: down,
      teaList: teaList
    });
  },
  bindCancelTap: function (e) {
    var down = !this.data.down;
    this.setData({
      down: down
    });
  },
  switch1Change: function (e) {
    console.log('switch1 发生 change 事件，携带值为', e.detail.value)
  },
  switch2Change: function (e) {
    console.log('switch2 发生 change 事件，携带值为', e.detail.value)
  },
  show: function () {
    this.setData({ flag: false })

  },
  //消失
  hide: function () {
    console.log('hide');
    this.setData({ flag: true })

  },
  onModalCancelTap: function (e) {
    this.setData({ flag: true })
  },
  onModalConfirmTap: function (e) {
    this.setData({ flag: true })
  },
  onHpTap: function (e) {
    console.log('onHpTap');
    wx.redirectTo({
      url: '../homepage/homepage',
    })
  },
  onAttentionTap: function (e) {
    wx.redirectTo({
      url: '../attention/attention',
    })
  },
  getPublish: function (e) {
    var url = `${app.api.getPublish}` + '/' + `${this.data.userId}`;
    var that = this;
    app.apiFunctions.requestUrl(
      app.api.myPublish,
      'GET',
      true,
      true,
      '',
      function (data) {
        console.log(data);
        if (data.status == 1) {
          // that.processPublishData(data.data)
          that.setData({
            teaList: data.data[0]
          })
          if(data.data.length == 0){
            wx.redirectTo({
              url: '../edit/edit',
            })
          }
        }
      }
    );
  },
  onPhoneTap: function (e) {
    var phone = e.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phone //仅为示例，并非真实的电话号码
    })
  },
  phoneInput: function (e) {
    var phone = e.detail.value;
    if (phone != '') {
      var teaList = this.data.teaList;
      teaList.phone = phone;
      this.setData({
        teaList: teaList
      })
    }
  },
  shopNameInput: function (e) {
    // var teaIndex = e.currentTarget.dataset.teaindex;
    var teaName = e.detail.value;
    // console.log(teaIndex);
    // console.log(teaName);
    if (teaName != '') {
      var teaList = this.data.teaList;
      teaList.name = teaName;
      this.setData({
        teaList: teaList
      })
    }

  },
  teaInput: function (e) {
    var teaIndex = e.currentTarget.dataset.teaindex;
    var teaName = e.detail.value;
    if (teaName != '') {
      var teaList = this.data.teaList;
      teaList.objects[teaIndex].name = teaName;
      this.setData({
        teaList: teaList
      })
    }
  },
  addTeaTap: function (e) {
    var teas = [],
      teas = this.data.teaList;
    var temp = {
      type: '1',
      name: '',
      status: '1',
      count: '',
      unit: '',
      price: ''
    }
    teas.objects.push(temp);
    this.setData({
      teaList: teas
    })
  },
  onDeleteTap: function (e) {
    console.log(e.currentTarget.dataset.teaindex);
    var index = e.currentTarget.dataset.teaindex;
    var teaList = [];
    if (index != '0') {
      teaList = this.data.teaList;
      teaList.objects.splice(index, 1);
      this.setData({
        teaList: teaList
      })
    }
  },
  onMoreTap: function (e) {
    var moreIndex = e.currentTarget.dataset.teaindex;
    var chooseTea = this.data.teaList.objects[moreIndex];
    this.setData({
      flag: false,
      chooseTea: chooseTea,
      moreIndex: moreIndex,
      previewOrMore:'1'
    })
  },
  onModalNameInput: function (e) {
    var modalName = e.detail.value;
    var chooseTea = this.data.chooseTea;
    if (modalName != '') {
      chooseTea.name = modalName;
      this.setData({
        chooseTea: chooseTea
      })
    }
  },
  onModalCountInput: function (e) {
    var count = e.detail.value;
    var chooseTea = this.data.chooseTea;
    if (count != '') {
      chooseTea.count = count;
      this.setData({
        chooseTea: chooseTea
      })
    }
  },
  onModalPriceInput: function (e) {
    var price = e.detail.value;
    var chooseTea = this.data.chooseTea;
    if (price != '') {
      chooseTea.price = price;
      this.setData({
        chooseTea: chooseTea
      })
    }
  },
  onModalConfirmTap: function (e) {
    console.log('onModalConfirmTap');
    var teaList = this.data.teaList;
    teaList.objects[this.data.moreIndex] = this.data.chooseTea;
    this.setData({
      flag: true,
      teaList: teaList
    })
  },
  onModalCancelTap: function (e) {
    this.setData({
      flag: true,
      moreIndex: '',
      chooseTea: {}
    })
  },
  modifyRequire: function (e) {
    var url = `${app.api.modify}` + '/' + `${this.data.userId}`;
    var that = this;
    var data = this.data.teaList;
    app.apiFunctions.requestUrl(
      url,
      'PUT',
      true,
      false,
      data,
      function (data) {
        console.log(data);
        if (data.status == 1) {
          // that.processPublishData(data.data)
          wx.showToast({
            title: '修改成功',
          })
          that.setData({
            teaList: data.data,
            edit: false
          })
        }
      }
    );
  },
  onClearTap: function (e) {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确认清空数据并重新发布',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          // that.clearRequire();  清空数据，待测
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  clearRequire: function (e) {
    var that = this;
    var body = {
      name: this.data.shopName,
      phone: this.data.phone,
      objects: []
    };
    app.apiFunctions.requestUrl(
      app.api.publish,
      'POST',
      true,
      false,
      body,
      function (data) {
        console.log(data);
        if (data.status == 1) {
          that.setData({
            edit: true,
            teaList: data.data
          })
        }
      }
    );
  },
  // haibao
  onGeneratePicTap: function (e) {
    console.log('ee');
    this.setData({
      showCan: true
    })
    this.makeGoodsCard(1);
  },
  onPreviewTap: function (e) {
    this.setData({
      showCan: true,
      flag: false,
      previewOrMore:'0'
    })
    this.makeGoodsCard(2);
  },
  getWindowWidth() {
    const that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({ windowWidth: res.windowWidth * 2 });
      }
    });
  },

  previewCanvas(canvasId) {
    const that = this;
    return new Promise(function (resolve) {
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        canvasId,
        success: function (res) {
          resolve();
          // wx.previewImage({ urls: [res.tempFilePath] });
          that.setData({
            localImg: res.tempFilePath,
            showCan: false
          })
        }
      });
    });
  },
  saveCanvas(canvasId) {
    const that = this;
    return new Promise(function (resolve) {
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        canvasId,
        success: function (res) {
          resolve();
          wx.previewImage({ urls: [res.tempFilePath] });
           wx.saveImageToPhotosAlbum({
             filePath: res.tempFilePath,
             success: function (res) {
               that.setData({ showCanvas: false });
             }
           });
        }
      });
    });
  },
  downloadFile(url) {
    const that = this;
    return new Promise(function (resolve) {
      wx.downloadFile({
        url,
        success: function (downRes) {
          console.log(url, downRes)
          if (downRes.statusCode === 200) {
            wx.getImageInfo({
              src: downRes.tempFilePath,
              success: function (info) {
                resolve({ info, url: downRes.tempFilePath });
              }
            });
          }
        }
      });
    });
  },


  downloadFileList(list) {
    const that = this;
    let pList = [];
    for (let i = 0; i < list.length; i++) {
      pList[i] = that.downloadFile(list[i]);
    }
    return Promise.all(pList);
  },
  setparameter:function(e){
    var findLength = this.data.textFindList.length;
    var SoldLength = this.data.textSoldList.length;
    if (findLength > 0 && SoldLength > 0){

    }
  },
  drawCanvas(data) {
    const that = this;
    let canvasId = that.data.canvasId;
    let windowWidth = that.data.windowWidth;
    let canvasWHRate = that.data.canvasWHRate;
    let qrCode = that.data.qrCode;
    let textFindList = that.data.textFindList;
    let textSoldList = that.data.textSoldList;
    let textContect = that.data.contact;
    let canvasColor = 'white';
    let keywordColor = 'white';
    let textColor = 'black';
    let fontSize = 20;
    let qrCodeSize = 100;
    let padding = -10;
    let token = wx.getStorageSync('token');
    let pImgW = 0.0;
    let pImgH = 0.0;
    let pTextX = 0.0;
    let pTextY = 0.0;
    var findLength = this.data.textFindList.length;
    var SoldLength = this.data.textSoldList.length;
    // findLength = 0;
    // SoldLength = 0;
    if (findLength > 0 && SoldLength > 0) {
       pImgW = 0.15;
       pImgH = 0.08;
       pTextX = 0.35;
       pTextY = 0.11;
    } else if (findLength == 0 && SoldLength == 0){

    }else{
      pImgW = 0.15;
      pImgH = 0.28;
      pTextX = 0.35;
      pTextY = 0.3;
    }
    // http://damaizs.oss-cn-shenzhen.aliyuncs.com/file/1529394343847_c114c89cb8b96e86812abf89b9f7c2ba.jpg  
    let imgList = [`http://damaizs.oss-cn-shenzhen.aliyuncs.com/file/1529493460659_537640df3e0bf3454e4b797e6b4c6d60.jpeg`, `http://damaizs.oss-cn-shenzhen.aliyuncs.com/file/1528775750604_6e385e0e3a1d687726c97bbb7bb64a28.png`, `http://damaizs.oss-cn-shenzhen.aliyuncs.com/file/1529394825902_94cbfaab4e7a34562c24c49b36907de7.png`, `http://damaizs.oss-cn-shenzhen.aliyuncs.com/file/1529394888202_9e110b7960ee001ca47e3f67caf61ed8.png`];
    let ctx = wx.createCanvasContext(canvasId);
    that.setData({ showCanvas: true });
    wx.showLoading({ title: '生成中...' });
    that.downloadFileList(imgList).then(urlList => {
      let imgInfo = urlList[0];
      let sw = imgInfo.info.width;
      let sh = imgInfo.info.height;
      let imgHeight = windowWidth * sh / sw;
      that.setData({ canvasWHRate: sw / sh });
      //画布框
      ctx.setFillStyle(canvasColor);
      ctx.fillRect(0, 0, windowWidth, imgHeight);
      //图片
      console.log(windowWidth, imgHeight);
      ctx.drawImage(imgInfo.url, 0, 0, windowWidth, imgHeight);
      ctx.drawImage(urlList[1].url, windowWidth * 0.6, imgHeight * 0.8, qrCodeSize, qrCodeSize);   //二维码

      let x = windowWidth * pTextX;
      let y = imgHeight * pTextY;

      if (findLength>0){
        ctx.drawImage(urlList[2].url, windowWidth * pImgW, imgHeight * pImgH, qrCodeSize * 0.5, qrCodeSize * 0.5);  //找
        //文字
        ctx.setFontSize(fontSize);
        ctx.setFillStyle(textColor);
        textFindList.forEach(item => {
          ctx.fillText(item, x, y);
          y += fontSize * 1.2;
        })
      }

      if (SoldLength > 0){
        ctx.drawImage(urlList[3].url, windowWidth * 0.15, y, qrCodeSize * 0.5, qrCodeSize * 0.5);
        y += 20;
        ctx.setFontSize(fontSize);
        ctx.setFillStyle(textColor);
        textSoldList.forEach(item => {
          ctx.fillText(item, x, y);
          y += fontSize * 1.2;
        })
      }    
      // let x2 = windowWidth * 0.45 + padding + qrCodeSize * 0.5;
      // let y2 = imgHeight * 0.48 + padding * 0.4;
      
      let x3 = windowWidth * 0.06 + padding + qrCodeSize * 0.5;
      let y3 = imgHeight * 0.9 + padding*1.5;
      ctx.setFontSize(fontSize-3);
      textContect.forEach(item => {
        ctx.fillText(item, x3, y3);
        y3 += fontSize * 1.2;
      })

      ctx.draw(false, function () {
        //生成海报
        if (data == 1) {
          that.saveCanvas(canvasId).then(() => {
            wx.hideLoading();
          });
        }
        //预览
        if (data == 2) {
          that.previewCanvas(canvasId).then(() => {
            wx.hideLoading();
          });
        }

      });
    });
  },
  checkSaveImageAuthor() {
    const that = this;
    return new Promise(function (resolve) {
      wx.getSetting({
        success: function (res) {
          console.log('success')
          let authorization = res.authSetting['scope.writePhotosAlbum'];
          authorization && resolve();
          authorization === false && wx.openSetting();
          authorization === undefined && wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success: function () {
              resolve();
            }
          });
        },

      });
    });
  },
  makeGoodsCard(data) {
    const that = this;
    this.processPreviewData(function(res){
      console.log(res);
      if (res ='success'){
        that.drawCanvas(data);
      }
    });  
    // that.checkSaveImageAuthor().then(() => {
    //   that.drawCanvas();
    // });
  },
  getName: function (e) {
    var userInfo = app.globalData.userInfo;
    this.setData({
      userInfo: userInfo
    })

    var temp = [];
    for (var index in this.data.textFindList) {
      if (index == 0) {
        temp[index] = '我是' + 'XXX' + ',' + '我为免费饮水代言';
      } else {
        temp[index] = this.data.textFindList[index];
      }
    }
    this.setData({
      textFindList: temp
    })
  },
  processPreviewData:function(callback){
    var contact = [];
    var textFind = [];
    var textSold = [];
    var objects = this.data.teaList.objects;
    contact.push(this.data.teaList.name);
    contact.push(this.data.teaList.phone);
    for (var idx in objects){
      if (objects[idx].type == 1 || objects[idx].type == 2){
        textFind.push(objects[idx].name)
      }
      if (objects[idx].type == 3 || objects[idx].type == 4){
        textSold.push(objects[idx].name);
      }
    }
    this.setData({
      contact: contact,
      textFindList: textFind,
      textSoldList: textSold
    })
    callback("success");
  },
  onModalPreviewConfirm: function (e) {
    this.setData({
      flag: true,
      showCan: false
    })
  },
  /**
 * 生命周期函数--监听页面显示
 */
  onShow: function () {
    console.log('onShow')
    this.setData({
      showCan: false
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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

  onShareAppMessage: function (options) {
    // if (options.from == 'button') {
    //   // 来自页面内转发按钮
    //   console.log(options.target)
    // }
    // return {
    //   title: '自定义转发标题',
    //   path: '/page/user?id=123'
    // }
    console.log(options);
    let teaList = this.data.teaList;
    var that = this;
    　　// 设置菜单中的转发按钮触发转发事件时的转发内容
    　　var shareObj = {
        title: `${teaList.name}` + '-' + `${teaList.phone}`,      // 默认是小程序的名称(可以写slogan等)
      　　　　path: '/pages/share/share',        // 默认是当前页面，必须是以‘/’开头的完整路径
      　　　　imgUrl: '',     //自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径，支持PNG及JPG，不传入 imageUrl 则使用默认截图。显示图片长宽比是 5:4
      　　　　success: function (res) {
        　　　　　　// 转发成功之后的回调
        　　　　　　if (res.errMsg == 'shareAppMessage:ok') {
        　　　　　　}
      　　　　},
      　　　　fail: function (res) {
        　　　　　　// 转发失败之后的回调
        　　　　　　if (res.errMsg == 'shareAppMessage:fail cancel') {
          　　　　　　　　// 用户取消转发
        　　　　　　} else if (res.errMsg == 'shareAppMessage:fail') {
          　　　　　　　　// 转发失败，其中 detail message 为详细失败信息
        　　　　　　}
      　　　　}
  　　};
  　　// 来自页面内的按钮的转发
      if (options.from == 'button') {
    // 　　　　var eData = options.target.dataset;
    　　　　// 此处可以修改 shareObj 中的内容
        shareObj.path = '/pages/homepage/homepage?userId=' + teaList.id;
  　　}
　　// 返回shareObj
　　return shareObj;
  }
})