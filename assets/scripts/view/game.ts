/*
 * @Author: your name
 * @Date: 2021-08-23 17:37:41
 * @LastEditTime: 2021-09-02 17:31:42
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \cocos_ts_frame\assets\scripts\view\game.ts
 */
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { IView } from "../base/IView";
import { Action, EventType, GameMode, GameState, RoleType } from "../common/BaseType";
import GameConfig from "../config/GameConfig";
import Event from "../module/Event";
import Res from "../module/Res";
import UI from "../module/UI";
import GameData from "../data/GameData";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Game extends IView {
    bgList: Array<Array<cc.Sprite>>;//背景列表
    cloud: cc.Node;//背景云
    gameMode: GameMode;//游戏模式，闯关中|无尽
    gameState: GameState;//游戏状态
    //骨骼动画组件
    heroAnima: sp.Skeleton;
    mineRole: Array<sp.Skeleton>;
    otherRole: Array<sp.Skeleton>;
    //阴影
    shadow: Array<cc.Node>;
    //拦路小兵
    curWave: number;//当前波数
    wavePos: number;//小兵的y坐标
    totalUnit: 0;//野怪的单位数量

    pool: {
        sand: Array<cc.Node>;
        tree: Array<cc.Node>;
    }
    soliderNumTxt: cc.Label;//当前小兵数量


    onLoad() {
        //滚动背景
        let bgNode: cc.Node = this.node.findChild('bg');
        this.bgList = new Array<Array<cc.Sprite>>();
        for (let i = 0; i < 2; i++) {
            this.bgList.push(new Array<cc.Sprite>());
            let node: cc.Node = bgNode.findChild("" + i)
            for (let j = 0; j < 2; j++) {
                let spriteNode = new cc.Node('' + j)
                node.addChild(spriteNode);
                this.bgList[i].push(spriteNode.addComponent(cc.Sprite));
                spriteNode.setPosition(0, 1600 * j);
            }
        }
        this.cloud = new cc.Node('cloud');
        this.node.findChild('cloud').addChild(this.cloud);
        this.cloud.addComponent(cc.Sprite);

        //角色
        let roleNode: cc.Node = this.node.findChild('role/hero');
        this.mineRole = new Array<sp.Skeleton>();
        this.otherRole = new Array<sp.Skeleton>();
        //曹操
        let heroNode = new cc.Node('cc')
        roleNode.addChild(heroNode);
        heroNode.scale = GameConfig.roleScale;
        this.heroAnima = heroNode.addComponent(sp.Skeleton);
        //我方小兵
        this.shadow = new Array<cc.Node>();
        let soliderNode: cc.Node = this.node.findChild('role/mine')
        let shadowNode: cc.Node = this.node.findChild('role/shadow');
        for (let i = 0; i < 10; i++) {
            let solider = new cc.Node('' + i)
            soliderNode.addChild(solider);
            solider.scale = GameConfig.mineScale;
            this.mineRole.push(solider.addComponent(sp.Skeleton));
        }
        //中立|敌对小兵    
        soliderNode = this.node.findChild('role/other')
        for (let i = 0; i < 10; i++) {
            let solider = new cc.Node('' + i)
            soliderNode.addChild(solider);
            solider.scale = GameConfig.neutralScale;
            this.otherRole.push(solider.addComponent(sp.Skeleton));
        }
        //阴影
        for (let i = 0; i < 21; i++) {
            let shadow = new cc.Node('s')
            shadow.addComponent(cc.Sprite);
            Res.getInstance().loadSprite(shadow.getComponent(cc.Sprite), "shadow")
            shadowNode.addChild(shadow);
            this.shadow.push(shadow);
        }
        this.soliderNumTxt = this.node.findChild('res/txt').getComponent(cc.Label);
        super.onLoad();
    }

    register() {
        Event.getInstance().on(EventType.DialogClose, this.node, function () {
            this.gameState = GameState.Rush;
            this.playHeroAnima(Action.Run);
            this.playSoliderAnima(RoleType.Mine, Action.Run, GameData.soliderLv);
        }.bind(this))
    }

    onShow(params) {
        this.gameMode = GameMode.Pattern;
        this.gameState = GameState.Dialog;
        this.initBg();
        this.initRole();
        this.initWave();
        this.syncShadow();
        this.refreshSoliderNum();
        UI.getInstance().showUI("Dialog", "周公吐哺，天下归心");
    }

    update(dt) {
        switch (this.gameState) {
            case GameState.Rush:
                this.scrollBg(dt);
                this.scrollRole(dt);
                break;

            default:
                break;
        }
        if (this.cloud != null) {
            this.cloud.y -= GameConfig.BgSpUp * dt;
            if (this.cloud.y < -1600) {
                this.cloud.y += 3200 + Math.random() * 800;
            }
            this.syncShadow();
        }

    }

    /**
     * @description: 初始化背景
     * @param {*}
     * @return {*}
     */
    initBg() {
        for (let i = 0; i < this.bgList.length; i++) {
            for (let j = 0; j < this.bgList[i].length; j++) {
                this.bgList[i][j].node.y = 1600 * j;
                this.switchBgPic(i, this.bgList[i][j]);
            }
        }
        this.cloud.y = Math.random() * 800;
        this.cloud.getComponent(cc.Sprite).spriteFrame = Res.getInstance().sceneSprite[2][0];
    }

    /**
     * @description: 初始化地图角色
     * @param {*}
     * @return {*}
     */
    initRole() {
        GameData.soliderNum = GameConfig.roundSoliderNum;

        this.heroAnima.node.setPosition(0, GameConfig.CCStartPosY);
        this.playHeroAnima(Action.Idle);
        this.playSoliderAnima(RoleType.Mine, Action.Idle, GameData.soliderLv);

        let pos = this.getMineSoliderPos(Action.Idle, GameConfig.CCStartPosY)
        let num = this.getMineSoliderUnitNum()
        console.log(num);
        for (let i = 0; i < this.mineRole.length; i++) {

            this.mineRole[i].node.active = i < num;
            this.mineRole[i].node.setPosition(pos[i].x, pos[i].y);
        }
    }

    /**
     * @description: 初始化中立怪|野怪
     * @param {*}
     * @return {*}
     */
    initWave() {
        this.curWave = -1;
        this.nextWave(GameConfig.WaveStartPosY, GameData.soliderLv);
    }

    /**
     * @description: 生成下一波
     * @param {number} posY
     * @param {number} lv
     * @return {*}
     */
    nextWave(posY: number, lv: number) {
        let roleType = RoleType.Neutral;
        this.curWave++;
        if (this.isFightWave(this.curWave))
            roleType = RoleType.Enemy
        this.wavePos = posY// GameConfig.WaveStartPosY + 800 + Math.random() * 200
        let pos = this.getOtherSoliderPos(this.wavePos);
        for (let i = 0; i < this.otherRole.length; i++) {
            this.otherRole[i].node.active = true;
            this.otherRole[i].node.setPosition(pos[i].x, pos[i].y);
            this.otherRole[i].node.scale = GameConfig.enemyScale;
            if (roleType == RoleType.Neutral) {
                this.otherRole[i].node.scale = GameConfig.neutralScale;
            }
            this.otherRole[i].node.runAction(cc.fadeIn(0.5));
        }
        this.playSoliderAnima(roleType, Action.Idle, lv);
    }

    /**
     * @description: 获取其他士兵的站位数组
     * @param {*}
     * @return {*}
     */
    getOtherSoliderPos(startY: number): Array<any> {
        let array = new Array()
        for (let i = 0; i < 10; i++) {
            let x = (i % 5) * 50 - 100
            let y = Math.floor(i / 5) * 50 + startY;
            array.push({ x: x, y: y })
        }

        return array;
    }

    /**
     * @description: 获取我方士兵的站位数组
     * @param {Action} action
     * @return {*}
     */
    getMineSoliderPos(action: Action, startY: number): Array<{ x: number, y: number }> {
        let array = new Array()

        switch (action) {
            case Action.Attack:
                for (let i = 0; i < 10; i++) {
                    let x = (i % 5) * 50 - 100;
                    let y = -Math.floor(i / 5) * 30 + 80 + startY;
                    array.push({ x: x, y: y });
                }
                break;
            default:
                for (let i = 0; i < 10; i++) {
                    let x = (i % 2) * 100 - 50;
                    let y = -Math.floor(i / 2) * 60 - 50 + startY;
                    array.push({ x: x, y: y });
                }
                break;
        }
        return array;
    }

    /**
     * @description: 切换士兵站位阵型
     * @param {GameState} state
     * @return {*}
     */
    switchSoliderFormat(action: Action, call: Function) {
        let duration = 0.5;
        let pos = this.getMineSoliderPos(action, GameConfig.CCStartPosY);
        for (let i = 0; i < this.mineRole.length; i++) {
            this.mineRole[i].node.stopAllActions();
            this.mineRole[i].node.runAction(cc.moveTo(duration, cc.v2(pos[i].x, pos[i].y)));
        }
        this.heroAnima.node.stopAllActions();
        if (action == Action.Attack)
            this.heroAnima.node.runAction(cc.moveTo(duration, cc.v2(0, GameConfig.CCStartPosY - 100)));
        else
            this.heroAnima.node.runAction(cc.moveTo(duration, cc.v2(0, GameConfig.CCStartPosY)));

        setTimeout(() => {
            if (call)
                call();
        }, duration * 1000 + 50);
    }

    /**
     * @description: 背景滚动
     * @param {*} dt
     * @return {*}
     */
    scrollBg(dt) {
        for (let i = 0; i < this.bgList.length; i++) {
            for (let j = 0; j < this.bgList[i].length; j++) {
                this.bgList[i][j].node.y -= GameConfig.BgSpDown * dt
                if (this.bgList[i][j].node.y < -1600) {
                    this.bgList[i][j].node.y += 1600 * 2;
                    this.switchBgPic(i, this.bgList[i][j]);
                }
            }
        }
    }

    /**
     * @description: 士兵滚动往下走
     * @param {*} dt
     * @return {*}
     */
    scrollRole(dt) {
        for (let i = 0; i < this.otherRole.length; i++) {
            this.otherRole[i].node.y -= dt * GameConfig.BgSpDown;
        }
        this.wavePos -= dt * GameConfig.BgSpDown;

        if (Math.abs(this.wavePos - this.heroAnima.node.y) <= 150) {
            let roleType = RoleType.Neutral;
            this.gameState = GameState.Answer;
            if (this.isFightWave(this.curWave)) {
                this.gameState = GameState.Fight;
                roleType = RoleType.Enemy;
            }

            this.playHeroAnima(Action.Idle);
            this.playSoliderAnima(roleType, Action.Idle, 0);

            setTimeout(function () {
                if (this.gameState == GameState.Answer) {
                    UI.getInstance().showUI("Problem", function (result) {
                        this.answerResult(result);
                    }.bind(this));
                }
                else {
                    this.switchSoliderFormat(Action.Attack, function () {
                        this.playHeroAnima(Action.Idle);
                        this.playSoliderAnima(RoleType.Mine, Action.Attack, 0);
                        this.playSoliderAnima(RoleType.Enemy, Action.Attack, 0);
                    }.bind(this))
                }
            }.bind(this), 500)
        }
    }

    /**
     * @description:答题结果
     * @param {boolean} result
     * @return {*}
     */
    answerResult(result: boolean) {
        if (result) {
            console.log("答对了");
        }
        else {
            console.log("答错了");
        }
        for (let i = 0; i < this.otherRole.length; i++) {
            this.otherRole[i].node.runAction(cc.fadeOut(0.5))
        }
        setTimeout(function () {
            this.nextWave(GameConfig.WaveStartPosY + 400, GameData.soliderLv + 1);
            this.gameState = GameState.Rush;
        }.bind(this), 550);
    }

    syncShadow() {
        this.shadow[0].setPosition(this.heroAnima.node.x, this.heroAnima.node.y);
        for (let i = 0; i < this.mineRole.length; i++) {
            this.shadow[i + 1].active = this.mineRole[i].node.active;
            this.shadow[i + 1].setPosition(this.mineRole[i].node.x, this.mineRole[i].node.y);
        }
        for (let i = 0; i < this.otherRole.length; i++) {
            this.shadow[i + 11].active = this.otherRole[i].node.active;
            this.shadow[i + 11].setPosition(this.otherRole[i].node.x, this.otherRole[i].node.y);
        }
    }

    /**
     * @description: 切换背景图片
     * @param {number} idx
     * @param {cc} sprite
     * @return {*}
     */
    switchBgPic(idx: number, sprite: cc.Sprite) {
        let i: number = Math.floor(Math.random() * Res.getInstance().sceneSprite[idx].length);
        sprite.spriteFrame = Res.getInstance().sceneSprite[idx][i];
        sprite.node.height = 1600;
    }

    /**
     * @description: 播放士兵动画
     * @param {RoleType} role  士兵类型
     * @param {string} name 动画名称
     * @param {number} lv 士兵等级
     * @return {*}
     */
    playSoliderAnima(role: RoleType, name: Action, lv: number) {
        let array: Array<sp.Skeleton> = null;
        if (role == RoleType.Mine) {
            array = this.mineRole;
        }
        else {
            array = this.otherRole;
        }

        for (let i = 0; i < array.length; i++) {
            array[i].skeletonData = Res.getInstance().soliderAnima[role][name][lv + 1];
            array[i].clearTracks();
            array[i].setAnimation(0, "animation", true);
        }
    }

    /**
     * @description: 播放曹操动画
     * @param {Action} name
     * @return {*}
     */
    playHeroAnima(name: Action) {
        this.heroAnima.skeletonData = Res.getInstance().heroAnima[name];
        this.heroAnima.clearTracks();
        this.heroAnima.setAnimation(0, "animation", true);
    }

    /**
     * @description: 当前波数是否为战斗
     * @param {number} idx
     * @return {*}
     */
    isFightWave(idx: number) {
        return true;
        if (idx == 3 || idx == 6 || idx == 9)
            return true;
        return false;
    }

    /**
     * @description:刷新当前小兵的数量
     * @param {*}
     * @return {*}
     */
    refreshSoliderNum() {
        console.log(GameData)
        this.soliderNumTxt.string = "" + GameData.soliderNum;
    }

    /**
     * @description: 获取我方小兵单位数量
     * @param {*}
     * @return {*}
     */
    getMineSoliderUnitNum() {
        return Math.ceil(GameData.soliderNum / GameConfig.lv2Solider[GameData.soliderLv]);
    }

    onHide(params) { }


}
