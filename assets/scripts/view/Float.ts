/*
 * @Author: your name
 * @Date: 2021-08-25 11:51:32
 * @LastEditTime: 2021-08-25 13:53:19
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
    msgList: Array<string>;
    isPlaying: boolean = false;

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
    public showFloatMsg(msg: string, duration: number = 1.5) {
        if (!this.isPlaying) {
            this.content.string = msg;
            this.playAnima(duration);
        }
    }

    /**
     * @description: 开始播放动画
     * @param {number} duration
     * @return {*}
     */
    private playAnima(duration: number) {
        this.node.y = 0
        this.node.opacity = 255
        this.isPlaying = true;
        this.node.runAction(cc.spawn(
            cc.moveBy(duration, cc.v2(0, 300)),
            cc.fadeOut(duration),
            cc.callFunc(function () {
                this.animaEnd()
            }.bind(this))
        ))
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
            this.showFloatMsg(msg);
        }
    }

    onShow() { }

    onHide() { }

}
