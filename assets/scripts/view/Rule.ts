/*
 * @Author: your name
 * @Date: 2021-09-20 21:28:58
 * @LastEditTime: 2021-09-25 01:15:43
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \cocos_ts_frame\assets\scripts\view\Rule.ts
 */
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { IView } from "../base/IView";
import UI from "../module/UI";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Rule extends IView {
    closeBtn: cc.Node;
    timeTxt: cc.Label;

    onLoad() {
        this.closeBtn = this.node.findChild('close');
        super.onLoad();
    }

    register() {
        this.closeBtn.on('click', this.onClose, this);
    }

    onShow() {

    }

    onHide() { }

    onClose() {
        console.log("close")
        UI.getInstance().hideUI('Rule');
    }
}
