/*
 * @Author: your name
 * @Date: 2021-08-24 14:13:09
 * @LastEditTime: 2021-09-14 17:05:07
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
     * @description: 上传用户数据
     * @param {*}
     * @return {*}
     */
    uploadUserData() {

    }

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
        let param = "openid={0}&mail={1}&tel={2}&name={3}&address={4}&roud={5}&troops={6}&level={7}".format(
            data.id,
            data.mail,
            data.tel,
            data.name,
            data.address,
            "" + GameData.getInstance().endlessRecord,
            "" + GameData.getInstance().soliderNum,
            "" + GameData.getInstance().soliderLv,
        )
        url += param;
        Net.getInstance().get(url).then(function (data) {
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
        let param = "openid={0}&round={1}".format(UserData.getInstance().GameID, GameData.getInstance().endlessRecord);
        url += param;
        Net.getInstance().get(url).then(function (data: string) {
            if (func)
                func();
        }, function () {
            UI.getInstance().showFloatMsg("上传破釜沉舟成绩失败");
        })
    }

}
