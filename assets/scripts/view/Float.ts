/*
 * @Author: your name
 * @Date: 2021-08-25 11:51:32
 * @LastEditTime: 2021-09-08 11:51:22
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \cocos_ts_frame\assets\scripts\view\Float.ts
 */
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { IView } from "../base/IView";
import Event from "../module/Event";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Float extends IView {
    timer: number = 0;
    content: cc.Label;
    msgList: Array<{ txt: string, duration: number }>;
    isPlaying: boolean;

    onLoad() {
        this.content = this.node.findChild('txt').getComponent(cc.Label);
        this.msgList = new Array();
        this.timer = 0;
        this.isPlaying = false;
    }

    register() {
    }

    /**
     * @description: 播放飘字动画
     * @param {string} msg
     * @param {number} duration
     * @return {*}
     */
    public showFloatMsg(msg: string, duration) {
        if (!this.isPlaying) {
            this.content.string = msg;
            this.playAnima(duration);
        }
        else {
            this.msgList.push({ txt: msg, duration: duration });
        }
    }

    /**
     * @description: 开始播放动画
     * @param {number} duration
     * @return {*}
     */
    public playAnima(duration: number) {
        this.node.y = 0
        this.node.opacity = 255
        this.isPlaying = true;
        this.node.stopAllActions();
        this.node.runAction(cc.spawn(
            cc.moveBy(duration, cc.v2(0, 150)),
            cc.fadeOut(duration),
        ))
        setTimeout(function () {
            this.animaEnd();
        }.bind(this), duration * 1000 + 100);

    }

    /**
     * @description: 动画结束
     * @param {*}
     * @return {*}
     */
    animaEnd() {
        this.isPlaying = false;
        if (this.msgList.length > 0) {
            let msg = this.msgList.shift();
            this.showFloatMsg(msg.txt, msg.duration);
        }
    }

    onShow() { }

    onHide() { }

}
