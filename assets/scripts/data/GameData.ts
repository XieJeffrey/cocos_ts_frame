/*
 * @Author: your name
 * @Date: 2021-08-24 00:26:36
 * @LastEditTime: 2021-08-26 11:10:43
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \cocos_ts_frame\assets\scripts\data\GameData.ts
 */
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameData {
    public static soliderLv: number = 0;
    public static endlessRecord: number = 0;

    public static init() { }

    public static load(data: string) { }

}
