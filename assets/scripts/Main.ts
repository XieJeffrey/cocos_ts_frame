/*
 * @Author: your name
 * @Date: 2021-08-23 11:49:06
 * @LastEditTime: 2021-08-23 17:58:00
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \cocos_ts_frame\assets\scripts\Main.ts
 */
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import App from "./App";
import Tool from "./common/Tool";
const { ccclass, property } = cc._decorator;

@ccclass
export default class Main extends cc.Component {

    progressBar: cc.ProgressBar;
    tool = new Tool();

    onLoad() {
        this.tool.init();

        this.progressBar = this.node.findChild('progressBar').getComponent(cc.ProgressBar);
        this.progressBar.progress = 0;

        App.init(function name(progress) {
            this.progressBar.progress = progress;
            if (progress >= 0) {
                App.ui.showUI('game');
            }
        }.bind(this));
    }
    // update (dt) {}
}
