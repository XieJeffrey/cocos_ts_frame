/*
 * @Author: your name
 * @Date: 2021-09-04 12:24:39
 * @LastEditTime: 2021-09-26 01:18:08
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \cocos_ts_frame\assets\scripts\view\Person.ts
 */
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { IView } from "../base/IView";
import { EventType, SoundType } from "../common/BaseType";
import Tool from "../common/Tool";
import GameData from "../data/GameData";
import UserData from "../data/UserData";
import LogicMgr from "../manager/LogicMgr";
import Event from "../module/Event";
import Sound from "../module/Sound";
import Storage from "../module/Storage";
import UI from "../module/UI";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Person extends IView {
    idInput: cc.EditBox;
    phoneInput: cc.EditBox;
    nameInput: cc.EditBox;
    addressInput: cc.EditBox;
    commitBtn: cc.Node;
    closeBtn: cc.Node;

    isModify: boolean;
    onLoad() {
        let content: cc.Node = this.node.findChild('content');
        this.idInput = content.findChild('id/editBox').getComponent(cc.EditBox);
        this.phoneInput = content.findChild('phone/editBox').getComponent(cc.EditBox);
        this.nameInput = content.findChild('name/editBox').getComponent(cc.EditBox);
        this.addressInput = content.findChild('address/editBox').getComponent(cc.EditBox);

        this.commitBtn = this.node.findChild('commit');
        this.closeBtn = this.node.findChild('decorate/close');

        super.onLoad();
    }

    register() {
        this.commitBtn.on('click', this.onCommit, this);
        this.closeBtn.on('click', this.onClose, this)
    }

    onShow() {
        this.isModify = false;
        this.idInput.string = UserData.getInstance().GameID;
        this.phoneInput.string = UserData.getInstance().Phone;
        this.nameInput.string = UserData.getInstance().Name;
        this.addressInput.string = UserData.getInstance().Address;
        Sound.getInstance().playSound(SoundType.PanelOpen);
    }

    onHide() { }

    onCommit() {
        if (this.idInput.string != UserData.getInstance().GameID) {
            this.isModify = true;
        }

        if (this.phoneInput.string != UserData.getInstance().Phone) {
            this.isModify = true;
        }

        if (this.nameInput.string != UserData.getInstance().Name) {
            this.isModify = true;
        }

        if (this.addressInput.string != UserData.getInstance().Address) {
            this.isModify = true;
        }

        if (!this.isModify) {
            UI.getInstance().showFloatMsg("没有更改的信息");
            return;
        }

        if (this.idInput.string == "") {
            UI.getInstance().showFloatMsg("游戏ID不能为空");
            return;
        }

        if (this.phoneInput.string == "") {
            UI.getInstance().showFloatMsg("联系方式不能为空");
            return;
        }

        if (this.phoneInput.string.length != 11 || !Tool.isNumber(this.phoneInput.string)) {
            UI.getInstance().showFloatMsg("错误的手机号码")
            return;
        }
        if (this.idInput.string.length > 9 || !Tool.isNumber(this.idInput.string)) {
            UI.getInstance().showFloatMsg("非法的游戏ID");
            return;
        }

        // if (this.addressInput.string == "") {
        //     UI.getInstance().showFloatMsg("收货地址不能为空");
        //     return;
        // }

        // if (UserData.getInstance().GameID != "") {
        //     if (UserData.getInstance().GameID != this.idInput.string) {
        //         UI.getInstance().showFloatMsg("设备已绑定游戏ID，不可更改");
        //         return;
        //     }
        // }

        let userData = {
            id: this.idInput.string,
            mail: ".",
            tel: this.phoneInput.string,
            name: this.nameInput.string,
            address: this.addressInput.string,
        }

        LogicMgr.getInstance().userExist(this.idInput.string).then(function () {
            //空白的新用户
            LogicMgr.getInstance().setUserInfo(userData).then(function () {
                this.infoCommited();
            }.bind(this))
        }.bind(this)).catch(function () {
            //当前用户已在服务器上有数据
            LogicMgr.getInstance().getUserPhone(this.idInput.string).then(function (data: any) {
                if (data == null) {
                    //这波用户在userinfo没有数据，没法验证
                    //直接更新到服务器吧阿门
                    LogicMgr.getInstance().setUserInfo(userData).then(function () {
                        this.isModify = false;
                        UI.getInstance().showFloatMsg("同步数据成功");
                        UI.getInstance().hideUI('Person');
                        UserData.getInstance().GameID = this.idInput.string;
                        UserData.getInstance().Phone = this.phoneInput.string;
                        UserData.getInstance().Name = this.nameInput.string;
                        UserData.getInstance().Address = this.addressInput.string;
                        Storage.getInstance().saveUserData();
                    }.bind(this))
                    return;
                }

                //验证手机号码是否相同
                if (this.phoneInput.string == data.tel) {
                    //同步服务器数据到本地
                    UserData.getInstance().GameID = data.openid
                    UserData.getInstance().Name = data.name;
                    UserData.getInstance().Phone = data.tel;
                    UserData.getInstance().Address = data.address;
                    LogicMgr.getInstance().getUserData().then(function () {
                        Storage.getInstance().saveUserData();
                        Storage.getInstance().saveGameData();
                        UI.getInstance().showFloatMsg("同步数据成功");
                        UI.getInstance().hideUI('Person');
                    }.bind(this))

                    LogicMgr.getInstance().initExchangeStae();
                }
                else {
                    UI.getInstance().showFloatMsg("ID与联系方式不匹配")
                }
            }.bind(this))
            // UI.getInstance().showFloatMsg("已经存在的ID，无法重复创建")
        }.bind(this))
    }

    onClose() {
        Sound.getInstance().playSound(SoundType.PanelClose);
        UI.getInstance().hideUI('Person')
    }

    /**
     * @description: 玩家联系方式已保存
     * @param {*}
     * @return {*}
     */
    infoCommited() {
        this.isModify = false;
        UI.getInstance().showFloatMsg("信息更新成功")
        UserData.getInstance().GameID = this.idInput.string;
        UserData.getInstance().Phone = this.phoneInput.string;
        UserData.getInstance().Name = this.nameInput.string;
        UserData.getInstance().Address = this.addressInput.string;

        Storage.getInstance().saveUserData();
        LogicMgr.getInstance().setUserGameData(null);//保存游戏数据

        if (GameData.getInstance().endlessRecord == 0) {
            Event.getInstance().emit(EventType.Regist, {});
        }
        else {
            //保存无尽模式的成绩
            LogicMgr.getInstance().updateRank(GameData.getInstance().endlessRecord, function () {
                Event.getInstance().emit(EventType.Regist, {});
            }.bind(this));
        }
        UI.getInstance().hideUI("Person")
    }
}
