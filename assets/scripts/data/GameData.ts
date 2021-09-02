/*
 * @Author: your name
 * @Date: 2021-08-24 00:26:36
 * @LastEditTime: 2021-09-02 17:34:00
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
    //持久化数据块
    public static soliderLv: number = 0;//士兵等级
    public static endlessRecord: number = 0;//无尽模式记录    
    public static maxSoliderNum: number = 0;//剩余兵量的最高记录

    //临时游戏数据
    public static soliderNum: number = 1000;//士兵数量


    public static init() { }

    public static load(data: string) { }

}
