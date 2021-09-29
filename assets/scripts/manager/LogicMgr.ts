/*
 * @Author: your name
 * @Date: 2021-08-24 14:13:09
 * @LastEditTime: 2021-09-29 13:47:36
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
import Base64 from "../common/Base64";
import { EventType } from "../common/BaseType";
import Tool from "../common/Tool";
import GameConfig from "../config/GameConfig";
import GameData from "../data/GameData";
import UserData from "../data/UserData";
import Event from "../module/Event";
import Net from "../module/Net";
import Storage from "../module/Storage";
import UI from "../module/UI";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LogicMgr extends IManager {
    shareCall: Function = null;
    shareTime: number = null;
    isShare: boolean = false;

    init() {
        cc.game.on(cc.game.EVENT_SHOW, function () {
            console.log("cc_game_onshow:" + this.isShare);
            //关闭分享复活
            return;
            if (this.isShare) {
                let now = new Date().getTime();
                console.log("分享时间:{0}".format(now - this.shareTime))
                if (now - this.shareTime >= 5000) {
                    console.log("分享成功")
                    if (this.shareCall)
                        this.shareCall();
                    this.countShare();
                }
                else {
                    if (Math.random() < 0.5) {
                        UI.getInstance().showFloatMsg("请分享到群");
                    }
                    else {
                        UI.getInstance().showFloatMsg("分享失败");
                    }
                }

                this.isShare = false;
                this.shareCall = null;
            }
        }.bind(this), this)


        return new Promise(function (resolve, reject) {
            let login = function () {
                this.getUserData()
                    .then(function () { return this.initActivity() }.bind(this))
                    .then(function () { return this.initExchangeStae() }.bind(this))
                    .then(function () {
                        console.log("[logicMgr init]")
                        if (resolve)
                            resolve(1);
                    }.bind(this))
            }.bind(this)

            if (UserData.getInstance().GameID != "") {
                this.userExist(UserData.getInstance().GameID).then(function () {
                    cc.sys.localStorage.clear();
                    Storage.getInstance().init();
                    //  UI.getInstance().showFloatMsg("本地数据已清除");
                    console.log("本地数据已清除");
                    login();
                }).catch(function () {
                    login();
                }.bind(this))
            }
            else {
                login();
            }

        }.bind(this))

    }

    /**
     * @description: 下载万国觉醒
     * @param {*}
     * @return {*}
     */
    downloadGame() {
        if (Tool.isWxMp())
            wx && wx.miniProgram.navigateTo({ url: '../down/down' })
        else
            location.assign(GameConfig.getInstance().download);

    }
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
        Net.getInstance().get(url).then(function (data) {
            let obj = data.data.res
            GameData.getInstance().rankData = new Array();
            for (let i = 0; i < obj.rank.length; i++) {
                GameData.getInstance().rankData.push({ openid: obj.rank[i].openid, round: obj.rank[i].round })
            }

            if (typeof obj.self == "number") {
                if (obj.self > 10000) {
                    GameData.getInstance().myRank = Infinity;
                }
                else
                    GameData.getInstance().myRank = obj.self
            }
            else
                GameData.getInstance().myRank = Infinity;

            console.log("我的排名:{0}".format(GameData.getInstance().myRank));
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
    setUserInfo(data) {
        return new Promise((resolve, reject) => {
            // console.log(encodeURI(Base64.encode(data.name)))
            // console.log(encodeURI(Base64.encode(data.address)))

            let url = GameConfig.getInstance().url + "/api/setUserinfo";
            let param = {
                openid: data.id,
                mail: data.mail,
                tel: data.tel,
                name: encodeURI(Base64.encode(data.name)),
                address: encodeURI(Base64.encode(data.address)),
            }

            Net.getInstance().post(url, param).then(function (data) {
                if (resolve)
                    resolve(1);
            }).catch(function () {
                if (reject)
                    reject();
                console.error("set userInfo error");
                UI.getInstance().showFloatMsg("设置用户信息出错");
            })
        })

    }

    /**
     * @description: 设置用户游戏数据
     * @param {*} data
     * @param {*} func
     * @return {*}
     */

    setUserGameData(func) {
        let url = GameConfig.getInstance().url + "/api/saveUser";
        let param = {
            openid: UserData.getInstance().GameID,
            round: GameData.getInstance().endlessRecord,
            troops: GameData.getInstance().point,
            level: GameData.getInstance().soliderLv,
        }

        Net.getInstance().post(url, param).then(function (data) {
            console.log(data);
            Storage.getInstance().saveGameData();
            if (func)
                func()
        }, function () {
            UI.getInstance().showFloatMsg("设置用户游戏数据出错");
        })
    }

    /**
     * @description: 设置兵力
     * @param {*} point
     * @param {*} func
     * @return {*}
     */
    setTroops(point, func) {
        let url = GameConfig.getInstance().url + "/api/setTroops";
        let param = {
            openid: UserData.getInstance().GameID,
            troops: point,
        }

        Net.getInstance().post(url, param).then(function (data) {
            console.log(data);
            if (func)
                func()
        }, function () {
            UI.getInstance().showFloatMsg("设置兵力出错");
        })
    }

    /**
     * @description: 获取用户数据
     * @param {*} func
     * @return {*}
     */
    getUserData() {
        let self = this
        return new Promise((resolve, reject) => {
            if (UserData.getInstance().GameID == "") {
                if (resolve)
                    resolve(1);
                return;
            }
            let url = GameConfig.getInstance().url + "/api/getUser?";
            let param = "openid={0}".format(UserData.getInstance().GameID);
            url += param;
            Net.getInstance().get(url).then(function (data: any) {
                let obj = data.data
                console.log(obj);
                GameData.getInstance().endlessRecord = parseInt(obj.round);
                GameData.getInstance().point = obj.troops;
                GameData.getInstance().soliderLv = obj.level;
                self.limitSoliderLv();
                if (obj.level == 5) {
                    self.resetLv();
                }
                if (resolve)
                    resolve(1);
            }, function () {
                UI.getInstance().showFloatMsg("获取用户数据失败");
                if (reject)
                    reject();
            })
        })
    }

    /**
     * @description: 提交排行成绩
     * @param {*} func
     * @return {*}
     */
    updateRank(round, func) {
        if (UserData.getInstance().GameID == "") {
            UI.getInstance().showFloatMsg("未设置用户信息,无法提交成绩");
            return;
        }
        let url = GameConfig.getInstance().url + "/api/upload";
        let param = {
            openid: UserData.getInstance().GameID,
            round: round,
        }

        Net.getInstance().post(url, param).then(function (data: string) {
            GameData.getInstance().resetRankData();
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
            // if (func)
            //     func()
        }, function () {
            // UI.getInstance().showFloatMsg("统计分享次数失败");
        })
    }

    /**
     * @description: 邀请助力
     * @param {string} inviter
     * @return {*}
     */
    invite(inviter: string) {
        let self = this
        if (UserData.getInstance().GameID == "") {
            UI.getInstance().showFloatMsg("请先完善资料再帮好友助力");
            return;
        }

        this.countShare(null);
        let url = GameConfig.getInstance().url + "/api/inviteIn";
        let param = {
            openid: UserData.getInstance().GameID,
            inviter: inviter
        }

        Net.getInstance().post(url, param).then(function (obj: any) {
            let data = obj.data;
            if (data.errCode) {
                switch (data.errCode) {
                    case -1:
                        UI.getInstance().showFloatMsg("不能助力自己");
                        break;
                    case -2:
                        UI.getInstance().showFloatMsg("用户ID不存在");
                        break;
                    case -3:
                        UI.getInstance().showFloatMsg("邀请者ID不存在");
                        break;
                    case -4:
                        UI.getInstance().showFloatMsg("已经给别人助力过");
                        break;
                    case -5:
                        UI.getInstance().showFloatMsg("士兵等级不一致，助力失败");
                        break;
                    case -6:
                        UI.getInstance().showFloatMsg("士兵已经满级");
                        break;
                    case -7:
                        UI.getInstance().showFloatMsg("已经互相助力过,请让其他玩家帮你助力");
                        break;
                    default:
                        break;
                }
                return;
            }
            GameData.getInstance().soliderLv = data.level;
            self.limitSoliderLv();
            Storage.getInstance().saveGameData();
            if (UI.getInstance().isShow("Menu"))
                Event.getInstance().emit(EventType.LvUp, {});
            else
                GameData.getInstance().rewardToShow = true;
        }, function () {
            UI.getInstance().showFloatMsg("升级助力失败");
        }).catch(function (err) {
            console.error(err);
            UI.getInstance().showFloatMsg("升级助力失败");
        })
    }

    exchangeSolider(point, call) {
        let url = GameConfig.getInstance().url + "/api/exchange";
        let param = {
            openid: UserData.getInstance().GameID,
            type: GameData.getInstance().soliderType,
        }

        Net.getInstance().post(url, param).then(function (data) {
            if (call)
                call(data)

        }.bind(this))
    }

    initActivity() {
        console.log("LoginMgr:initActivity");
        return new Promise((resolve, reject) => {
            let url = GameConfig.getInstance().url;
            let param = "/api/activityStatus";
            url += param;
            Net.getInstance().get(url).then(function (data: any) {
                let obj = data.data;
                GameConfig.getInstance().activityStart = obj.startDate;
                GameConfig.getInstance().activityEndTime = obj.endDate;
                GameData.getInstance().isActiviyOpen = obj.opening;
                if (resolve)
                    resolve(1);

            })
        })
    }

    initExchangeStae() {
        console.log("LoginMgr:initExchange")
        return new Promise((resolve, reject) => {
            let url = GameConfig.getInstance().url + "/api/exchangeStatus";
            let param = "?openid={0}".format(UserData.getInstance().GameID);
            url += param;
            Net.getInstance().get(url).then(function (data: any) {
                let obj = data.data;
                GameConfig.getInstance().exchangeStartTime = obj.startDate;
                GameConfig.getInstance().exchangeEndTime = obj.endDate;
                GameData.getInstance().isExchangeOpen = obj.opening;
                GameData.getInstance().totalPool = obj.totalPool;
                GameData.getInstance().todayPool = obj.todayPool;

                if (GameData.getInstance().todayPool < 0)
                    GameData.getInstance().todayPool = 0;

                if (GameData.getInstance().totalPool < 0)
                    GameData.getInstance().totalPool = 0;

                if (UserData.getInstance().GameID != "")
                    GameData.getInstance().payPoint = obj.alreadyExchange;
                if (resolve)
                    resolve(1);

            })
        })
    }


    /**
     * @description: 获取用户的等级
     * @param {*}
     * @return {*}
     */
    getUserlv(func: Function) {
        let url = GameConfig.getInstance().url + "/api/getUser?";
        let param = "openid={0}".format(UserData.getInstance().GameID);
        url += param;
        Net.getInstance().get(url).then(function (data: any) {
            let obj = data.data
            if (obj == null) {
                console.log("不存在的用户数据")
                //UI.getInstance().showFloatMsg("不存在的用户数据")
                clearInterval(GameData.getInstance().lvUpTimer);
                return;
            }
            if (func)
                func(obj.level);
        })
    }

    //分享复活
    shareRelive() {
        this.countShare(null);
        let url = "../share/share?cmd=0"
        console.log(url)

        this.shareCall = function () {
            Event.getInstance().emit(EventType.Relive, {});
        }
        this.shareTime = new Date().getTime();
        this.isShare = true;
        wx && wx.miniProgram.navigateTo({ url: url })
    }

    shareLvup() {
        let self = this
        if (GameData.getInstance().soliderLv >= 4) {
            UI.getInstance().showFloatMsg("士兵已到最高等级");
            return;
        }

        let url = "../share/share?cmd=1&inviter={0}&lv={1}".format(UserData.getInstance().GameID, GameData.getInstance().soliderLv);
        console.log(url)
        wx & wx.miniProgram.navigateTo({ url: url });

        if (GameData.getInstance().lvUpTimer != -1) {
            clearInterval(GameData.getInstance().lvUpTimer);
            GameData.getInstance().lvUpTimer = -1;
        }

        GameData.getInstance().lvUpTimer = setInterval(function () {
            this.getUserlv(function (lv) {
                if (GameData.getInstance().soliderLv != lv) {
                    GameData.getInstance().soliderLv = lv;
                    self.limitSoliderLv();
                    Storage.getInstance().saveGameData();
                    if (UI.getInstance().isShow("Menu"))
                        Event.getInstance().emit(EventType.LvUp, {});
                    else
                        GameData.getInstance().rewardToShow = true;
                    clearInterval(GameData.getInstance().lvUpTimer);
                    GameData.getInstance().lvUpTimer = -1;
                }
            }.bind(this))
        }.bind(this), 10 * 1000);
    }

    /**
     * @description: 用户登录时统计数据
     * @param {*}
     * @return {*}
     */
    userLogin() {
        if (UserData.getInstance().GameID == "")
            return;
        let url = GameConfig.getInstance().url + "/api/launch";
        let param = "?openid=" + UserData.getInstance().GameID;
        Net.getInstance().get(url + param);

    }

    /**
     * @description: 用户是否存在
     * @param {string} openid
     * @return {*}
     */
    userExist(openid: string) {
        return new Promise((resolve, reject) => {
            let url = GameConfig.getInstance().url + "/api/userExisted";
            let param = "?openid=" + openid;
            Net.getInstance().get(url + param).then(function (data: any) {
                let obj = data.data
                if (!obj.existed) {
                    if (resolve)
                        resolve(1);
                }
                else {
                    if (reject)
                        reject();
                }
            })
        })
    }

    /**
     * @description: 获取用户的联系方式
     * @param {string} openid
     * @return {*}
     */
    getUserPhone(openid: string) {
        return new Promise((resolve, reject) => {
            let url = GameConfig.getInstance().url + "/api/getUserinfo"
            let param = "?openid=" + openid;
            Net.getInstance().get(url + param).then(function (data: any) {
                let obj = data.data;
                //用户在user表但没在userinfo表
                if (JSON.stringify(obj) == "{}") {
                    if (resolve) {
                        resolve(null);
                    }
                    return;
                }
                obj.name = decodeURI(Base64.decode(obj.name));
                obj.address = decodeURI(Base64.decode(obj.address));
                if (resolve) {
                    resolve(obj);
                }
            })
        })
    }

    /**
     * @description: 限制最高的等级
     * @param {*}
     * @return {*}
     */
    limitSoliderLv() {
        if (GameData.getInstance().soliderLv >= 5) {
            GameData.getInstance().soliderLv = 4;
        }
    }

    /**
     * @description: 把等级为6的改成等级5
     * @param {*}
     * @return {*}
     */
    resetLv() {
        let url = GameConfig.getInstance().url + "/api/saveUser";
        let param = {
            openid: UserData.getInstance().GameID,
            round: GameData.getInstance().endlessRecord,
            troops: GameData.getInstance().point,
            level: GameData.getInstance().soliderLv,
        }
        Net.getInstance().post(url, param).then(function (data) {
            Storage.getInstance().saveGameData();
        })
    }
}
