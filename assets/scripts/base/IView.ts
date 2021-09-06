/*
 * @Author: your name
 * @Date: 2021-08-23 11:03:26
 * @LastEditTime: 2021-08-29 20:30:40
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \cocos_ts_frame\assets\scripts\base\view.ts
 */
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { ViewType } from "../common/BaseType";

const { ccclass, property } = cc._decorator;

@ccclass
export abstract class IView extends cc.Component {
    // LIFE-CYCLE CALLBACKS:
    cacheType: ViewType
    onLoad() {
        this.register();
    }

    abstract register(): void;

    abstract onShow(params: any): void;

    abstract onHide(params: any): void;

    // update (dt) {}
}
