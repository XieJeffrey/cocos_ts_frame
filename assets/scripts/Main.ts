/*
 * @Author: your name
 * @Date: 2021-08-23 11:49:06
 * @LastEditTime: 2021-09-11 21:54:12
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
import GameData from "./data/GameData";
import UI from "./module/UI";
const { ccclass, property } = cc._decorator;

@ccclass
export default class Main extends cc.Component {

    progressBar: cc.ProgressBar;
    tool = new Tool();
    app: App = new App();
    loadedValue: number = 0;
    progressTxt: cc.Label;

    onLoad() {
        this.tool.init();

        this.progressBar = this.node.findChild('start/progressBar').getComponent(cc.ProgressBar);
        this.progressBar.progress = 0;
        this.progressTxt = this.node.findChild('start/progressBar/txt').getComponent(cc.Label);
        this.updateProgress();
        this.app.init(function (progress) {
            this.loadedValue = progress;
        }.bind(this));
    }


    update(dt) {
        this.progressBar.progress += 1 * dt;
        if (this.progressBar.progress >= this.loadedValue) {
            this.progressBar.progress = this.loadedValue;
        }
        this.updateProgress();
        if (this.progressBar.progress >= 1) {
            UI.getInstance().showUI("menu");
            this.node.findChild('start').destroy()
            this.enabled = false;
        }
    }

    updateProgress() {
        this.progressTxt.string = "加载中 {0}%".format("" + Math.ceil(this.progressBar.progress * 100));
    }
}
