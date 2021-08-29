/*
 * @Author: your name
 * @Date: 2021-08-23 14:33:41
 * @LastEditTime: 2021-08-29 20:11:57
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \cocos_ts_frame\assets\scripts\common\BaseType.ts
 */
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

export enum ViewType {
    normal = 0,
    cache = 1,
}

export enum BgmType {

}

export enum SoundType {

}

export enum EventType {
    DialogClose=0,
}

/**
 * @description: 游戏模式
 * @param {*}
 * @return {*}
 */
export enum GameMode{
    Pattern=0,//闯关模式
    Endless=1,//无尽模式
}

/**
 * @description: 游戏状态
 * @param {*}
 * @return {*}
 */
export enum GameState{
    Dialog=0,//对话出征阶段
    Rush=1,//冲锋
    Answer=2,//答题
    Fight=3,//战斗
    Over=4,//结算
}