/*
 * @Author: your name
 * @Date: 2021-08-23 17:37:41
 * @LastEditTime: 2021-08-24 16:12:59
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \cocos_ts_frame\assets\scripts\view\game.ts
 */
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import App from "../App";
import { IView } from "../base/IView";
import UI from "../module/UI";

const { ccclass, property } = cc._decorator;

@ccclass
export default class game extends IView {

    onLoad() { }

    register() { }

    onShow(params) {

    }

    onHide(params) { }
}
