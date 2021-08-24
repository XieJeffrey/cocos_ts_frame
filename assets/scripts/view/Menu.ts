/*
 * @Author: your name
 * @Date: 2021-08-24 15:40:48
 * @LastEditTime: 2021-08-24 15:59:47
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \cocos_ts_frame\assets\scripts\view\menu.ts
 */
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { IView } from "../base/IView";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Menu extends IView {

    onLoad() { }

    register() { }

    onShow() { }

    onHide() { }
}
