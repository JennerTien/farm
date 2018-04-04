var Data = require("Data");
var Func = Data.func;

cc.Class({
  extends: cc.Component,

  properties: {
    target: {
      default: null,
      type: cc.Prefab
    },
    goods_Prefab: {
      default: null,
      type: cc.Prefab
    },
    pageIndex: 1,
    hasLoad: 1,
    pageCount: 9,
    WholeCount: 0
  },

  onLoad() {
    var self = this;
    self.getInitIndicator(0, 9);
  },
  getList(index, size) {
    self = this;
    Func.GetPointGoodList(index + 1, size).then(data => {
      self.dataFetch(index, size, data);
    });
  },
  //数据渲染
  dataFetch(index, size, data) {
    var self = this;
    const goodsList = data.List;
    let box = cc.find("bg/PageView/view/content", this.node);
    let goodsListNode = cc.find("page_" + index + "/goodsList", box);
    for (let i = 0; i < goodsList.length; i++) {
      const goods = goodsList[i];
      if (!goods.IsDelete) {
        let goodsNode = cc.instantiate(this.goods_Prefab);
        // goodsNode.name = goods.PropName;
        let goodSprite = cc.find("pic-box/pic", goodsNode).getComponent(cc.Sprite);
        let goodsLabel = cc.find("price-box/goods_label", goodsNode).getComponent(cc.Label);
        let priceLabel = cc.find("price-box/bg-price/price", goodsNode).getComponent(cc.Label);
        let count = 1;
        self.selectIcon(goods.PropertyTypeID, goodSprite);
        cc.find("pic-box/pic", goodsNode).getComponent(cc.Widget).bottom = 0;
        goodsLabel.string = goods.PropName + "x" + count;
        priceLabel.string = goods.PropValue * count;
        goodsListNode.addChild(goodsNode);
        goodsNode.on("click", event => {
          //   Alert.show("0", null, null, null, null, null, "Prefab/Sell", function() {
          //     let selfAlert = this;
          //     cc.loader.loadRes(Alert._newPrefabUrl, cc.Prefab, function(error, prefab) {
          //       if (error) {
          //         cc.error(error);
          //         return;
          //       }
          //       // 实例
          //       let alert = cc.instantiate(prefab);
          //       Alert._alert = alert;
          //       //动画
          //       selfAlert.ready();
          //       Alert._alert.parent = cc.find("Canvas");
          //       selfAlert.startFadeIn();
          //       // 关闭按钮
          //       selfAlert.newButtonEvent(alert, "bg/btn-group/cancelButton");
          //       self.P2PBuyData(alert, goods);
          //     });
          //   });
          Msg.show("功能测试中");
        });
      }
    }
  },
  selectIcon(id, goodSprite, isSystemShop) {
    let iconSrc, iconSrc2;
    switch (id) {
      case 1: //可以孵化的蛋
        iconSrc = "Shop/icon-egg";
        iconSrc2 = "Shop/icon-egg_";

        break;
      case 3: //成熟的肉鸡
        iconSrc = "Shop/icon-asset04";
        iconSrc2 = "Shop/guifeiji_";
        break;
      case 4: //饲料
        iconSrc = "Shop/icon-1";
        iconSrc2 = "Shop/icon-1_";
        break;
      case 6: //种子
        iconSrc = "Shop/icon-egg";
        iconSrc2 = "Shop/icon-egg_";
        break;
      case 7: //普通肥料
        iconSrc = "Shop/icon-egg";
        iconSrc2 = "Shop/icon-egg_";
        break;
      case 8: //粪便
        iconSrc = "Shop/icon-egg";
        iconSrc2 = "Shop/icon-egg_";
        break;
      case 9: //超级肥料
        iconSrc = "Shop/icon-egg";
        iconSrc2 = "Shop/icon-egg_";
        break;
      case 10: //高级肥料
        iconSrc = "Shop/icon-egg";
        iconSrc2 = "Shop/icon-egg_";
        break;
      case 11: //超级饲料
        iconSrc = "Shop/icon-egg";
        iconSrc2 = "Shop/icon-egg_";
        break;
      case 12: //自动清洁机
        iconSrc = "Shop/icon-bot";
        iconSrc2 = "Shop/icon-bot";
        break;
      case 13: //产蛋鸡
        iconSrc = "Shop/icon-asset04";
        iconSrc2 = "Shop/guifeiji_";
        break;
      case 14: //改名卡
        iconSrc = "Shop/icon-name";
        iconSrc2 = "Shop/icon-name_";
        break;
      default: {
        iconSrc = "Shop/icon-1";
        iconSrc2 = "Shop/icon-1_";
      }
    }
    if (isSystemShop) {
      cc.loader.loadRes(iconSrc2, cc.SpriteFrame, function(err, spriteFrame) {
        goodSprite.spriteFrame = spriteFrame;
      });
    } else {
      cc.loader.loadRes(iconSrc, cc.SpriteFrame, function(err, spriteFrame) {
        goodSprite.spriteFrame = spriteFrame;
      });
    }
  },
  //购买商品模态框数据绑定
  P2PBuyData(obj, data) {
    var self = this;
    //初始总价
    let sumMoney = cc.find("bg/money/value", obj).getComponent(cc.Label);
    let editBox = cc.find("bg/input", obj);
    let value = cc.find("bg/money/value", obj);
    let confirm = cc.find("bg/btn-group/enterButton", obj);
    let valueComp = cc.find("bg/money/value", obj).getComponent(cc.Label);
    let icon = cc.find("guifeiji", obj).getComponent(cc.Sprite);
    let title = cc.find("bg/name", obj).getComponent(cc.Label);
    let goodSprite = cc.find("guifeiji", obj).getComponent(cc.Sprite);
    let count = 1;
    self.selectIcon(data.PropertyTypeID, goodSprite, 1);
    title.string = data.PropName;
    valueComp.string = data.PropValue;
    //绑定input变化事件
    editBox.on("text-changed", () => {
      count = Number(editBox.getComponent(cc.EditBox).string);
      valueComp.string = data.PropValue * count;
    });
    //商品购买事件
    confirm.on("click", () => {
      Func.PostBuy(data.ID, count).then(data => {
        if (data.Code === 1) {
          Msg.show("购买成功");
          setTimeout(function() {
            cc.director.loadScene("shop");
          }, 1000);
        } else {
          Msg.show(data.Message);
        }
      });
    });
  },
  //初始化轮播导航
  getInitIndicator(index, size) {
    var self = this;
    Func.GetPointGoodList(index + 1, size).then(data => {
      self.WholeCount = data.RecordCount;
      let box = cc.find("bg/PageView/view/content", this.node);
      let boxTemp = cc.find("bg/PageView", this.node).getComponent(cc.PageView); //获取pageView组件
      for (let i = 0; i < Math.ceil(self.WholeCount / self.pageCount); i++) {
        let clone = cc.instantiate(this.target);
        clone._name = "page_" + i;

        boxTemp.addPage(clone); //动态添加页面
      }
      self.dataFetch(index, size, data);
      boxTemp.node.on("page-turning", function() {
        let goodsListNode = cc.find("page_" + boxTemp.getCurrentPageIndex(), box);
        let indexNum = boxTemp.getCurrentPageIndex();
        let diff = indexNum - self.hasLoad;
        if (diff == 0) {
          self.hasLoad++;
          self.getList(indexNum, 9);
        }
      });
      //新手指引
      if (Config.firstLogin) GuideSystem.guide();
    });
  },

  backEvent() {
    cc.director.preloadScene("index", function() {
      cc.director.loadScene("index");
    });
  },
  gotoPageShopP2P() {
    cc.director.loadScene("shopP2P");
  },
  gotoPageShop() {
    cc.director.loadScene("shop");
  },
  start() {
    // 新手指引
  }

  // update (dt) {},
});
