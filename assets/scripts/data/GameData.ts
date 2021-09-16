/*
 * @Author: your name
 * @Date: 2021-08-24 10:04:07
 * @LastEditTime: 2021-09-16 22:56:34
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
    public soliderType: number = 0;//兑换兵种
    public point: number = 0;//积分
    public payPoint: number = 0;//已兑换的积分

    //临时游戏数据
    public soliderNum: number = 1000;//士兵数量
    public rankData: Array<any>;
    public myRank: number = null;//我的排名

    public init() {
        console.log("gameData.init")
        this.rankData = new Array();
    }

    public load(data: string) {
        let obj = JSON.parse(data);
        this.soliderLv = obj.lv;
        this.maxSoliderNum = obj.num;
        this.endlessRecord = obj.record;
        this.soliderType = obj.type;
        this.point = obj.point;
        this.payPoint = obj.payPoint;
    }

    //是否排行版上版
    public isOnRank(): boolean {
        return true;
    }
    // update (dt) {}
}
