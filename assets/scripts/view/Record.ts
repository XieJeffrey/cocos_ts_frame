/*
 * @Author: your name
 * @Date: 2021-09-15 15:29:34
 * @LastEditTime: 2021-09-15 17:49:00
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
import LogicMgr from "../manager/LogicMgr";
import Event from "../module/Event";
import Res from "../module/Res";
import Sound from "../module/Sound";
import UI from "../module/UI";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Record extends IView {
    anima: sp.Skeleton = null;
    download: cc.Node = null;
    home: cc.Node = null;
    retry: cc.Node = null;
    recordTxt: cc.Label = null;
    newTip: cc.Node = null;

    onLoad() {
        this.download = this.node.findChild('btn/download');
        this.retry = this.node.findChild('btn/retry');
        this.home = this.node.findChild('btn/home');
        this.recordTxt = this.node.findChild('record/num').getComponent(cc.Label);
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
        this.recordTxt.string = "{0}关!".format(record);
        this.newTip.active = record > GameData.getInstance().endlessRecord;
        GameData.getInstance().endlessRecord = record;
        this.anima.premultipliedAlpha = false;
        this.anima.setAnimation(0, "victory", false);
        LogicMgr.getInstance().saveGameData();
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
