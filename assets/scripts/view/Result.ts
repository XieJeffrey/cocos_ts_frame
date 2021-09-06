/*
 * @Author: your name
 * @Date: 2021-09-03 15:17:51
 * @LastEditTime: 2021-09-06 17:32:09
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
import { EventType } from "../common/BaseType";
import GameData from "../data/GameData";
import LogicMgr from "../manager/LogicMgr";
import Event from "../module/Event";
import Res from "../module/Res";
import UI from "../module/UI";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Result extends IView {
    winPanel: cc.Node;
    failPanel: cc.Node;
    leftNum: cc.Label;
    exchangeNum: cc.Label;
    titleAnima: sp.Skeleton;

    onLoad() {
        this.winPanel = this.node.findChild('win');
        this.failPanel = this.node.findChild('fail')
        this.leftNum = this.winPanel.findChild('content/left/num').getComponent(cc.Label);
        this.exchangeNum = this.winPanel.findChild('content/exchange/num').getComponent(cc.Label);
        let animaNode = this.node.findChild('anima');
        animaNode.addComponent(sp.Skeleton);
        this.titleAnima = animaNode.getComponent(sp.Skeleton);
        this.titleAnima.skeletonData = Res.getInstance().resultAnima;
        super.onLoad();
    }

    register() {
        this.winPanel.findChild('continue').on('click', this.onContinue, this);
        this.winPanel.findChild('download').on('click', this.onDownload, this);
        this.failPanel.findChild('retry').on('click', this.onRetry, this);
        this.failPanel.findChild('download').on('click', this.onDownload, this);
    }

    onShow(isWin) {
        this.winPanel.active = false;
        this.failPanel.active = false;
        this.playTitleAnima(isWin);
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
            this.winPanel.active = isWin;
            this.failPanel.active = !isWin;
            if (isWin)
                this.winPanel.playDuangAnima();
            if (!isWin)
                this.failPanel.playDuangAnima();
            this.leftNum.string = "" + GameData.getInstance().soliderNum;
            this.exchangeNum.string = "" + GameData.getInstance().soliderNum;
        }.bind(this), duration * 1000);
    }

}
