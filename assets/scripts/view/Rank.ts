/*
 * @Author: your name
 * @Date: 2021-09-03 21:23:50
 * @LastEditTime: 2021-09-20 15:52:29
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \cocos_ts_frame\assets\scripts\view\Rank.ts
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
import GameConfig from "../config/GameConfig";
import GameData from "../data/GameData";
import UserData from "../data/UserData";
import LogicMgr from "../manager/LogicMgr";
import Event from "../module/Event";
import Sound from "../module/Sound";
import UI from "../module/UI";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Rank extends IView {
    closeBtn: cc.Node;
    ruleTitleTxt: cc.Label;
    rankParent: cc.Node;
    rankItem: cc.Node;
    registeredItem: cc.Node;
    unregisteredItem: cc.Node;
    registBtn: cc.Node;

    onLoad() {
        this.closeBtn = this.node.findChild('decorate/close');
        this.ruleTitleTxt = this.node.findChild('rule/title').getComponent(cc.Label);
        this.rankParent = this.node.findChild('content/scrollview/view/content')
        this.rankItem = this.rankParent.findChild('item');
        this.registeredItem = this.node.findChild('content/registered');
        this.unregisteredItem = this.node.findChild('content/unregistered');
        this.registBtn = this.unregisteredItem.findChild('register');
        super.onLoad();
    }

    register() {
        this.registBtn.on('click', this.onRegister, this);
        this.closeBtn.on('click', this.onClose, this);
        Event.getInstance().on(EventType.Regist, this.node, function () { this.onRegistered(); }.bind(this));
    }

    onShow() {
        this.ruleTitleTxt.string = "活动时间:{0}-{1}".format(
            Tool.secToCNTime(GameConfig.getInstance().activityStart),
            Tool.secToCNTime(GameConfig.getInstance().activityEndTime)
        );

        Sound.getInstance().playSound(SoundType.PanelOpen);

        if (GameData.getInstance().rankData != null && GameData.getInstance().rankData.length > 0) {
            this.refreshRank();
            this.refreshMineRank();
        }
        else {
            LogicMgr.getInstance().getRankData(function () {
                this.refreshRank();
                this.refreshMineRank();
            }.bind(this))
        }
    }

    onHide() {
        for (let i = 0; i < this.rankParent.children.length; i++) {
            if (i == 0)
                continue;
            this.rankParent.children[i].destroy();
        }
    }

    onClose() {
        Sound.getInstance().playSound(SoundType.PanelOpen);
        UI.getInstance().hideUI("Rank");
    }

    /**
     * @description: 点击注册按钮
     * @param {*}
     * @return {*}
     */
    onRegister() {
        Sound.getInstance().playSound(SoundType.Click);
        UI.getInstance().showUI("Person");
    }

    /**
     * @description: 点击注册上榜之后重新刷新排行榜
     * @param {*}
     * @return {*}
     */
    onRegistered() {
        UI.getInstance().showFloatMsg("成功提交成绩到排行榜")
        UI.getInstance().showFloatMsg("排行榜数据刷新可能有延时,请稍后刷新查看")
        this.onShow();
    }

    /**
     * @description: 刷新排行榜
     * @param {*}
     * @return {*}
     */
    refreshRank() {
        for (let i = 0; i < GameData.getInstance().rankData.length; i++) {
            let item = null;
            if (i == 0) {
                item = this.rankItem;
            }
            else {
                item = cc.instantiate(this.rankItem);
                this.rankParent.addChild(item);
            }
            item.active = true;
            this.refreshRankItemData(i, GameData.getInstance().rankData[i], item);
        }
    }

    /**
     * @description: 刷新“我的”排行条目
     * @param {*}
     * @return {*}
     */
    refreshMineRank() {
        if (UserData.getInstance().GameID == "") {
            //未注册
            this.unregisteredItem.active = true;
            this.registeredItem.active = false;
        }
        else {
            this.unregisteredItem.active = false;
            this.registeredItem.active = true;
            this.refreshRankItemData(
                GameData.getInstance().myRank,
                {
                    openid: UserData.getInstance().GameID,
                    round: GameData.getInstance().endlessRecord
                },
                this.registeredItem
            )
        }
    }

    /**
     * @description: 刷新排行版的每一条条目
     * @param {number} idx
     * @param {any} data
     * @param {cc} item
     * @return {*}
     */
    refreshRankItemData(idx: number, data: any, item: cc.Node) {
        let noStr = "" + idx;
        if (idx > 10000 || idx == null) {
            noStr = "未上榜"
        }
        else {
            noStr = "" + ++idx;
        }
        item.findChild('no').getComponent(cc.Label).string = noStr;
        item.findChild('name').getComponent(cc.Label).string = data.openid;
        item.findChild('time').getComponent(cc.Label).string = data.round;
    }
}
