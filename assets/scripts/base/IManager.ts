/*
 * @Author: your name
 * @Date: 2021-08-23 11:58:20
 * @LastEditTime: 2021-08-24 11:27:19
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \cocos_ts_frame\assets\scripts\base\IManager.ts
 */
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class IManager {
    private static _instance: any;
    public static getInstance<T extends {}>(this: new () => T): T {
        if (!(<any>this)._instance) {
            (<any>this)._instance = new this();
        }
        return (<any>this)._instance;
    }

    init(params?: any) { }

}
