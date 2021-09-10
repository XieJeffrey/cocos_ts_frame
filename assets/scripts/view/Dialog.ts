/*
 * @Author: your name
 * @Date: 2021-08-29 19:52:14
 * @LastEditTime: 2021-09-10 14:52:15
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \cocos_ts_frame\assets\scripts\view\Dialog.ts
 */
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { IView } from "../base/IView";
import { EventType } from "../common/BaseType";
import Event from "../module/Event";
import UI from "../module/UI";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Dialog extends IView {
    dialogTxt: cc.Label;
    closeBtn: cc.Node;

    onLoad() {
        this.dialogTxt = this.node.findChild('content/frame/txt').getComponent(cc.Label)
        this.closeBtn = this.node.findChild('sure')
        super.onLoad();
    }

    register() {
        this.closeBtn.on('click', this.onClose, this)
    }

    onShow(text) {
        this.dialogTxt.string = text;
    }

    onHide() {
        Event.getInstance().emit(EventType.DialogClose, null);
    };

    onClose() {
        UI.getInstance().hideUI("Dialog");
    }
}
