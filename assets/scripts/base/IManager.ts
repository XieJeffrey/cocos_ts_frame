/*
 * @Author: your name
 * @Date: 2021-08-23 11:58:20
 * @LastEditTime: 2021-08-23 15:02:37
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
export abstract class IManager {
    abstract init(params: any): any;
}
