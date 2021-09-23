/*
 * @Author: your name
 * @Date: 2021-09-20 21:28:58
 * @LastEditTime: 2021-09-23 16:36:47
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
import Tool from "../common/Tool";
import GameConfig from "../config/GameConfig";
import UI from "../module/UI";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Rule extends IView {
    bg: cc.Node;
    timeTxt: cc.Label;

    onLoad() {
        this.bg = this.node.findChild('close');
        this.timeTxt = this.node.findChild('scrollview/view/content/bg/title').getComponent(cc.Label);
        super.onLoad();
    }

    register() {
        this.bg.on('click', this.onClose, this);
    }

    onShow() {
        this.timeTxt.string = "活动时间:{0}-{1}".format(
            Tool.secToCNTime(GameConfig.getInstance().activityStart),
            Tool.secToCNTime(GameConfig.getInstance().activityEndTime)
        );
    }

    onHide() { }

    onClose() {
        UI.getInstance().hideUI('Rule');
    }
}
