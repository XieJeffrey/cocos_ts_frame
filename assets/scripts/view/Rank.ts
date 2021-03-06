/*
 * @Author: your name
 * @Date: 2021-09-03 21:23:50
 * @LastEditTime: 2021-09-25 01:05:30
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
    ruleBtn: cc.Node;
    itemList: Array<cc.Node>;

    onLoad() {
        this.closeBtn = this.node.findChild('decorate/close');
        this.ruleTitleTxt = this.node.findChild('rule/title').getComponent(cc.Label);
        this.rankParent = this.node.findChild('content/scrollview/view/content')
        this.rankItem = this.rankParent.findChild('item');
        this.registeredItem = this.node.findChild('content/registered');
        this.unregisteredItem = this.node.findChild('content/unregistered');
        this.registBtn = this.unregisteredItem.findChild('register');
        this.ruleBtn = this.node.findChild('rule/ruleBtn');
        this.itemList = new Array();
        super.onLoad();
    }

    register() {
        this.registBtn.on('click', this.onRegister, this);
        this.closeBtn.on('click', this.onClose, this);
        this.ruleBtn.on('click', this.onRule, this)
        Event.getInstance().on(EventType.Regist, this.node, function () { this.onRegistered(); }.bind(this));
    }

    onShow() {
        this.ruleTitleTxt.string = "????????????:{0}-{1}".format(
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
        for (let i = 0; i < this.itemList.length; i++) {
            this.itemList[i].destroy();
        }
    }

    onClose() {
        Sound.getInstance().playSound(SoundType.PanelOpen);
        UI.getInstance().hideUI("Rank");
    }

    /**
     * @description: ??????????????????
     * @param {*}
     * @return {*}
     */
    onRegister() {
        Sound.getInstance().playSound(SoundType.Click);
        UI.getInstance().showUI("Person");
    }

    /**
     * @description: ?????????????????????????????????????????????
     * @param {*}
     * @return {*}
     */
    onRegistered() {
        UI.getInstance().showFloatMsg("??????????????????????????????")
        UI.getInstance().showFloatMsg("????????????????????????????????????,?????????????????????")
        GameData.getInstance().resetRankData();
        this.onShow();
    }

    /**
     * @description: ???????????????
     * @param {*}
     * @return {*}
     */
    refreshRank() {
        for (let i = 0; i < this.itemList.length; i++) {
            this.itemList[i].destroy();
        }
        for (let i = 0; i < GameData.getInstance().rankData.length; i++) {
            let item = null;
            if (i == 0) {
                item = this.rankItem;
            }
            else {
                item = cc.instantiate(this.rankItem);
                this.rankParent.addChild(item);
                this.itemList.push(item);
            }
            item.active = true;
            this.refreshRankItemData(i, GameData.getInstance().rankData[i], item);
        }
    }

    /**
     * @description: ??????????????????????????????
     * @param {*}
     * @return {*}
     */
    refreshMineRank() {
        if (UserData.getInstance().GameID == "") {
            //?????????
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
     * @description: ?????????????????????????????????
     * @param {number} idx
     * @param {any} data
     * @param {cc} item
     * @return {*}
     */
    refreshRankItemData(idx: number, data: any, item: cc.Node) {
        let noStr = "" + idx;
        if (idx > 10000 || idx == Infinity) {
            noStr = "?????????"
        }
        else {
            noStr = "" + ++idx;
        }

        item.findChild('no').getComponent(cc.Label).string = noStr;
        item.findChild('name').getComponent(cc.Label).string = Tool.changeToStar(data.openid);
        item.findChild('time').getComponent(cc.Label).string = data.round;
    }

    onRule() {
        UI.getInstance().showUI("RewardRule");
    }
}
