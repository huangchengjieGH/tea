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
    items: [{
        name: '上线',
        value: '0',
        checked: 'true'
      },
      {
        name: '下架',
        value: '1'
      },
    ],
    chooseTea: {},
    canvasId: 'shareCanvas',
    windowWidth: 320,
    canvasWHRate: 9 / 16,
    showCanvas: false,
    qrCode: '',
    contact: [],
    showCan: true,
    previewOrMore: 0, //0 预览  1 更多
    teaList: {},
    modyfyStatus: true,
    localImg: '',
    iconList: [{
        id: 0,
        url: 'https://zhaocha.yf-gz.cn/file/1532488920459_4a47a0db6e60853dedfcfdf08a5ca249.png',
      },
      {
        id: 1,
        url: 'https://zhaocha.yf-gz.cn/file/1532489796444_7afbb1602613ec52b265d7a54ad27330.png'
      },
      {
        id: 2,
        url: 'https://zhaocha.yf-gz.cn/file/1532502672909_9eb9cd58b9ea5e04c890326b5c1f471f.png'
      },
      {
        id: 3,
        url: 'https://zhaocha.yf-gz.cn/file/1532502749586_fb5c81ed3a220004b71069645f112867.png'
      },
      {
        id: 4,
        url: 'https://zhaocha.yf-gz.cn/file/1532502797048_10fb15c77258a991b0028080a64fb42d.png'
      },
      {
        id: 5,
        url: 'https://zhaocha.yf-gz.cn/file/1532503051688_9dd8c2662b96ce14928333f055c5580.png'
      },
      {
        id: 6,
        url: 'https://zhaocha.yf-gz.cn/file/1532503094842_8266e4bfeda1bd42d8f9794eb4ea0a13.png'
      },
      {
        id: 7,
        url: 'https://zhaocha.yf-gz.cn/file/1532503136612_f19c9085129709ee14d013be869df69b.png'
      },
      {
        id: 8,
        url: 'https://zhaocha.yf-gz.cn/file/1532503171738_586e508f161f26ce94633729ac56c602.png'
      },
      {
        id: 9,
        url: 'https://zhaocha.yf-gz.cn/file/1532503217716_d28933d80c62ddb1a17b7da3e8de542.png'
      }
    ],
    previewImageList: [],
    chooseIcon: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // wx.setNavigationBarTitle({
    //   title: '发布'
    // })
    this.getWindowWidth();
  },
  onEditTap: function(e) {
    var edit = !this.data.edit;
    this.setData({
      edit: edit
    })
  },
  onConfirmTap: function(e) {
    var requireId = e.currentTarget.dataset.requireid;
    this.modifyRequire(requireId);
    this.setData({
      modyfyStatus: true,
      showCan: true,
      flag: true,
      previewOrMore: '0'
    })
    this.makeGoodsCard(2, 0);
  },
  onCancelTap: function(e) {
    this.getPublish();
    this.setData({
      edit: false,
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
  onClickTap: function(e) {
    var down = !this.data.down;
    this.setData({
      down: down
    });
  },
  bindPickerChange: function(e) {
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
  bindCancelTap: function(e) {
    var down = !this.data.down;
    this.setData({
      down: down
    });
  },
  switch1Change: function(e) {
    console.log('switch1 发生 change 事件，携带值为', e.detail.value)
  },
  switch2Change: function(e) {
    console.log('switch2 发生 change 事件，携带值为', e.detail.value)
  },
  show: function() {
    this.setData({
      flag: false
    })

  },
  //消失
  hide: function() {
    console.log('hide');
    this.setData({
      flag: true
    })

  },
  onModalCancelTap: function(e) {
    this.setData({
      flag: true
    })
  },
  onModalConfirmTap: function(e) {
    this.setData({
      flag: true
    })
  },
  onHpTap: function(e) {
    console.log('onHpTap');
    wx.redirectTo({
      url: '../homepage/homepage',
    })
  },
  onAttentionTap: function(e) {
    wx.redirectTo({
      url: '../attention/attention',
    })
  },
  getPublish: function(e) {
    var url = `${app.api.getPublish}` + '/' + `${this.data.userId}`;
    var that = this;
    app.apiFunctions.requestUrl(
      app.api.myPublish,
      'GET',
      true,
      true,
      '',
      function(data) {
        console.log(data);
        if (data.status == 1) {
          that.setData({
            teaList: data.data[0]
          })
          if (data.data.length != 0) {
            that.getQrcode(); //测试生成二维码
          }

          if (data.data.length == 0) {
            wx.showModal({
              title: '商品为空',
              content: '是否前往发布商品',
              success: function(res) {
                if (res.confirm) {
                  console.log('用户点击确定');
                  wx.navigateTo({
                    url: '../edit/edit',
                  })
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })

          }
        }
      }
    );
  },
  deletePublish: function(requireId) {
    var url = `${app.api.deletePublish}` + '/' + `${requireId}`;
    var that = this;
    app.apiFunctions.requestUrl(
      url,
      'delete',
      true,
      true,
      '',
      function(data) {
        console.log(data);
        if (data.status == 1) {
          wx.navigateTo({
            url: '../edit/edit',
          })
        }
      }
    );
  },
  onPhoneTap: function(e) {
    var phone = e.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phone //仅为示例，并非真实的电话号码
    })
  },
  phoneInput: function(e) {
    var phone = e.detail.value;
    if (phone != '') {
      var teaList = this.data.teaList;
      teaList.phone = phone;
      this.setData({
        teaList: teaList
      })
    }
  },
  shopNameInput: function(e) {
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
  teaInput: function(e) {
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
  addTeaTap: function(e) {
    console.log('addTeaTap');
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
  onDeleteTap: function(e) {
    console.log(e.currentTarget.dataset.teaindex);
    var that = this;
    var index = e.currentTarget.dataset.teaindex;
    var teaList = {};
    var length = that.data.teaList.objects.length;
    if (length > '1') {
      wx.showModal({
        title: '提示',
        content: '确认删除该选项吗',
        success: function(res) {
          if (res.confirm) {
            teaList = that.data.teaList;
            teaList.objects.splice(index, 1);
            that.setData({
              teaList: teaList
            })

          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    } else {
      wx.showToast({
        title: '内容不能为空',
      })
    }
  },
  onArrowdownTap: function(e) {
    var index = e.currentTarget.dataset.teaindex;
    console.log(index);
    var teaList = {};
    var objects = [];
    var length = this.data.teaList.objects.length;
    teaList = this.data.teaList;
    if (index != length - 1) {
      objects = this.swapItems(teaList.objects, index, index + 1)
      teaList.objects = objects;
      this.setData({
        teaList: teaList
      })
    } else {
      var str = teaList.objects.splice(index, 1);
      teaList.objects.unshift(str[0]);
      this.setData({
        teaList: teaList
      })
    }
  },
  // 交换数组元素
  swapItems: function(arr, index1, index2) {    
    arr[index1] = arr.splice(index2, 1, arr[index1])[0];    
    return arr;
  },
  onMoreTap: function(e) {
    var moreIndex = e.currentTarget.dataset.teaindex;
    var chooseTea = this.data.teaList.objects[moreIndex];
    this.setData({
      flag: false,
      chooseTea: chooseTea,
      moreIndex: moreIndex,
      previewOrMore: '1',
      ifpreview: false
    })
  },
  onModalNameInput: function(e) {
    var modalName = e.detail.value;
    var chooseTea = this.data.chooseTea;
    if (modalName != '') {
      chooseTea.name = modalName;
      this.setData({
        chooseTea: chooseTea
      })
    }
  },
  onModalCountInput: function(e) {
    var count = e.detail.value;
    var chooseTea = this.data.chooseTea;
    if (count != '') {
      chooseTea.count = count;
      this.setData({
        chooseTea: chooseTea
      })
    }
  },
  onModalUnitInput: function(e) {
    var unit = e.detail.value;
    var chooseTea = this.data.chooseTea;
    if (unit != '') {
      chooseTea.unit = unit;
      this.setData({
        chooseTea: chooseTea
      })
    }
  },
  onModalPriceInput: function(e) {
    var price = e.detail.value;
    var chooseTea = this.data.chooseTea;
    if (price != '') {
      chooseTea.price = price;
      this.setData({
        chooseTea: chooseTea
      })
    }
  },
  onModalConfirmTap: function(e) {
    console.log('onModalConfirmTap');
    var teaList = this.data.teaList;
    teaList.objects[this.data.moreIndex] = this.data.chooseTea;
    this.setData({
      flag: true,
      teaList: teaList
    })
  },
  onModalCancelTap: function(e) {
    this.setData({
      flag: true,
      moreIndex: '',
      chooseTea: {}
    })
  },
  modifyRequire: function(requireid) {
    var url = `${app.api.modify}` + '/' + `${requireid}`;
    var that = this;
    var data = this.data.teaList;
    console.log(data);
    app.apiFunctions.requestUrl(
      url,
      'PUT',
      true,
      false,
      data,
      function(data) {
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
  onClearTap: function(e) {
    var requireId = e.currentTarget.dataset.requireid;
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确认清空数据并重新发布',
      success: function(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          that.setData({
            modyfyStatus: true
          })
          let url = '../edit/edit';
          if (requireId) {
            url = url + '?requireId=' + requireId;

          }
          wx.navigateTo({
            url: url,
          })

        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  clearRequire: function(e) {
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
      function(data) {
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
  onGeneratePicTap: function(e) {
    console.log('ee');
    var that = this;
    this.setData({
      showCan: true
    })
    wx.showLoading({
      title: '生成中...'
    });
    // for (var idx in that.data.iconList){
    this.makeGoodsCard(1, 1);
    // }  
    // if (this.data.modyfyStatus) {
    //   wx.showLoading({ title: '生成中...' });
    //   this.makeGoodsCard(1,1);
    // } else {
    //   wx.previewImage({ urls: [that.data.localImg] });
    //   wx.saveImageToPhotosAlbum({
    //     filePath: that.data.localImg,
    //     success: function (res) {
    //       that.setData({ showCanvas: false });
    //     }
    //   });
    // }

  },
  onPreviewTap: function(e) {
    this.setData({
      showCan: true,
      flag: false,
      previewOrMore: '0'
    })
    if (this.data.modyfyStatus) {
      wx.showLoading({
        title: '生成中...'
      });
      this.makeGoodsCard(2);
    } else {
      this.setData({
        showCan: false,
      })
    }
  },
  onIconsTap: function(e) {
    var id = e.currentTarget.dataset.id;
    console.log(id);
    this.setData({
      chooseIcon: id
    })
  },
  getWindowWidth() {
    const that = this;
    wx.getSystemInfo({
      success: function(res) {
        console.log(res)
        that.setData({
          windowWidth: res.windowWidth * 2,
          windowHeight: res.windowHeight * 2
        });
      }
    });
  },

  previewCanvas(canvasId) {
    const that = this;
    return new Promise(function(resolve) {
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        width: that.data.windowWidth,
        height: that.data.canvasHeight,
        destWidth: that.data.windowWidth,
        destHeight: that.data.canvasHeight,
        canvasId,
        success: function(res) {
          resolve();
          console.log(res.tempFilePath);
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
    var previewImageList = that.data.previewImageList;
    return new Promise(function(resolve) {
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        width: that.data.windowWidth,
        height: that.data.canvasHeight,
        destWidth: that.data.windowWidth,
        destHeight: that.data.canvasHeight,
        canvasId,
        success: function(res) {
          resolve();
          // previewImageList.push(res.tempFilePath);
          // that.setData({
          //   previewImageList: previewImageList
          // })
          wx.previewImage({
            urls: [res.tempFilePath]
          });
          wx.previewImage({
            urls: that.data.previewImageList
          });
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: function(res) {
              that.setData({
                showCanvas: false
              });
            }
          });
        }
      });
    });
  },
  downloadFile(url) {
    const that = this;
    return new Promise(function(resolve) {
      wx.downloadFile({
        url,
        success: function(downRes) {
          console.log(url, downRes)
          if (downRes.statusCode === 200) {
            wx.getImageInfo({
              src: downRes.tempFilePath,
              success: function(info) {
                resolve({
                  info,
                  url: downRes.tempFilePath
                });
              }
            });
          }
        }
      });
    });
  },


  downloadFileList(list) {
    console.log(list);
    const that = this;
    let pList = [];
    for (let i = 0; i < list.length; i++) {
      pList[i] = that.downloadFile(list[i]);
    }
    return Promise.all(pList);
  },
  setparameter: function(e) {
    var findLength = this.data.textFindList.length;
    var SoldLength = this.data.textSoldList.length;
    if (findLength > 0 && SoldLength > 0) {

    }
  },
  drawCanvas(data) {
    const that = this;
    let canvasId = that.data.canvasId;
    let windowWidth = that.data.windowWidth;
    let windowHeight = that.data.windowHeight;
    let canvasWHRate = that.data.canvasWHRate;
    let qrCode = that.data.qrCode;
    let textFindList = that.data.textFindList;
    let textSoldList = that.data.textSoldList;
    let textContect = that.data.contact;
    let canvasColor = '#fefcf7';
    let keywordColor = 'white';
    let textColor = 'white';
    let fontSize = 50;
    let qrCodeSize = 100;
    let token = wx.getStorageSync('token');
    let pTextX = 0.0;
    let pTextY = 0.0;
    var findLength = this.data.textFindList.length;
    var SoldLength = this.data.textSoldList.length;
    // SoldLength=0;
    // findLength=0;
    // let canvasHeight = (findLength + SoldLength) * 100 + 100;
    let canvasHeight = 600;
    if (canvasHeight >= 1150) {
      canvasHeight = 1150;
    }
    this.setData({
      canvasHeight: canvasHeight
    })
    if (findLength > 0 && SoldLength > 0) {
      pTextX = 0.3;
      pTextY = 0.15;
    } else if (findLength == 0 && SoldLength == 0) {

    } else {
      pTextX = 0.3;
      pTextY = 0.15;
    }
    let imgList = [`https://zhaocha.yf-gz.cn/oss/file/1529394343847_c114c89cb8b96e86812abf89b9f7c2ba.jpg`, `https://zhaocha.yf-gz.cn/file/1532436681242_964ac564fd6027e18ca4caa1f1768b67.png`, `https://zhaocha.yf-gz.cn/file/1532437063606_4d073e86592b3b66cdfdc966dabcbb65.png`, `https://zhaocha.yf-gz.cn/oss/file/1529822340278_9c1385517cbc8860981a2e72e3ad310f.png`, `https://zhaocha.yf-gz.cn/file/1532438107116_8b54cd4ba9609fa865d96519ccb75c80.png`, `https://zhaocha.yf-gz.cn/file/1532437996025_496757438c65b362e059f9b96340a103.png`,
      `${that.data.qrcode.imgUrl}`,
      `https://zhaocha.yf-gz.cn/oss/file/1529825482542_43cecb63f716dd6b9dd7390b20dabb3.png`,
      `https://zhaocha.yf-gz.cn/file/1532436966284_7a8b4ce5c1abaedd5af521eb4006e616.png`,
      `https://zhaocha.yf-gz.cn/oss/file/1529828023628_4061fc6131b97ed4cdfcd0a53ea6d579.png`,
      `https://zhaocha.yf-gz.cn/oss/file/1529828109391_78412cb505dba7f0981003b51ac9b541.png`,
      `https://zhaocha.yf-gz.cn/file/1532438904343_348a87abc5f0870ed4d0e6085fd032fb.png`
    ];
    let ctx = wx.createCanvasContext(canvasId);

    const grd = ctx.createLinearGradient(0, 0, 0, canvasHeight)
    grd.addColorStop(0, '#4e4e4e')
    grd.addColorStop(1, '#030000')

    that.setData({
      showCanvas: true
    });
    that.downloadFileList(imgList).then(urlList => {
      let imgInfo = urlList[0];
      let sw = imgInfo.info.width;
      let sh = imgInfo.info.height;
      let imgHeight = windowWidth * sh / sw;
      that.setData({
        canvasWHRate: sw / sh
      });
      //画布框
      ctx.setFillStyle(grd);
      ctx.fillRect(0, 0, windowWidth, canvasHeight);
      //图片
      console.log(windowWidth, windowHeight);
      ctx.drawImage(urlList[1].url, 20, 20, 50, 50);
      ctx.drawImage(urlList[2].url, windowWidth - 70, 20, 50, 50);

      // ctx.drawImage(urlList[7].url, 20, canvasHeight - 70, 50, 50);   zuoxia
      // ctx.drawImage(urlList[8].url, windowWidth - 70, canvasHeight - 70, 50, 50); youxia
      ctx.beginPath();
      ctx.moveTo(71, 22);
      ctx.lineTo(windowWidth - 72, 22);

      // ctx.moveTo(22, 75);
      // ctx.lineTo(22, canvasHeight - 72);  zuo

      ctx.moveTo(22, 75);
      ctx.lineTo(22, canvasHeight - 10);

      // ctx.moveTo(windowWidth - 20, 75);
      // ctx.lineTo(windowWidth - 20, canvasHeight - 72); you
      ctx.moveTo(windowWidth - 20, 75);
      ctx.lineTo(windowWidth - 20, canvasHeight - 10);

      // ctx.moveTo(71, canvasHeight - 20);
      // ctx.lineTo(windowWidth - 72, canvasHeight - 20);
      ctx.moveTo(22, canvasHeight - 10);
      ctx.lineTo(windowWidth - 22, canvasHeight - 10);

      ctx.setLineWidth(8);
      ctx.setStrokeStyle('#884722');
      ctx.stroke();

      //山坡
      // ctx.drawImage(urlList[3].url, 0, 0, windowWidth, imgHeight);

      //二维码
      // ctx.drawImage(urlList[6].url, windowWidth - 240, canvasHeight - 240, qrCodeSize * 1.8, qrCodeSize * 1.8);


      let x = windowWidth * pTextX;
      let y = windowWidth * pTextY;

      if (findLength > 0) {
        ctx.drawImage(urlList[4].url, 85, 60, qrCodeSize * 0.9, qrCodeSize * 0.9); //找
        //文字
        ctx.setFontSize(fontSize);
        ctx.setFillStyle(textColor);
        textFindList.forEach(item => {
          ctx.fillText(item, x, y);
          y += fontSize * 1.3;
        })
      }
      var y2 = y;
      var y3 = y;
      if (SoldLength > 0) {
        if (findLength == 0) {
          y2 = 85;
        } else {
          y2 = y;
          y3 = y3 + 25;
        }
        ctx.drawImage(urlList[5].url, 85, y2 * 0.87, qrCodeSize * 0.9, qrCodeSize * 0.9);
        ctx.setFontSize(fontSize);
        ctx.setFillStyle(textColor);
        textSoldList.forEach(item => {
          ctx.fillText(item, x, y3);
          y3 += fontSize * 1.3;
        })
      }
      ctx.drawImage(urlList[11].url, 25, canvasHeight - 525, windowWidth * 0.8, qrCodeSize * 6);
      // ctx.drawImage(urlList[9].url, 110, canvasHeight - 200, qrCodeSize * 0.4, qrCodeSize * 0.4);
      // ctx.drawImage(urlList[10].url, 110, canvasHeight - 130, qrCodeSize * 0.4, qrCodeSize * 0.4);
      // let x4 = 160;
      // let y4 = canvasHeight - 165;
      // ctx.setFontSize(40);
      // textContect.forEach(item => {
      //   ctx.fillText(item, x4, y4);
      //   y4 += fontSize * 1.2;
      // })
      console.log('开始');
      console.log(data);
      ctx.draw(false, function(res) {
        //生成海报     
        console.log(res)
        if (data == 1) {
          that.saveCanvas(canvasId).then(() => {
            wx.hideLoading();
          });
          that.setData({
            modyfyStatus: false
          })
        }
        //预览
        if (data == 2) {
          console.log('预览');
          that.previewCanvas(canvasId).then(() => {
            wx.hideLoading();
            that.setData({
              modyfyStatus: false
            })
          });
        }

      });
    });
  },
  oldDrawCanvas(data) {
    const that = this;
    let canvasId = that.data.canvasId;
    let windowWidth = that.data.windowWidth;
    let windowHeight = that.data.windowHeight;
    let canvasWHRate = that.data.canvasWHRate;
    let qrCode = that.data.qrCode;
    let textFindList = that.data.textFindList;
    let textSoldList = that.data.textSoldList;
    let textContect = that.data.contact;
    let canvasColor = '#fefcf7';
    let keywordColor = 'white';
    let textColor = 'black';
    let fontSize = 50;
    let qrCodeSize = 100;
    let token = wx.getStorageSync('token');
    let pTextX = 0.0;
    let pTextY = 0.0;
    var findLength = this.data.textFindList.length;
    var SoldLength = this.data.textSoldList.length;
    let iconsInfo = {};
    // SoldLength=0;
    // findLength=0;
    let canvasHeight = (findLength + SoldLength) * 100 + 400;
    if (canvasHeight >= 1150) {
      canvasHeight = 1150;
    }
    this.setData({
      canvasHeight: canvasHeight
    })
    if (findLength > 0 && SoldLength > 0) {
      pTextX = 0.32;
      pTextY = 0.2;
    } else if (findLength == 0 && SoldLength == 0) {

    } else {
      pTextX = 0.32;
      pTextY = 0.2;
    }
    let imgList = [`https://zhaocha.yf-gz.cn/oss/file/1529394343847_c114c89cb8b96e86812abf89b9f7c2ba.jpg`, `https://zhaocha.yf-gz.cn/oss/file/1529760540068_964ac564fd6027e18ca4caa1f1768b67.png`, `https://zhaocha.yf-gz.cn/oss/file/1529760562033_4d073e86592b3b66cdfdc966dabcbb65.png`, `https://zhaocha.yf-gz.cn/oss/file/1529822340278_9c1385517cbc8860981a2e72e3ad310f.png`, `https://zhaocha.yf-gz.cn/oss/file/1529394825902_94cbfaab4e7a34562c24c49b36907de7.png`, `https://zhaocha.yf-gz.cn/oss/file/1529394888202_9e110b7960ee001ca47e3f67caf61ed8.png`,
      `${that.data.qrcode.imgUrl}`, `https://zhaocha.yf-gz.cn/oss/file/1529825482542_43cecb63f716dd6b9dd7390b20dabb3.png`,
      `https://zhaocha.yf-gz.cn/oss/file/1529825635940_7a8b4ce5c1abaedd5af521eb4006e616.png`,
      `https://zhaocha.yf-gz.cn/oss/file/1529828023628_4061fc6131b97ed4cdfcd0a53ea6d579.png`,
      `https://zhaocha.yf-gz.cn/oss/file/1529828109391_78412cb505dba7f0981003b51ac9b541.png`,
      `https://zhaocha.yf-gz.cn/file/1532488920459_4a47a0db6e60853dedfcfdf08a5ca249.png`,
      `https://zhaocha.yf-gz.cn/file/1532489796444_7afbb1602613ec52b265d7a54ad27330.png`
    ];
   var urlicon = that.data.iconList[that.data.chooseIcon].url;
   imgList.push(urlicon);
    let ctx = wx.createCanvasContext(canvasId);
    that.setData({
      showCanvas: true
    });
    that.downloadFileList(imgList).then(urlList => {
      let imgInfo = urlList[0];
      let sw = imgInfo.info.width;
      let sh = imgInfo.info.height;
      let imgHeight = windowWidth * sh / sw;

      that.setData({
        canvasWHRate: sw / sh
      });
      //画布框
      ctx.setFillStyle(canvasColor);
      ctx.fillRect(0, 0, windowWidth, canvasHeight);
      //图片
      console.log(windowWidth, windowHeight);
      ctx.drawImage(urlList[1].url, 20, 20, 50, 50);
      ctx.drawImage(urlList[2].url, windowWidth - 70, 20, 50, 50);

      ctx.drawImage(urlList[7].url, 20, canvasHeight - 70, 50, 50);
      ctx.drawImage(urlList[8].url, windowWidth - 70, canvasHeight - 70, 50, 50);
      ctx.beginPath();
      ctx.moveTo(71, 22);
      ctx.lineTo(windowWidth - 72, 22);

      ctx.moveTo(22, 75);
      ctx.lineTo(22, canvasHeight - 72);

      ctx.moveTo(windowWidth - 20, 75);
      ctx.lineTo(windowWidth - 20, canvasHeight - 72);

      ctx.moveTo(71, canvasHeight - 20);
      ctx.lineTo(windowWidth - 72, canvasHeight - 20);

      ctx.setLineWidth(4);
      ctx.setStrokeStyle('#c4b696');
      ctx.stroke();

      //山坡
      ctx.drawImage(urlList[3].url, 0, 0, windowWidth, imgHeight);

      //二维码
      ctx.drawImage(urlList[6].url, 60, canvasHeight - 240, qrCodeSize * 1.8, qrCodeSize * 1.8);
      var length = urlList.length;
      ctx.drawImage(urlList[length-1].url, windowWidth - 360, canvasHeight - 320, qrCodeSize * 3, qrCodeSize * 3);


      let x = windowWidth * pTextX;
      let y = windowWidth * pTextY;

      if (findLength > 0) {
        ctx.drawImage(urlList[4].url, 85, 85, qrCodeSize * 1.1, qrCodeSize * 1.1); //找
        //文字
        ctx.setFontSize(fontSize);
        ctx.setFillStyle(textColor);
        textFindList.forEach(item => {
          ctx.fillText(item, x, y);
          y += fontSize * 1.3;
        })
      }
      var y2 = y;
      var y3 = y;
      if (SoldLength > 0) {
        if (findLength == 0) {
          y2 = 85;
        } else {
          y2 = y;
          y3 = y3 + 60;
        }
        ctx.drawImage(urlList[5].url, 85, y2, qrCodeSize * 1.1, qrCodeSize * 1.1);
        ctx.setFontSize(fontSize);
        ctx.setFillStyle(textColor);
        textSoldList.forEach(item => {
          ctx.fillText(item, x, y3);
          y3 += fontSize * 1.3;
        })
      }
      // ctx.drawImage(urlList[9].url, 110, canvasHeight - 200, qrCodeSize * 0.4, qrCodeSize * 0.4);
      // ctx.drawImage(urlList[10].url, 110, canvasHeight - 130, qrCodeSize * 0.4, qrCodeSize * 0.4);
      // let x4 = 160;
      // let y4 = canvasHeight - 165;
      // ctx.setFontSize(40);
      // textContect.forEach(item => {
      //   ctx.fillText(item, x4, y4);
      //   y4 += fontSize * 1.2;
      // })
      // console.log('开始');
      // console.log(data);
      ctx.draw(false, function(res) {
        //生成海报     
        console.log(res)
        if (data == 1) {
          that.saveCanvas(canvasId).then(() => {
            wx.hideLoading();
          });
          that.setData({
            modyfyStatus: false
          })
        }
        //预览
        if (data == 2) {
          console.log('预览');
          that.previewCanvas(canvasId).then(() => {
            wx.hideLoading();
            that.setData({
              modyfyStatus: false
            })
          });
        }

      });
    });
  },
  getImageInfo: function(url, callback) {
    wx.getImageInfo({
      src: url,
      success: function(info) {
        // console.log(info);
        callback(info);
      }
    });
  },
  checkSaveImageAuthor() {
    const that = this;
    return new Promise(function(resolve) {
      wx.getSetting({
        success: function(res) {
          console.log('success')
          let authorization = res.authSetting['scope.writePhotosAlbum'];
          authorization && resolve();
          authorization === false && wx.openSetting();
          authorization === undefined && wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success: function() {
              resolve();
            }
          });
        },

      });
    });
  },
  //gType:  0:生成转发群分享图片  1:生成分享图片
  // data: 1: 生成海报     2: 预览
  makeGoodsCard(data, gType) {
    const that = this;
    this.processPreviewData(gType, function(res) {
      console.log(res);
      if (res = 'success') {
        if (gType == 1) {
          that.oldDrawCanvas(data);
        } else {
          that.drawCanvas(data);
        }

      }
    });
    // that.checkSaveImageAuthor().then(() => {
    //   that.drawCanvas();
    // });
  },
  getName: function(e) {
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
  processPreviewData: function(gType, callback) {
    var that = this;
    var contact = [];
    var textFind = [];
    var textSold = [];
    var textFindList = [];
    var textSoldList = [];
    var objects = this.data.teaList.objects;
    var name = this.data.teaList.name;
    var length = 0;
    contact.push(name.substring(0, 8));
    contact.push(this.data.teaList.phone);
    if (gType == 0) {
      length = 5;
    } else {
      length = 10;
    }
    for (var idx in objects) {
      if (idx < length) {
        if (objects[idx].type == 1 || objects[idx].type == 2) {
          textFind.push(objects[idx].name)
        }
        if (objects[idx].type == 3 || objects[idx].type == 4) {
          textSold.push(objects[idx].name);
        }
      } else {
        break;
      }

    }
    this.setData({
      contact: contact,
      textFindList: textFind,
      textSoldList: textSold
    })
    callback('success');
  },
  onModalPreviewConfirm: function(e) {
    this.setData({
      flag: true,
      showCan: false
    })
  },
  getQrcode: function(e) {
    var url = `${app.api.qrcode}` + '/' + `${this.data.teaList.id}`;
    var that = this;
    var data = {
      requireId: this.data.teaList.id
    };
    app.apiFunctions.requestUrl(
      app.api.qrcode,
      'GET',
      true,
      true,
      data,
      function(data) {
        console.log(data);
        if (data.status == 1) {
          that.setData({
            qrcode: data.data
          });
          if (that.data.modyfyStatus) {
            that.setData({
              showCan: true,
              flag: true,
              previewOrMore: '0'
            })
            that.makeGoodsCard(2, 0);
          }
        }
      }
    );
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    console.log('onShow');
    this.getPublish();
    this.setData({
      showCan: false,
      edit: false
    })
    this.getUnreadCount();
    this.interval = setInterval(this.getUnreadCount, 20000);
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
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    console.log('onHide');
    var that = this;
    clearInterval(that.interval);
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    var that = this;
    clearInterval(that.interval);
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */

  onShareAppMessage: function(options) {
    console.log(options);
    let teaList = this.data.teaList;
    var that = this;
    var shareObj = {
      title: `${teaList.name}` + '-' + `${teaList.phone}`,
      path: '/pages/share/share',
      imageUrl: `${that.data.localImg}`,
      success: function(res) {
        if (res.errMsg == 'shareAppMessage:ok') {}
      },
      fail: function(res) {
        if (res.errMsg == 'shareAppMessage:fail cancel') {} else if (res.errMsg == 'shareAppMessage:fail') {}
      }
    };
    if (options.from == 'button') {
      shareObj.path = '/pages/homepage/homepage?requireId=' + teaList.id;
    } else {
      shareObj.path = '/pages/homepage/homepage?requireId=' + teaList.id;
    }
    return shareObj;

  }
})