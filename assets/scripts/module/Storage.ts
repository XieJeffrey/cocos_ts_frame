/*
 * @Author: your name
 * @Date: 2021-08-24 00:28:47
 * @LastEditTime: 2021-09-03 09:37:36
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \cocos_ts_frame\assets\scripts\module\Storage.ts
 */
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import IManager from "../base/IManager";
import GameData from "../data/GameData";
import UserData from "../data/UserData";

const { ccclass, property } = cc._decorator;
const localStorage = true;
@ccclass
export default class Storage extends IManager {
    dataKey: string = "debug_key";

    init() {
        return new Promise(function (resolve, reject) {
            if (localStorage) {
                this.loadGameData()
                this.loadUserData()
                console.log("[storage inited]")
                resolve(1)
            }
            else {

            }
        }.bind(this))
    }

    saveGameData() { }

    saveUserData() { }

    loadGameData() {
        let str: string = cc.sys.localStorage.getItem("gameData" + this.dataKey)
        if (str === "" || str === null) {
            GameData.getInstance().init()
        }
        else {
            GameData.getInstance().load(str);
        }
    }

    loadUserData() {
        let str: string = cc.sys.localStorage.getItem("userData" + this.dataKey)
        if (str === "" || str === null) {
            UserData.init()
        }
        else {
            UserData.load(str);
        }
    }
}
