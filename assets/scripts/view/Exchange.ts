/*
 * @Author: your name
 * @Date: 2021-09-16 21:37:46
 * @LastEditTime: 2021-09-25 18:05:09
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
import Game from "./Game";

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
        // if (GameData.getInstance().payPoint > 0 && GameData.getInstance().soliderType == 0) {
        //     GameData.getInstance().soliderType = Math.ceil(Math.random() * 3);
        // }
        this.ownedTxt.string = "???????????????????????????:{0}".format(GameData.getInstance().point);
        this.payTxt.string = "????????????????????????:{0}".format(GameData.getInstance().payPoint);
        this.poolTxt.string = "??????????????????:{0} T5??????".format(GameData.getInstance().todayPool / 10);
        let lv = GameData.getInstance().soliderLv;
        this.leftTxt.string = "(??????{0}?????????????????????)".format(GameConfig.getInstance().maxPoint2Lv[lv] - GameData.getInstance().payPoint);

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
                this.soliderTypeName.string = "??????";
                break;
            case 2:
                this.soliderTypeName.string = "??????";
                break
            case 3:
                this.soliderTypeName.string = "??????";
                break
        }
        this.exchangedNumTitle.string = "???????????????T5 {0}:".format(this.soliderTypeName.string);
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
            UI.getInstance().showFloatMsg("??????????????????????????????");
            UI.getInstance().showUI("Person");
            return;
        }

        if (GameData.getInstance().soliderType == 0) {
            if (this.selectType == 0) {
                UI.getInstance().showFloatMsg("????????????????????????");
                return
            }
            LogicMgr.getInstance().setSoliderType(function () {
                GameData.getInstance().soliderType = this.selectType;
                Storage.getInstance().saveGameData();
                this.onShow();
                this.doExchage();
            }.bind(this))
        }
        else {
            this.doExchage();
        }
    }

    /**
     * @description: ????????????
     * @param {*}
     * @return {*}
     */
    doExchage() {
        if (GameData.getInstance().point <= 0) {
            UI.getInstance().showFloatMsg("??????????????????");
            return;
        }
        LogicMgr.getInstance().exchangeSolider(
            GameData.getInstance().point,
            function (data) {
                let obj = data.data;
                console.log(obj)
                if (obj.errCode) {
                    switch (obj.errCode) {
                        case -1:
                            UI.getInstance().showFloatMsg("???????????????");
                            break;
                        case -2:
                            UI.getInstance().showFloatMsg("????????????");
                            break;
                        case -3:
                            UI.getInstance().showFloatMsg("???????????????????????????");
                            break;
                        case -4:
                            UI.getInstance().showFloatMsg("?????????????????????");
                            break;
                        case -5:
                            UI.getInstance().showFloatMsg("????????????????????????");
                            break;
                        case -6:
                            UI.getInstance().showFloatMsg("??????????????????");
                            break;

                        default:
                            UI.getInstance().showFloatMsg("????????????");
                            break;
                    }
                    console.log("??????????????????:" + obj.errCode)
                    return;
                }
                GameData.getInstance().payPoint += obj.exchangeTroops;
                GameData.getInstance().point = obj.userRestTroops;
                Storage.getInstance().saveGameData();
                UI.getInstance().showFloatMsg("????????????{0} T5??????".format(obj.exchangeTroops * GameConfig.getInstance().troops2lv[4]));
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
