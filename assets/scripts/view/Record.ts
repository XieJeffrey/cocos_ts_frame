/*
 * @Author: your name
 * @Date: 2021-09-15 15:29:34
 * @LastEditTime: 2021-09-22 15:37:26
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \cocos_ts_frame\assets\scripts\view\Record.ts
 */
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { IView } from "../base/IView";
import { EventType, SoundType } from "../common/BaseType";
import GameData from "../data/GameData";
import UserData from "../data/UserData";
import LogicMgr from "../manager/LogicMgr";
import Event from "../module/Event";
import Res from "../module/Res";
import Sound from "../module/Sound";
import Storage from "../module/Storage";
import UI from "../module/UI";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Record extends IView {
    anima: sp.Skeleton = null;
    download: cc.Node = null;
    home: cc.Node = null;
    retry: cc.Node = null;
    recordTxt: cc.Label = null;
    heightTxt: cc.Label = null;
    newTip: cc.Node = null;

    onLoad() {
        this.download = this.node.findChild('btn/download');
        this.retry = this.node.findChild('btn/retry');
        this.home = this.node.findChild('btn/home');
        this.recordTxt = this.node.findChild('result').getComponent(cc.Label);
        this.heightTxt = this.node.findChild("height").getComponent(cc.Label);
        this.newTip = this.node.findChild('newTip')

        let animaNode = this.node.findChild('anima');
        animaNode.addComponent(sp.Skeleton);
        this.anima = animaNode.getComponent(sp.Skeleton);
        this.anima.skeletonData = Res.getInstance().resultAnima;
        super.onLoad();
    }

    register() {
        this.download.on('click', this.onDownload, this);
        this.retry.on('click', this.onRetry, this)
        this.home.on('click', this.onHome, this)
    }

    onShow(param) {
        Sound.getInstance().stopBgm();
        Sound.getInstance().playSound(SoundType.Win);
        let record = param.record;
        this.recordTxt.string = "本轮成功闯过{0}关！".format(record);
        this.newTip.active = false;
        this.anima.premultipliedAlpha = false;
        this.anima.setAnimation(0, "victory", false);

        if (GameData.getInstance().endlessRecord < record && record != 0) {
            this.newTip.active = true;
            //未注册时在本地保存泼妇沉舟的记录
            if (UserData.getInstance().GameID != "") {
                LogicMgr.getInstance().updateRank(record, function () {
                    GameData.getInstance().endlessRecord = record;
                    Storage.getInstance().saveGameData();
                })
            }
            else {
                GameData.getInstance().endlessRecord = record;
                Storage.getInstance().saveGameData();
            }
        }

        this.heightTxt.string = "*最高记录：成功闯过{0}关".format(GameData.getInstance().endlessRecord);
    }

    onHide() { }

    onDownload() {
        LogicMgr.getInstance().downloadGame();
    }

    onHome() {
        UI.getInstance().hideUI('Game');
        UI.getInstance().hideUI("Record");
        UI.getInstance().showUI("Menu")
    }

    onRetry() {
        UI.getInstance().hideUI("Record");
        Event.getInstance().emit(EventType.Retry, {});
    }
}
