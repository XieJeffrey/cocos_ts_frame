/*
 * @Author: your name
 * @Date: 2021-09-08 10:08:50
 * @LastEditTime: 2021-09-10 14:13:02
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \cocos_ts_frame\assets\scripts\view\Loading.ts
 */
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { IView } from "../base/IView";
import GameConfig from "../config/GameConfig";
import UI from "../module/UI";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Loading extends IView {
    progressBar: cc.ProgressBar;
    tipTxt: cc.Label;
    delta: number = 0;
    loadedCall: Function = null;
    progressTxt: cc.Label;

    onLoad() {
        this.progressBar = this.node.findChild('progressBar').getComponent(cc.ProgressBar);
        this.tipTxt = this.progressBar.node.findChild('tip').getComponent(cc.Label);
        this.progressTxt = this.node.findChild('progressBar/txt').getComponent(cc.Label);
    }

    register() { }

    onShow(param) {
        this.delta = 1 / param.duration;
        this.loadedCall = param.call;
        this.progressBar.progress = 0;
        let tipIdx = Math.floor(Math.random() * GameConfig.getInstance().GameTip.length);
        this.tipTxt.string = GameConfig.getInstance().GameTip[tipIdx];
        this.updateProgressTxt();
    }

    update(dt) {
        this.progressBar.progress += this.delta * dt;
        if (this.progressBar.progress > 1)
            this.progressBar.progress = 1
        this.updateProgressTxt();
        if (this.progressBar.progress >= 1) {
            if (this.loadedCall) {
                this.loadedCall();
                UI.getInstance().hideUI("Loading");
            }
        }
    }

    onHide() {
        this.delta = 0;
        this.loadedCall = null;
        this.progressBar.progress = 0;
    }

    updateProgressTxt() {
        this.progressTxt.string = "加载中 {0}%".format(Math.ceil(this.progressBar.progress * 100));
    }

}
