/*
 * @Author: your name
 * @Date: 2021-09-03 21:23:50
 * @LastEditTime: 2021-09-14 16:30:53
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
import { SoundType } from "../common/BaseType";
import Tool from "../common/Tool";
import GameConfig from "../config/GameConfig";
import GameData from "../data/GameData";
import UserData from "../data/UserData";
import Sound from "../module/Sound";
import UI from "../module/UI";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Rank extends IView {
    closeBtn: cc.Node;
    ruleTitleTxt: cc.Label;
    onRankItem: cc.Node;
    outRankItem: cc.Node;
    registBtn: cc.Node;

    onLoad() {
        this.closeBtn = this.node.findChild('decorate/close');
        this.ruleTitleTxt = this.node.findChild('rule/title').getComponent(cc.Label);
        this.onRankItem = this.node.findChild('content/onRank');
        this.outRankItem = this.node.findChild('content/outRank');
        this.registBtn = this.outRankItem.findChild('register');
        super.onLoad();
    }

    register() {
        this.registBtn.on('click', this.onRegister, this);
        this.closeBtn.on('click', this.onClose, this);
    }

    onShow() {
        this.ruleTitleTxt.string = "活动时间:{0}-{1}".format(
            Tool.secToCNTime(GameConfig.getInstance().activityStart),
            Tool.secToCNTime(GameConfig.getInstance().activityEndTime)
        );

        Sound.getInstance().playSound(SoundType.PanelOpen);

        if (UserData.getInstance().GameID == "") {
            this.onRankItem.active = false;
            this.outRankItem.active = true;
        }
        else {
            this.onRankItem.active = true;
            this.outRankItem.active = false;
            if (GameData.getInstance().isOnRank()) {
                //todo
                // this.refreshRankItemData({ idx: -1 }, this.onRankItem);
            }
            else
                this.refreshRankItemData({
                    idx: null,
                    ID: UserData.getInstance().GameID,
                    record: GameData.getInstance().endlessRecord
                }, this.onRankItem);
        }
    }

    onHide() { }

    onClose() {
        Sound.getInstance().playSound(SoundType.PanelOpen);
        UI.getInstance().hideUI("Rank");
    }

    onRegister() {
        UI.getInstance().showUI("Person");
    }

    refreshRankItemData(data: any, item: cc.Node) {
        let noStr = "" + data.idx;
        if (data.idx == null) {
            noStr = "未上榜"
        }
        item.findChild('no').getComponent(cc.Label).string = noStr;
        item.findChild('name').getComponent(cc.Label).string = data.ID;
        item.findChild('time').getComponent(cc.Label).string = data.record;
    }
}
