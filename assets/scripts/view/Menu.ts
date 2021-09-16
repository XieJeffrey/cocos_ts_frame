/*
 * @Author: your name
 * @Date: 2021-08-24 15:40:48
 * @LastEditTime: 2021-09-16 21:51:46
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
import { BgmType, SoundType } from "../common/BaseType";
import Tool from "../common/Tool";
import GameConfig from "../config/GameConfig";
import GameData from "../data/GameData";
import Sound from "../module/Sound";
import UI from "../module/UI";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Menu extends IView {
    soliderSpriteList: Array<cc.SpriteFrame> = new Array<cc.SpriteFrame>();
    rankBtn: cc.Node;
    rankTip: cc.Node;
    startBtn: cc.Node;
    downloadBtn: cc.Node;
    infoBtn: cc.Node;
    lvUpBtn: cc.Node;
    soliderLvTxt: cc.Label;
    soliderIcon: cc.Sprite;
    exchangeBtn: cc.Node;
    anima: sp.Skeleton;
    pointTxt: cc.Label;

    onLoad() {
        this.rankBtn = this.node.findChild('rank');
        this.infoBtn = this.node.findChild('info');
        this.startBtn = this.node.findChild('start');
        this.downloadBtn = this.node.findChild('download');
        this.exchangeBtn = this.node.findChild('exchange/btn');
        this.lvUpBtn = this.node.findChild('solider')
        this.soliderLvTxt = this.node.findChild('solider/lv').getComponent(cc.Label);
        this.soliderIcon = this.node.findChild('solider/icon').getComponent(cc.Sprite);
        this.pointTxt = this.node.findChild('exchange/point').getComponent(cc.Label);
        this.loadSoliderSprite();
        super.onLoad();
    }

    register() {
        console.log("register");
        this.rankBtn.on('click', this.onClickRank, this)
        this.infoBtn.on('click', this.onClickInfo, this)
        this.startBtn.on('click', this.onClickStart, this)
        this.downloadBtn.on('click', this.onClickDown, this)
        this.exchangeBtn.on('click', this.onClickExchange, this)
    }

    onShow() {
        this.lvUpBtn.playBreathAnima();
        this.rankBtnEft();
        this.refreshSolider();
        this.refreshPoint();
        Sound.getInstance().playBgm(BgmType.MenuBgm);
        if (this.anima == null) {
            this.anima = new cc.Node('anima').addComponent(sp.Skeleton);
            this.node.addChild(this.anima.node);
            this.anima.node.setSiblingIndex(1);//仅高于背景层
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
    }

    onHide() { }

    /**
     * @description:刷新士兵图标
     * @param {*}
     * @return {*}
     */
    refreshSolider() {
        if (this.soliderSpriteList.length == 0)
            return;

        this.soliderIcon.spriteFrame = this.soliderSpriteList[GameData.getInstance().soliderLv];
    }

    /**
     * @description: 刷新积分
     * @param {*}
     * @return {*}
     */
    refreshPoint() {
        this.pointTxt.string = "积分 " + GameData.getInstance().point;
    }

    /**
     * @description: 加载5级士兵的资源
     * @param {*}
     * @return {*}
     */
    loadSoliderSprite() {
        cc.resources.loadDir('solider', cc.SpriteFrame, function (err, asset: Array<cc.Sprite>) {
            if (err) {
                console.error(err);
                return;
            }
            for (let i = 0; i < asset.length; i++) {
                this.soliderSpriteList.push(asset[i]);
            }
        }.bind(this))
    }

    onClickStart() {
        //  UI.getInstance().showUI("Result",true);
        Sound.getInstance().playSound(SoundType.Click);
        UI.getInstance().hideUI("Menu");
        UI.getInstance().showLoading(1, function () {
            UI.getInstance().showUI("game");
        }.bind(this))
    }

    onClickDown() {
        Sound.getInstance().playSound(SoundType.Click);
        UI.getInstance().showFloatMsg("开始下载");
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
        Sound.getInstance().playSound(SoundType.Click);
    }

    onClickExchange() {
        console.log("打开兑换界面");
    }

    rankBtnEft() {
        let tip = this.rankBtn.findChild('tip')
        tip.stopAllActions();
        tip.runAction(cc.repeatForever(cc.sequence(
            cc.scaleTo(0, 0),
            cc.scaleTo(0.5, -1, 1).easing(cc.easeBackOut()),
            cc.scaleTo(0.5, -1, 1),
            cc.scaleTo(0.5, 0),
            cc.scaleTo(2, 0)
        )))
    }
}
