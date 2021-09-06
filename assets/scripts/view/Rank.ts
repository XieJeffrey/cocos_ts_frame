/*
 * @Author: your name
 * @Date: 2021-09-03 21:23:50
 * @LastEditTime: 2021-09-06 22:10:08
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \cocos_ts_frame\assets\scripts\view\Rank.ts
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
export default class Rank extends IView {
    closeBtn: cc.Node;

    onLoad() {
        this.closeBtn = this.node.findChild('decorate/close');
        super.onLoad();
    }

    register() {
        this.closeBtn.on('click', this.onClose, this);
    }

    onShow() { }

    onHide() { }

    onClose() {
        UI.getInstance().hideUI("Rank");
    }
}
