/*
 * @Author: your name
 * @Date: 2021-08-24 00:28:47
 * @LastEditTime: 2021-09-22 13:58:37
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
    dataKey: string = "debug_key_24";

    init() {
        return new Promise(function (resolve, reject) {
            if (localStorage) {
                this.loadGameData();
                this.loadUserData();
                this.loadLaunchData();
                console.log("[storage inited]")
                resolve(1)
            }
            else {

            }
        }.bind(this))
    }

    /**
     * @description: 保存游戏数据到本地
     * @param {*}
     * @return {*}
     */
    saveGameData() {
        let json = {
            lv: GameData.getInstance().soliderLv,
            num: GameData.getInstance().maxSoliderNum,
            record: GameData.getInstance().endlessRecord,
            type: GameData.getInstance().soliderType,
            point: GameData.getInstance().point,
            payPoint: GameData.getInstance().payPoint,
        }
        let str = JSON.stringify(json);
        str = str.encode();
        cc.sys.localStorage.setItem('gameData' + this.dataKey, str);
    }

    /**
     * @description: 保存用户数据到本地
     * @param {*}
     * @return {*}
     */
    saveUserData() {
        let json = {
            id: UserData.getInstance().GameID,
            name: UserData.getInstance().Name,
            tel: UserData.getInstance().Phone,
            address: UserData.getInstance().Address,
            mail: UserData.getInstance().Mail,
        }
        let str = JSON.stringify(json);
        str = str.encode();
        console.log(str);
        cc.sys.localStorage.setItem('userData' + this.dataKey, str);
    }

    loadGameData() {
        let str: string = cc.sys.localStorage.getItem("gameData" + this.dataKey)
        if (str === "" || str === null) {
            GameData.getInstance().init()
        }
        else {
            GameData.getInstance().load(str.decode());
        }
    }

    loadUserData() {
        let str: string = cc.sys.localStorage.getItem("userData" + this.dataKey)
        if (str === "" || str === null) {
            UserData.getInstance().init()
        }
        else {
            UserData.getInstance().load(str.decode());
        }
    }

    loadLaunchData() {
        let str = cc.sys.localStorage.getItem("withParam");
        console.log("luanchData:" + str);
        if (str != "" && str != null) {
            cc.sys.localStorage.removeItem("withParam");
            str = cc.sys.localStorage.getItem("urlParam");
            cc.sys.localStorage.removeItem("urlParam");
            GameData.getInstance().launchData = JSON.parse(str);
            console.log("cc_启动参数:");
            console.log(GameData.getInstance().launchData);
        }
    }
}
