/*
 * @Author: your name
 * @Date: 2021-08-24 10:04:07
 * @LastEditTime: 2021-09-03 09:37:23
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

import IManager from "../base/IManager";

export default class GameData extends IManager {
    //持久化数据块
    public soliderLv: number = 0;//士兵等级
    public endlessRecord: number = 0;//无尽模式记录    
    public maxSoliderNum: number = 0;//剩余兵量的最高记录


    //临时游戏数据
    public soliderNum: number = 1000;//士兵数量
    public point: number = 0;//积分
    public rankData: Array<any>;
    public myRank: number = null;//我的排名

    public init() {
        console.log("gameData.init")
        this.rankData = new Array();
    }

    public load(data: string) { }

    //是否排行版上版
    public isOnRank(): boolean {
        return true;
    }
    // update (dt) {}
}
