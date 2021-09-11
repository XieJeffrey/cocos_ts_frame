/*
 * @Author: your name
 * @Date: 2021-09-03 15:17:51
 * @LastEditTime: 2021-09-11 22:25:51
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \cocos_ts_frame\assets\scripts\view\Result.ts
 */
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { IView } from "../base/IView";
import { EventType, SoundType } from "../common/BaseType";
import GameData from "../data/GameData";
import LogicMgr from "../manager/LogicMgr";
import Event from "../module/Event";
import Res from "../module/Res";
import Sound from "../module/Sound";
import UI from "../module/UI";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Result extends IView {
    point: cc.Label;
    height: cc.Label;
    titleAnima: sp.Skeleton;
    downloadBtn: cc.Node;
    retryBtn: cc.Node;
    continueBtn: cc.Node;
    homeBtn: cc.Node;
    shareBtn: cc.Node;

    pointPanel: cc.Node;
    btnPanel: cc.Node;

    onLoad() {
        let animaNode = this.node.findChild('anima');
        animaNode.addComponent(sp.Skeleton);
        this.titleAnima = animaNode.getComponent(sp.Skeleton);
        this.titleAnima.skeletonData = Res.getInstance().resultAnima;
        this.pointPanel = this.node.findChild('point')
        this.point = this.node.findChild('point/point').getComponent(cc.Label);
        this.height = this.node.findChild('point/height').getComponent(cc.Label);

        this.btnPanel = this.node.findChild('btn');
        this.downloadBtn = this.btnPanel.findChild('download');
        this.retryBtn = this.btnPanel.findChild('retry');
        this.continueBtn = this.btnPanel.findChild('continue');
        this.homeBtn = this.btnPanel.findChild('home')
        this.shareBtn = this.btnPanel.findChild('share')

        super.onLoad();
    }

    register() {
        this.downloadBtn.on('click', this.onDownload, this);
        this.retryBtn.on('click', this.onRetry, this);
        this.continueBtn.on('click', this.onContinue, this);
        this.homeBtn.on('click', this.onHome, this);
    }

    onShow(isWin) {
        Sound.getInstance().stopBgm();
        this.playTitleAnima(isWin);
        this.point.string = "积分 " + (isWin ? GameData.getInstance().point : 0)
        this.height.string = "历史最高: " + GameData.getInstance().endlessRecord;
        this.continueBtn.active = isWin;
        this.shareBtn.active = !isWin;

        this.pointPanel.active = false;
        this.btnPanel.active = false;

        if (isWin)
            Sound.getInstance().playSound(SoundType.Win);
        else
            Sound.getInstance().playSound(SoundType.Fail);
    }

    onHide() { }

    onDownload() {
        LogicMgr.getInstance().downloadGame();
    }

    onContinue() {
        Event.getInstance().emit(EventType.Continue, {});
        UI.getInstance().hideUI('Result');
    }

    onRetry() {
        Event.getInstance().emit(EventType.Retry, {});
        UI.getInstance().hideUI("Result");
    }

    onHome() {
        UI.getInstance().hideUI('Result');
        UI.getInstance().hideUI("Game");
        UI.getInstance().showUI("Menu");
    }

    /**
     * @description: 播放标题动画
     * @param {boolean} isWin
     * @return {*}
     */
    playTitleAnima(isWin: boolean) {
        this.titleAnima.premultipliedAlpha = false;
        let name = "";
        if (isWin)
            name = "victory";
        else
            name = "defeated";

        let duration = this.titleAnima.findAnimation(name).duration;
        this.titleAnima.setAnimation(0, name, false);
        setTimeout(function () {
            this.pointPanel.active = true;
            this.pointPanel.playDuangAnima();
        }.bind(this), duration * 1000 + 500)

        setTimeout(function () {
            this.btnPanel.active = true;

            if (this.continueBtn.active)
                this.continueBtn.playDuangAnima();

            if (this.shareBtn.active)
                this.shareBtn.playDuangAnima();

            this.downloadBtn.playDuangAnima();
            this.homeBtn.playDuangAnima();
            this.retryBtn.playDuangAnima();


        }.bind(this), duration * 1000 + 1500)
    }

}
