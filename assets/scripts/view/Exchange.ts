/*
 * @Author: your name
 * @Date: 2021-09-16 21:37:46
 * @LastEditTime: 2021-09-24 23:34:51
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \cocos_ts_frame\assets\scripts\view\Exchange.ts
 */
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { IView } from "../base/IView";
import UI from "../module/UI";
import GameData from "../data/GameData";
import Sound from "../module/Sound";
import { EventType, SoundType } from "../common/BaseType";
import UserData from "../data/UserData";
import LogicMgr from "../manager/LogicMgr";
import Storage from "../module/Storage";
import GameConfig from "../config/GameConfig";
import Event from "../module/Event";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Exchange extends IView {
    closeBtn: cc.Node;
    ownedTxt: cc.Label;
    payTxt: cc.Label;
    selectPanel: cc.Node;
    toggleTypeNode: cc.Node;
    exchangePanel: cc.Node;
    exchangeBtn: cc.Node;

    soliderImg: cc.Sprite;
    soliderTypeName: cc.Label;
    soliderNumTxt: cc.Label;
    GameIDTxt: cc.Label;
    exchangedNum: cc.Label;
    exchangedNumTitle: cc.Label;
    poolTxt: cc.Label;
    leftTxt: cc.Label;
    downBtn: cc.Node;

    selectType: number = 0;
    toggleArray: Array<cc.Toggle> = null;

    onLoad() {
        this.closeBtn = this.node.findChild('decorate/close');
        this.ownedTxt = this.node.findChild("point/owned").getComponent(cc.Label);
        this.payTxt = this.node.findChild('point/pay').getComponent(cc.Label);
        this.selectPanel = this.node.findChild('select');
        this.exchangePanel = this.node.findChild('exchange');
        this.exchangeBtn = this.node.findChild('exchangeBtn');

        this.soliderImg = this.exchangePanel.findChild('item/img').getComponent(cc.Sprite);
        this.soliderNumTxt = this.exchangePanel.findChild('item/mark/txt').getComponent(cc.Label);
        this.soliderTypeName = this.exchangePanel.findChild('item/txt').getComponent(cc.Label);
        this.GameIDTxt = this.exchangePanel.findChild('Id/txt').getComponent(cc.Label);
        this.exchangedNumTitle = this.exchangePanel.findChild('done').getComponent(cc.Label);
        this.exchangedNum = this.exchangePanel.findChild('done/txt').getComponent(cc.Label);
        this.downBtn = this.node.findChild('download')

        this.poolTxt = this.node.findChild('poolTxt').getComponent(cc.Label);
        this.leftTxt = this.node.findChild('point/pay/left').getComponent(cc.Label);

        super.onLoad();
    }

    register() {
        this.downBtn.on('click', this.onDownLoad, this);
        this.exchangeBtn.on('click', this.onExchange, this);
        this.closeBtn.on('click', this.onClose, this);
        this.toggleTypeNode = this.node.findChild('select/toggle');
        for (let i = 1; i <= 3; i++) {
            this.toggleTypeNode.findChild('' + i).on('toggle', this.onSelect, this);
        }
    }

    onShow() {
        this.ownedTxt.string = "你当前可兑换积分有:{0}".format(GameData.getInstance().point);
        this.payTxt.string = "你已成功兑换积分:{0}".format(GameData.getInstance().payPoint);
        this.poolTxt.string = "兑换奖池还剩:{0} T5士兵".format(GameData.getInstance().todayPool / 10);
        let lv = GameData.getInstance().soliderLv;
        this.leftTxt.string = "(还剩{0}积分额度可兑换)".format(GameConfig.getInstance().maxPoint2Lv[lv] - GameData.getInstance().payPoint);

        this.selectPanel.active = GameData.getInstance().soliderType == 0;
        this.exchangePanel.active = GameData.getInstance().soliderType != 0;
        this.exchangeBtn.active = true;
        this.selectType = GameData.getInstance().soliderType;
        if (this.selectPanel.active)
            this.refreshSelectPanel();

        if (this.exchangePanel.active)
            this.refreshExchangePanel();
    }

    refreshSelectPanel() {
        this.payTxt.node.active = false;
        let lv = 4;
        let troopsNum = GameData.getInstance().point * GameConfig.getInstance().troops2lv[4];
        for (let i = 1; i <= 3; i++) {
            this.toggleTypeNode.findChild('' + i + "/mark/txt").getComponent(cc.Label).string = "T5:{1}".format(GameData.getInstance().soliderLv + 1, troopsNum);
            if (i != this.selectType)
                this.toggleTypeNode.findChild('' + i).getComponent(cc.Toggle).uncheck();
            else
                this.toggleTypeNode.findChild('' + i).getComponent(cc.Toggle).check();
        };

    }

    refreshExchangePanel() {
        this.payTxt.node.active = true;
        //  console.log(UserData.getInstance().GameID);
        this.GameIDTxt.string = UserData.getInstance().GameID;
        this.exchangedNum.string = "" + GameData.getInstance().payPoint * GameConfig.getInstance().troops2lv[4];
        this.soliderImg.spriteFrame = this.toggleTypeNode.findChild('' + GameData.getInstance().soliderType + "/img").getComponent(cc.Sprite).spriteFrame;
        switch (GameData.getInstance().soliderType) {
            case 1:
                this.soliderTypeName.string = "步兵";
                break;
            case 2:
                this.soliderTypeName.string = "弓兵";
                break
            case 3:
                this.soliderTypeName.string = "骑兵";
                break
        }
        this.exchangedNumTitle.string = "已成功兑换T5 {0}:".format(this.soliderTypeName.string);
        let lv = 4
        this.soliderNumTxt.string = "T{0}:{1}".format(lv + 1, GameData.getInstance().point * GameConfig.getInstance().troops2lv[lv])
    }

    onHide() { }

    onClose() {
        UI.getInstance().hideUI("Exchange");
    }

    onExchange() {
        console.log("doExchange")
        if (UserData.getInstance().GameID == "") {
            UI.getInstance().showFloatMsg("请先完善游戏关联账号");
            UI.getInstance().showUI("Person");
            return;
        }

        if (this.selectType == 0) {
            UI.getInstance().showFloatMsg("请先选择兑换兵种");
            return
        }

        if (GameData.getInstance().point <= 0) {
            UI.getInstance().showFloatMsg("兑换积分不足");
            return;
        }
        if (GameData.getInstance().soliderType == 0) {
            GameData.getInstance().soliderType = this.selectType;
            LogicMgr.getInstance().setSoliderType(function () {
                this.doExchage();
            }.bind(this))
        }
        else {
            this.doExchage();
        }
    }

    /**
     * @description: 执行交换
     * @param {*}
     * @return {*}
     */
    doExchage() {
        LogicMgr.getInstance().exchangeSolider(
            GameData.getInstance().point,
            function (data) {
                let obj = data.data;
                console.log(obj)
                if (obj.errCode) {
                    switch (obj.errCode) {
                        case -1:
                            UI.getInstance().showFloatMsg("用户不存在");
                            break;
                        case -2:
                            UI.getInstance().showFloatMsg("积分不足");
                            break;
                        case -3:
                            UI.getInstance().showFloatMsg("达到最大兑换兵力数");
                            break;
                        case -4:
                            UI.getInstance().showFloatMsg("今日兑换池已空");
                            break;
                        case -5:
                            UI.getInstance().showFloatMsg("总兑换兵力池已空");
                            break;
                        case -6:
                            UI.getInstance().showFloatMsg("兑换比例不对");
                            break;

                        default:
                            UI.getInstance().showFloatMsg("未知错误");
                            break;
                    }
                    console.log("兑换兵力出错:" + obj.errCode)
                    return;
                }
                GameData.getInstance().payPoint += obj.exchangeTroops;
                GameData.getInstance().point = obj.userRestTroops;
                Storage.getInstance().saveGameData();
                UI.getInstance().showFloatMsg("成功兑换{0} T5兵力".format(obj.exchangeTroops * GameConfig.getInstance().troops2lv[4]));
                this.onShow();
                LogicMgr.getInstance().initExchangeStae().then(function () {
                    this.onShow();
                }.bind(this))
                Event.getInstance().emit(EventType.RefreshPoint, {})
            }.bind(this)
        )
    }

    onSelect(event) {
        Sound.getInstance().playSound(SoundType.AnswerSelect);
        let idx: number = parseInt(event.node.name);
        if (event.isChecked)
            this.selectType = idx;
        else
            this.toggleTypeNode.findChild('' + idx).getComponent(cc.Toggle).check();

        // if (GameData.getInstance().soliderType == 0 && UserData.getInstance().GameID != "") {
        //     GameData.getInstance().soliderType = this.selectType;
        //     LogicMgr.getInstance().setSoliderType(null);
        // }
    }

    onDownLoad() {
        LogicMgr.getInstance().downloadGame();
    }
}
