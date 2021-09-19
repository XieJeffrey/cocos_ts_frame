/*
 * @Author: your name
 * @Date: 2021-08-24 10:04:07
 * @LastEditTime: 2021-09-20 00:53:45
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
    public rankData: Array<{ openid: string, round: number }>;
    public myRank: number = 10000000;//我的排名
    public lvUpTimer: number = -1;//升级助力监听器

    public isActiviyOpen: boolean = false;//活动是否开启
    public isExchangeOpen: boolean = false;//兑换是否开启
    public totalPool: number = 0;//剩余可兑换兵力
    public todayPool: number = 0;//今日剩余可兑换兵力

    //启动数据
    public launchData: {
        cmd: number,
        lv: number,
        inviter: string
    } = null;

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
