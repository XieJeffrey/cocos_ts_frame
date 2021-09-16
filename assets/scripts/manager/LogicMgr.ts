/*
 * @Author: your name
 * @Date: 2021-08-24 14:13:09
 * @LastEditTime: 2021-09-16 23:20:37
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
import GameConfig from "../config/GameConfig";
import GameData from "../data/GameData";
import UserData from "../data/UserData";
import Net from "../module/Net";
import Storage from "../module/Storage";
import UI from "../module/UI";
import Game from "../view/Game";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LogicMgr extends IManager {

    init() {
        return new Promise(function (resolve, reject) {
            this.getUserData();
        }.bind(this))
    }

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
    saveGameData() {
        Storage.getInstance().saveGameData();
    }

    /**
     * @description: 下载万国觉醒
     * @param {*}
     * @return {*}
     */
    downloadGame() { }
    // update (dt) {}   
    /**
     * @description: 获取排行榜数据
     * @param {*} func
     * @return {*}
     */
    getRankData(func) {
        let url = GameConfig.getInstance().url + "/api/getRank?";
        let param = "openid={0}".format(UserData.getInstance().GameID);
        url += param;
        Net.getInstance().get(url).then(function (data: string) {
            let obj = JSON.parse(data);
            GameData.getInstance().rankData = obj.rankArray;
            GameData.getInstance().myRank = obj.self;
            if (func)
                func();
        }.bind(this), function () {
            UI.getInstance().showFloatMsg("获取排行榜数据错误");
        }.bind(this))
    }

    /**
     * @description: 设置用户信息
     * @param {*}
     * @return {*}
     */
    setUserData(data, func) {
        let url = GameConfig.getInstance().url + "/api/saveUser?";
        let param = {
            openid: data.id,
            mail: data.mail,
            tel: data.tel,
            name: data.name,
            address: data.address,
            round: GameData.getInstance().endlessRecord,
            troops: GameData.getInstance().soliderNum,
            level: GameData.getInstance().soliderLv,

        }

        Net.getInstance().post(url, param).then(function (data) {
            console.log(data);
            if (func)
                func()
        }, function () {
            UI.getInstance().showFloatMsg("设置用户数据出错");
        })
    }

    /**
     * @description: 获取用户数据
     * @param {*} func
     * @return {*}
     */
    getUserData(func) {
        if (UserData.getInstance().GameID == "")
            return;
        let url = GameConfig.getInstance().url + "/api/getUser";
        let param = "openid={0}".format(UserData.getInstance().GameID);
        url += param;
        Net.getInstance().get(url).then(function (data: string) {
            let obj = JSON.parse(data);
            GameData.getInstance().endlessRecord = parseInt(obj.round);
            GameData.getInstance().soliderNum = obj.trpops;
            GameData.getInstance().soliderLv = obj.level;
            if (func)
                func();
        }, function () {
            UI.getInstance().showFloatMsg("获取用户数据失败");
        })
    }

    /**
     * @description: 提交排行成绩
     * @param {*} func
     * @return {*}
     */
    updateRank(func) {
        if (UserData.getInstance().GameID == "") {
            UI.getInstance().showFloatMsg("未设置用户信息,无法提交成绩");
            return;
        }
        let url = GameConfig.getInstance().url + "/api/upload";
        let param = {
            openid: UserData.getInstance().GameID,
            round: GameData.getInstance().endlessRecord,
        }

        Net.getInstance().post(url, param).then(function (data: string) {
            if (func)
                func();
        }, function () {
            UI.getInstance().showFloatMsg("上传破釜沉舟成绩失败");
        })
    }

    /**
     * @description: 设置兵种
     * @param {*} func
     * @return {*}
     */
    setSoliderType(func) {
        if (UserData.getInstance().GameID == "") {
            UI.getInstance().showFloatMsg("未设置用户信息,无法兑换");
            return;
        }

        let url = GameConfig.getInstance().url + "/api/setTroopsType";
        let param = {
            openid: UserData.getInstance().GameID,
            type: GameData.getInstance().soliderType,
        }

        Net.getInstance().post(url, param).then(function () {
            Storage.getInstance().saveGameData();
            if (func)
                func()
        }, function () {
            UI.getInstance().showFloatMsg("设置兵种类型失败");
        })
    }

    /**
     * @description: 统计分享次数
     * @param {*} func
     * @return {*}
     */
    countShare(func) {
        if (UserData.getInstance().GameID == "") {
            console.log("用户Id未设置，不计入分享次数的统计")
            return;
        }
        let url = GameConfig.getInstance().url + "/api/shareOut";
        let param = "?openid=" + UserData.getInstance().GameID;

        url += param;
        Net.getInstance().get(url).then(function () {
            if (func)
                func()
        }, function () {
            UI.getInstance().showFloatMsg("统计分享次数失败");
        })
    }

    /**
     * @description: 邀请助力
     * @param {string} inviter
     * @return {*}
     */
    invite(inviter: string) {
        let url = GameConfig.getInstance().url + "/api/inviteln";
        let param = {
            openid: UserData.getInstance().GameID,
            inviter: inviter
        }

        Net.getInstance().post(url, param).then(function (obj) {
            let data = JSON.parse(obj);
            if (data.errCode) {
                UI.getInstance().showFloatMsg(data.errMsg);
                return;
            }
            GameData.getInstance().soliderLv = data.level;
            Storage.getInstance().saveGameData();
        }, function () {
            UI.getInstance().showFloatMsg("升级助力失败");
        })
    }

    exchangeSolider(point, lv, call) {

    }

}
