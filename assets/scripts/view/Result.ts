/*
 * @Author: your name
 * @Date: 2021-09-03 15:17:51
 * @LastEditTime: 2021-09-03 16:04:57
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
import UI from "../module/UI";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Result extends IView {
    winPanel: cc.Node;
    failPanel: cc.Node;
    leftNum: cc.Label;
    exchangeNum: cc.Label;

    onLoad() {
        this.winPanel = this.node.findChild('win');
        this.failPanel = this.node.findChild('fail')
        this.leftNum = this.winPanel.findChild('content/left/num').getComponent(cc.Label);
        this.exchangeNum = this.winPanel.findChild('content/exchange/num').getComponent(cc.Label);
        super.onLoad();
    }

    register() {
        this.winPanel.findChild('continue').on('click', this.onContinue, this);
        this.winPanel.findChild('download').on('click', this.onDownload, this);
        this.failPanel.findChild('retry').on('click', this.onRetry, this);
        this.failPanel.findChild('download').on('click', this.onDownload, this);
    }

    onShow(isWin) {
        this.winPanel.active = isWin;
        this.failPanel.active = !isWin;
        this.leftNum.string = "" + GameData.getInstance().soliderNum;
        this.exchangeNum.string = "" + GameData.getInstance().soliderNum;
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

}
