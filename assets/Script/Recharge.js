// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html
var Data = require('Data');
var Func = Data.func;
cc.Class({
  extends: cc.Component,

  properties: {},

  ctor() {},
  btnBackEvent() {
    cc.director.loadScene('index');
  },
  bindNode() {
    this.moneyLabel = cc.find('bg/container/div/gold/money', this.node).getComponent(cc.Label);
  },
  initData() {
    Func.GetUserMoney().then(data => {
      if (data.Code === 1) {
        this.moneyLabel.string = data.Model;
      } else {
        Msg.show(data.Message);
      }
    });
  },
  onLoad() {
    this.bindNode();
    this.initData();
  },
  onBridgeReady(data) {
    WeixinJSBridge.invoke(
      'getBrandWCPayRequest',
      {
        appId: data.appId, //公众号名称，由商户传入
        timeStamp: data.timeStamp, //时间戳，自1970年以来的秒数
        nonceStr: data.nonceStr, //随机串
        package: data.packageValue,
        signType: 'MD5', //微信签名方式：
        paySign: data.paySign //微信签名
      },
      function(res) {
        if (res.err_msg == 'get_brand_wcpay_request:ok') {
          Func.GetUserMoney().then(data => {
            if (data.Code === 1) {
              Msg.show('支付成功');
              this.moneyLabel.string = data.Model;
            }
          });
        } // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
      }
    );
  },

  paymoney(e) {
    let self = this;
    Func.UserRecharge(1, 1, this.setType(Number(e.currentTarget._name.substring(3)))).then(data => {
      if (data.appId !== '') {
        if (typeof WeixinJSBridge == 'undefined') {
          if (document.addEventListener) {
            document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
          } else if (document.attachEvent) {
            document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
            document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
          }
        } else {
          self.onBridgeReady(data);
        }
      } else {
        Msg.show(data.msg);
      }
    });
  },
  setType(n) {
    let self = this;
    let num = 1;
    switch (n) {
      case 1:
        num = 1;
        break;
      case 2:
        num = 58;
        break;
      case 3:
        num = 108;
        break;
      case 4:
        num = 208;
        break;
      case 5:
        num = 1888;
        break;
    }
    return num;
  },
  paySelfMoney() {
    let self = this;
    let input = cc.find('bg/container/div_input/input', this.node).getComponent(cc.EditBox);
    console.log(Number(input.string));
    Func.UserRecharge(1, 1, Number(input.string)).then(data => {
      if (data.appId !== '') {
        if (typeof WeixinJSBridge == 'undefined') {
          if (document.addEventListener) {
            document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
          } else if (document.attachEvent) {
            document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
            document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
          }
        } else {
          self.onBridgeReady(data);
        }
      } else {
        Msg.show(data.msg);
      }
    });
  },
  start() {}

  // update (dt) {},
});
