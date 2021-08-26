/*
 * @Author: your name
 * @Date: 2021-08-24 15:40:48
 * @LastEditTime: 2021-08-26 14:51:23
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
    shareBtn: cc.Node;
    rankBtn: cc.Node;
    startBtn: cc.Node;
    downloadBtn: cc.Node;
    infoBtn: cc.Node;
    exchangeBtn: cc.Node;
    soliderNumTxt: cc.Node;
    endlessRecordTxt: cc.Label;
    soliderIcon: cc.Sprite;
    soliderLvUpBtn: cc.Node;


    onLoad() {
        this.shareBtn = this.node.findChild('share');
        this.rankBtn = this.node.findChild('rank');
        this.infoBtn = this.node.findChild('info');
        this.startBtn = this.node.findChild('start');
        this.downloadBtn = this.node.findChild('download');
        this.exchangeBtn = this.node.findChild('exchange');
        this.soliderNumTxt = this.exchangeBtn.findChild('txt').getComponent(cc.Label);
        this.endlessRecordTxt = this.node.findChild('record/txt').getComponent(cc.Label);
        this.soliderIcon = this.node.findChild('solider/icon').getComponent(cc.Sprite);
        this.soliderLvUpBtn = this.node.findChild('solider/lvUp')
        this.loadSoliderSprite();
        super.onLoad();
    }

    register() {
        console.log("register");
        this.shareBtn.on('click', this.onClickShare, this)
        this.rankBtn.on('click', this.onClickRank, this)
        this.infoBtn.on('click', this.onClickInfo, this)
        this.startBtn.on('click', this.onClickStart, this)
        this.downloadBtn.on('click', this.onClickDown, this)
        this.exchangeBtn.on('click', this.onClickExchange, this)
        this.soliderLvUpBtn.on('click', this.onClickLvUp, this)
    }

    onShow() {
        this.refreshSolider();
        this.refreshRecord();
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

        this.soliderIcon.spriteFrame = this.soliderSpriteList[GameData.soliderLv];
    }

    refreshRecord() {
        if (GameData.endlessRecord == 0)
            this.endlessRecordTxt.node.parent.active = false;
        else {
            this.endlessRecordTxt.node.parent.active = true;
            this.endlessRecordTxt.string = Tool.getInstance().sec2mmss(GameData.endlessRecord);
        }
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
        UI.getInstance().showUI("problem")
    }

    onClickDown() { }

    onClickRank() { }

    onClickInfo() { }

    onClickShare() { }

    onClickLvUp() { }

    onClickExchange() { }
}
