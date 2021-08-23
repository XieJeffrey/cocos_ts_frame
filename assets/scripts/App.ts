/*
 * @Author: your name
 * @Date: 2021-08-23 11:56:09
 * @LastEditTime: 2021-08-23 17:36:13
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \cocos_ts_frame\assets\scripts\App.ts
 */
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { IManager } from "./base/IManager";
import UI from "./module/UI";

const { ccclass, property } = cc._decorator;

@ccclass
export default class App {
    static ui: UI = new UI();

    static curInit: number = 5;
    static totalInit: number = 0;

    static init(call: Function) {
        this.ui.init().then(function () {
            this.curInit++;
            console.log(this.curInit);
            call(0.1);
        }.bind(this))
    }

    static initUI() {
        this.ui.init();
    }
}
