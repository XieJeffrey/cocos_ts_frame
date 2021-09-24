/*
 * @Author: your name
 * @Date: 2021-09-03 15:17:51
 * @LastEditTime: 2021-09-24 12:55:24
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \cocos_ts_frame\assets\scripts\view\Result.ts
 */
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { IView } from "../base/IView";
import { EventType, SoundType } from "../common/BaseType";
import GameConfig from "../config/GameConfig";
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
export default class Result extends IView {
    point: cc.Label;
    height: cc.Label;
    titleAnima: sp.Skeleton;
    downloadBtn: cc.Node;
    retryBtn: cc.Node;
    continueBtn: cc.Node;
    homeBtn: cc.Node;
    shareBtn: cc.Node;
    round: cc.Label;

    pointPanel: cc.Node;
    btnPanel: cc.Node;

    onLoad() {
        let animaNode = this.node.findChild('anima');
        animaNode.addComponent(sp.Skeleton);
        this.titleAnima = animaNode.getComponent(sp.Skeleton);
        this.titleAnima.skeletonData = Res.getInstance().resultAnima;
        this.pointPanel = this.node.findChild('point')
        this.point = this.node.findChild('point/point').getComponent(cc.Label);
        this.height = this.node.findChild('point/height').getComponent(cc.Label);
        this.round = this.node.findChild('point/round/txt').getComponent(cc.Label);

        this.btnPanel = this.node.findChild('btn');
        this.downloadBtn = this.btnPanel.findChild('download');
        this.retryBtn = this.btnPanel.findChild('retry');
        this.continueBtn = this.btnPanel.findChild('continue');
        this.homeBtn = this.btnPanel.findChild('home')
        this.shareBtn = this.btnPanel.findChild('share')

        super.onLoad();
    }

    register() {
        this.downloadBtn.on('click', this.onDownload, this);
        this.retryBtn.on('click', this.onRetry, this);
        this.continueBtn.on('click', this.onContinue, this);
        this.homeBtn.on('click', this.onHome, this);
        this.shareBtn.on('click', this.shareRelive, this);
    }

    onShow(isWin) {

        Sound.getInstance().stopBgm();
        this.playTitleAnima(isWin);

        this.shareBtn.active = !isWin;
        let getPoint = GameData.getInstance().soliderNum;
        if (isWin) {
            if (UserData.getInstance().GameID != "") {
                if (getPoint > GameData.getInstance().point) {
                    LogicMgr.getInstance().setTroops(getPoint, function () {
                        GameData.getInstance().point = getPoint - GameData.getInstance().payPoint;
                        this.point.string = "积分 " + GameData.getInstance().point;
                        LogicMgr.getInstance().setUserGameData(function () {
                            Storage.getInstance().saveGameData();
                        }.bind(this))
                    }.bind(this))
                }
                // LogicMgr.getInstance().setTroops(getPoint + GameData.getInstance().point, function () {
                //     GameData.getInstance().point += getPoint;
                //     Storage.getInstance().saveGameData();
                //     this.height.string = "累计积分: " + GameData.getInstance().point;
                // }.bind(this))
            }
            else {
                if (getPoint > GameData.getInstance().point) {
                    GameData.getInstance().point = getPoint;
                    Storage.getInstance().saveGameData();
                }

                this.height.string = "累计积分: " + GameData.getInstance().point;
            }
            if (GameData.getInstance().maxSoliderNum < GameData.getInstance().soliderNum) {
                GameData.getInstance().maxSoliderNum = GameData.getInstance().soliderNum;
            }
            Sound.getInstance().playSound(SoundType.Win);
        }
        else {
            Sound.getInstance().playSound(SoundType.Fail);
            this.shareBtn.active = (GameData.getInstance().reliveNum > 0)
        }
        console.log(GameData.getInstance().point)
        this.point.string = "积分 " + GameData.getInstance().point;
        //   this.height.string = "累计积分: " + GameData.getInstance().point;
        this.height.string = "";
        this.round.string = "得分：" + getPoint;
        this.continueBtn.active = isWin;

        this.pointPanel.active = false;
        this.btnPanel.active = false;

        if (isWin) {
            if (GameData.getInstance().maxSoliderNum < GameData.getInstance().soliderNum) {
                GameData.getInstance().maxSoliderNum = GameData.getInstance().soliderNum;
                GameData.getInstance().point += GameData.getInstance().soliderNum * GameConfig.getInstance().solider2Point;
                Storage.getInstance().saveGameData();
            }
            Sound.getInstance().playSound(SoundType.Win);
        }
        else
            Sound.getInstance().playSound(SoundType.Fail);
    }

    onHide() { }

    onDownload() {
        LogicMgr.getInstance().downloadGame();
    }

    onContinue() {
        Event.getInstance().emit(EventType.Continue, {});
        UI.getInstance().hideUI('Result');
    }

    onRetry() {
        Event.getInstance().emit(EventType.Retry, {});
        UI.getInstance().hideUI("Result");
    }

    onHome() {
        UI.getInstance().hideUI('Result');
        UI.getInstance().hideUI("Game");
        UI.getInstance().showUI("Menu");
    }

    /**
     * @description: 播放标题动画
     * @param {boolean} isWin
     * @return {*}
     */
    playTitleAnima(isWin: boolean) {
        this.titleAnima.premultipliedAlpha = false;
        let name = "";
        if (isWin)
            name = "victory";
        else
            name = "defeated";

        let duration = this.titleAnima.findAnimation(name).duration;
        this.titleAnima.setAnimation(0, name, false);
        setTimeout(function () {
            this.pointPanel.active = true;
            this.pointPanel.playDuangAnima();
        }.bind(this), duration * 1000 + 500)

        setTimeout(function () {
            this.btnPanel.active = true;

            if (this.continueBtn.active)
                this.continueBtn.playDuangAnima();

            if (this.shareBtn.active)
                this.shareBtn.playDuangAnima();

            this.downloadBtn.playDuangAnima();
            this.homeBtn.playDuangAnima();
            this.retryBtn.playDuangAnima();


        }.bind(this), duration * 1000 + 1500)
    }

    shareRelive() {
        // Event.getInstance().emit(EventType.Relive, {});
        // return;
        LogicMgr.getInstance().shareRelive();
    }

}
