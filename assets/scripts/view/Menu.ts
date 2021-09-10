/*
 * @Author: your name
 * @Date: 2021-08-24 15:40:48
 * @LastEditTime: 2021-09-10 16:13:11
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
import Tool from "../common/Tool";
import GameData from "../data/GameData";
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

    onLoad() {
        this.rankBtn = this.node.findChild('rank');
        this.infoBtn = this.node.findChild('info');
        this.startBtn = this.node.findChild('start');
        this.downloadBtn = this.node.findChild('download');
        this.exchangeBtn = this.node.findChild('exchange/btn');
        this.lvUpBtn = this.node.findChild('solider')
        this.soliderLvTxt = this.node.findChild('solider/lv').getComponent(cc.Label);
        this.soliderIcon = this.node.findChild('solider/icon').getComponent(cc.Sprite);
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
        this.refreshSolider();
        if (this.anima == null) {
            this.anima = new cc.Node('anima').addComponent(sp.Skeleton);
            this.node.addChild(this.anima.node);
            this.anima.node.setSiblingIndex(1);//仅高于背景层
            this.anima.node.setPosition(0, -135);
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
        UI.getInstance().showLoading(1, function () {
            UI.getInstance().showUI("game");
        }.bind(this))
    }

    onClickDown() {
        UI.getInstance().showFloatMsg("开始下载");
    }

    onClickRank() {
        UI.getInstance().showUI("Rank");
    }

    onClickInfo() {
        UI.getInstance().showUI("Person");
    }

    onClickLvUp() { }

    onClickExchange() { }

    lvUpBtnEfc() {

        this.lvUpBtn.stopAllActions();
        this.lvUpBtn.runAction(cc.repeatForever(
            cc.sequence(
                cc.scaleTo(0.2, 1.1)
            )
        ))
    }
}
