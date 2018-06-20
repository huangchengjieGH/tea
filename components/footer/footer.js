// components/footer.js
let app = getApp();
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    property:{}
  },

  attached() {
    let that = this;
    // app.tools.todoEvent.listen('property', function() {
    //   that.setData({
    //     property: app.property,
    //   })
    //   console.log(that.data.property);
    // });
  },

  /**
   * 组件的方法列表
   */
  methods: {

    gotoGZ() {
      if (this.data.property.bottomLink != 'blank') {
        wx.navigateTo({
          url: '../guangzi/guangzi',
        })
      }
    },
  }
})
