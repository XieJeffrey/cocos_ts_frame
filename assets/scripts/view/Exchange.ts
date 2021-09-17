/*
 * @Author: your name
 * @Date: 2021-09-16 21:37:46
 * @LastEditTime: 2021-09-17 10:03:16
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
import { SoundType } from "../common/BaseType";
import UserData from "../data/UserData";
import LogicMgr from "../manager/LogicMgr";
import Storage from "../module/Storage";
import GameConfig from "../config/GameConfig";

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
        this.exchangedNum = this.exchangePanel.findChild('done/txt').getComponent(cc.Label);

        super.onLoad();
    }

    register() {
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

        this.selectPanel.active = GameData.getInstance().soliderType == 0;
        this.exchangePanel.active = GameData.getInstance().soliderType != 0;
        this.exchangeBtn.active = true;

        if (this.selectPanel.active)
            this.refreshSelectPanel();

        if (this.exchangePanel.active)
            this.refreshExchangePanel();
    }

    refreshSelectPanel() {
        this.payTxt.node.active = false;
        let troopsNum = GameData.getInstance().point * GameConfig.getInstance().troops2lv[GameData.getInstance().soliderLv];
        for (let i = 1; i <= 3; i++) {
            this.toggleTypeNode.findChild('' + i + "/mark/txt").getComponent(cc.Label).string = "T{0}:{1}".format(GameData.getInstance().soliderLv, troopsNum);
        }
    }

    refreshExchangePanel() { }

    onHide() { }

    onClose() {
        UI.getInstance().hideUI("Exchange");
    }

    onExchange() {
        if (UserData.getInstance().GameID == "") {
            UI.getInstance().showFloatMsg("请先完善游戏关联账号");
            UI.getInstance().showUI("Person");
            return;
        }

        if (GameData.getInstance().soliderType == 0) {
            UI.getInstance().showFloatMsg("请先选择兑换兵种");
            return
        }

        if (GameData.getInstance().point <= 0) {
            UI.getInstance().showFloatMsg("兑换积分不足");
            return;
        }

        LogicMgr.getInstance().exchangeSolider(
            GameData.getInstance().soliderLv,
            GameData.getInstance().point,
            function (data) {
                let obj = JSON.parse(data);
                if (typeof obj.errCode == "undefined") {
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
                    return
                }
                GameData.getInstance().payPoint = GameData.getInstance().point - obj.restTroops;
                GameData.getInstance().point = obj.restTroops;
                Storage.getInstance().saveGameData();
                UI.getInstance().showFloatMsg("成功兑换{0}T{1}兵力".format(obj.number, obj.level))
                this.onShow();
            }.bind(this)
        )
        //todo
    }

    onSelect(event) {
        Sound.getInstance().playSound(SoundType.AnswerSelect);
        let idx: number = parseInt(event.node.name);
        if (event.isChecked)
            GameData.getInstance().soliderType = idx;
        else
            this.toggleTypeNode.findChild('idx').getComponent(cc.Toggle).check();
    }



}
