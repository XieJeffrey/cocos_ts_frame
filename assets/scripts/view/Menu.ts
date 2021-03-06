/*
 * @Author: your name
 * @Date: 2021-08-24 15:40:48
 * @LastEditTime: 2021-09-26 00:34:16
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \cocos_ts_frame\assets\scripts\view\menu.ts
 */
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { IView } from "../base/IView";
import { BgmType, EventType, SoundType } from "../common/BaseType";
import GameData from "../data/GameData";
import UserData from "../data/UserData";
import LogicMgr from "../manager/LogicMgr";
import Event from "../module/Event";
import Res from "../module/Res";
import Sound from "../module/Sound";
import Storage from "../module/Storage";
import UI from "../module/UI";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Menu extends IView {
    rankBtn: cc.Node;
    rankTip: cc.Node;
    startBtn: cc.Node;
    infoBtn: cc.Node;
    lvUpBtn: cc.Node;
    soliderLvTxt: cc.Label;
    soliderIcon: cc.Sprite;
    exchangeBtn: cc.Node;
    anima: sp.Skeleton;
    pointTxt: cc.Label;
    recordTxt: cc.Label;
    checkLvUp: boolean = false;
    ruleBtn: cc.Node;

    onLoad() {
        this.rankBtn = this.node.findChild('rank');
        this.infoBtn = this.node.findChild('info');
        this.startBtn = this.node.findChild('start');
        this.ruleBtn = this.node.findChild('rule');
        this.exchangeBtn = this.node.findChild('exchange/btn');
        this.lvUpBtn = this.node.findChild('solider')
        this.soliderLvTxt = this.node.findChild('solider/lv').getComponent(cc.Label);
        this.soliderIcon = this.node.findChild('solider/icon').getComponent(cc.Sprite);
        this.pointTxt = this.node.findChild('exchange/point').getComponent(cc.Label);
        this.recordTxt = this.node.findChild('record/txt').getComponent(cc.Label);
        super.onLoad();
    }

    register() {
        this.rankBtn.on('click', this.onClickRank, this)
        this.infoBtn.on('click', this.onClickInfo, this)
        this.startBtn.on('click', this.onClickStart, this)
        this.exchangeBtn.on('click', this.onClickExchange, this)
        this.lvUpBtn.on('click', this.onClickLvUp, this)
        this.ruleBtn.on('click', this.onClickRule, this)
        this.node.findChild('exchange').on('click', function () {
            // Storage.getInstance().clearAll();
            // UI.getInstance().showFloatMsg("???????????????????????????????????????")
        }, this)

        Event.getInstance().on(EventType.LvUp, this.node, function () { UI.getInstance().showUI("Reward"); this.refreshSolider() }.bind(this));
        Event.getInstance().on(EventType.RefreshPoint, this.node, function () { this.refreshPoint() }.bind(this));
    }

    onShow() {
        this.lvUpBtn.playBreathAnima();
        this.soliderBtnEft();
        this.refreshSolider();
        this.refreshPoint();
        this.refreshRecord();
        Sound.getInstance().playBgm(BgmType.MenuBgm);
        if (this.checkLvUp == false) {
            this.checkInviteParam();
            this.checkLvUp = true;
        }

        if (this.anima == null) {
            this.anima = new cc.Node('anima').addComponent(sp.Skeleton);
            this.node.addChild(this.anima.node);
            this.anima.node.setSiblingIndex(1);//??????????????????
            this.anima.node.scale = 0.8;
            this.anima.node.setPosition(0, -145);
            this.anima.node.active = true;
            cc.resources.load("skeleton/start/cc-start-zhan", sp.SkeletonData, function (err, res: sp.SkeletonData) {
                if (err) {
                    console.error(err)
                    return;
                }
                this.anima.skeletonData = res;
                this.anima.premultipliedAlpha = false;
                this.anima.setAnimation(0, "animation", true);
            }.bind(this))
        }

        setTimeout(function () {
            if (GameData.getInstance().rewardToShow) {
                UI.getInstance().showUI("Reward")
                GameData.getInstance().rewardToShow = false;
            }
        }.bind(this), 800)

        // UI.getInstance().showUI("Reward")
    }

    onHide() { }

    /**
     * @description:??????????????????
     * @param {*}
     * @return {*}
     */
    refreshSolider() {
        this.soliderIcon.spriteFrame = Res.getInstance().soliderIcon[GameData.getInstance().soliderLv];
        this.soliderLvTxt.string = "Lv {0}".format(GameData.getInstance().soliderLv + 1);
    }

    /**
     * @description: ????????????
     * @param {*}
     * @return {*}
     */
    refreshPoint() {
        this.pointTxt.string = "??????  " + GameData.getInstance().point;
    }

    /**
     * @description: ??????????????????
     * @param {*}
     * @return {*}
     */
    refreshRecord() {
        this.recordTxt.string = "????????????: " + GameData.getInstance().maxSoliderNum;
    }

    onClickStart() {
        if (GameData.getInstance().isActiviyOpen == false) {
            UI.getInstance().showFloatMsg("???????????????")
            return;
        }
        //  UI.getInstance().showUI("Result",true);
        Sound.getInstance().playSound(SoundType.Click);
        UI.getInstance().hideUI("Menu");
        UI.getInstance().showLoading(1, function () {
            UI.getInstance().showUI("game");
        }.bind(this))
    }

    onClickDown() {
        Sound.getInstance().playSound(SoundType.Click);
        LogicMgr.getInstance().downloadGame();
    }

    onClickRank() {
        Sound.getInstance().playSound(SoundType.Click);
        UI.getInstance().showUI("Rank");
    }

    onClickInfo() {
        Sound.getInstance().playSound(SoundType.Click);
        UI.getInstance().showUI("Person");
    }

    onClickLvUp() {
        if (UserData.getInstance().GameID == "") {
            UI.getInstance().showFloatMsg("????????????????????????");
            UI.getInstance().showUI("Person");
            return;
        }
        LogicMgr.getInstance().shareLvup();
        Sound.getInstance().playSound(SoundType.Click);
    }

    onClickRule() {
        Sound.getInstance().playSound(SoundType.Click);
        UI.getInstance().showUI("Rule");
    }

    onClickExchange() {
        if (GameData.getInstance().isExchangeOpen == false) {
            UI.getInstance().showFloatMsg("???????????????")
            return;
        }
        console.log("??????????????????");
        Sound.getInstance().playSound(SoundType.Click);
        UI.getInstance().showUI("Exchange");
    }

    soliderBtnEft() {
        let tip = this.rankBtn.findChild('tip')
        tip.stopAllActions();
        tip.runAction(cc.repeatForever(cc.sequence(
            cc.scaleTo(0, 0),
            cc.scaleTo(0.5, 1, 1).easing(cc.easeBackOut()),
            cc.scaleTo(0.5, 1, 1),
            cc.scaleTo(0.5, 0),
            cc.scaleTo(2, 0)
        )))
    }

    /**
     * @description: ????????????????????????
     * @param {*}
     * @return {*}
     */
    checkInviteParam() {
        // GameData.getInstance().launchData = {
        //     cmd: 1,
        //     lv: 1,
        //     inviter: "123456"
        // }
        if (GameData.getInstance().launchData != null) {
            LogicMgr.getInstance().invite(GameData.getInstance().launchData.inviter);
        }
    }
}
