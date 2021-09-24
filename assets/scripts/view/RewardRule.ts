/*
 * @Author: your name
 * @Date: 2021-09-25 00:54:18
 * @LastEditTime: 2021-09-25 01:18:29
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \cocos_ts_frame\assets\scripts\view\RewardRule.ts
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
export default class NewClass extends IView {
    closeBtn: cc.Node;
    timeTxt: cc.Label;


    onLoad() {
        this.closeBtn = this.node.findChild('close');
        this.timeTxt = this.node.findChild('title').getComponent(cc.Label);
        super.onLoad();
    }

    register() {
        this.closeBtn.on('click', this.onClose, this);
    }

    onShow() {
        this.timeTxt.string = "活动时间:{0}-{1}".format(
            Tool.secToCNTime(GameConfig.getInstance().activityStart),
            Tool.secToCNTime(GameConfig.getInstance().activityEndTime)
        );
    }


    onClose() {
        UI.getInstance().hideUI('RewardRule');
    }
    // update (dt) {}
}
