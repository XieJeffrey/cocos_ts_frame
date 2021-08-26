/*
 * @Author: your name
 * @Date: 2021-08-24 14:13:09
 * @LastEditTime: 2021-08-24 14:17:12
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \cocos_ts_frame\assets\scripts\module\logicMgr.ts
 */
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import IManager from "../base/IManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LogicMgr extends IManager {

    /**
     * @description: 保存用户数据
     * @param {*}
     * @return {*}
     */
    saveUserData() { }

    /**
     * @description: 保存游戏数据
     * @param {*}
     * @return {*}
     */
    saveGameData() { }


    // update (dt) {}
}
