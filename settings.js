const server = require('./server.js');
const settings = {
  ...server,
  version: 2,
  orderType: {
    FAILED_TYPE: -1, //已关闭
    INIT_TYPE: 0,//初始状态
    PREPAY_TYPE: 1,//未支付
    PAY_TYPE: 2,//已支付
    SENT_TYPE: 3,//已发货
    CUSTOMER_COMFIRM_TYPE: 4,//买家确认
    COMPLETED_TYPE: 5, //订单完成
    REFUND_TYPE: 6,//退款中
    SUCCESS_REFUND_TYPE: 7, //成功退款
    FAIL_REFUND_TYPE: 8, //拒绝退款
  },

  setVersion(value) {
    this.version = value;
  },

  getVersion() {
    return this.version;
  },

  isDistributorVersion() {
    return this.version === 3;
  },

  phone: '',
  setPhone(value) {
    this.phone = value;
  },

  getPhone() {
    return this.phone;
  },
};

module.exports = settings;