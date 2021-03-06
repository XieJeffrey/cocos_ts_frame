/*
 * @Author: your name
 * @Date: 2021-08-23 17:37:41
 * @LastEditTime: 2021-09-24 01:13:11
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
import { Action, BgmType, EventType, GameMode, GameState, RoleType, SoundType } from "../common/BaseType";
import GameConfig from "../config/GameConfig";
import Event from "../module/Event";
import Res from "../module/Res";
import UI from "../module/UI";
import GameData from "../data/GameData";
import Sound from "../module/Sound";
import LogicMgr from "../manager/LogicMgr";

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
    enemyRole: Array<sp.Skeleton>;
    npcRole: cc.Node;
    //阴影
    shadow: Array<cc.Node>;
    //特效
    bornEffect: Array<sp.Skeleton>;
    effectParent: cc.Node;
    //拦路小兵
    curWave: number;//当前波数
    wavePos: number;//小兵的y坐标
    totalUnit: number = 0;//野怪的单位数量
    curOtherUnit: number = 0;//当前波对面怪的单位数量
    curEnemyNum: number = 0;//当前对面敌兵的兵力
    originSoliderNum: number = 0;//破釜沉舟模式遇敌前的兵力
    npcPosList: Array<{ x: number, y: number }>;
    neutralPool: Array<number> = new Array();
    enemyPool: Array<number> = new Array();


    soliderNumTxt: cc.Label;//当前小兵数量
    soliderNumState: cc.Sprite;//当前小兵的涨跌状态
    record: number = 0;//无尽模式的时间记录
    npcId: number = 0;//村名Npc的角色Id
    fightTimer: number = 0;//战斗计时器
    recordNode: cc.Node = null;//破釜沉舟模式记录
    recordTxt: cc.Label = null;//当前闯过？关
    recordShadowTxt: cc.Label = null;//文字阴影
    recordHistoryTxt: cc.Label = null;//历史最高

    onLoad() {
        //滚动背景
        let bgNode: cc.Node = this.node.findChild('bg');
        this.bgList = new Array<Array<cc.Sprite>>();
        for (let i = 0; i < 2; i++) {
            this.bgList.push(new Array<cc.Sprite>());
            let node: cc.Node = bgNode.findChild("" + i)
            for (let j = 0; j < 3; j++) {
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
        this.enemyRole = new Array<sp.Skeleton>();
        //曹操
        let heroNode = new cc.Node('cc')
        roleNode.addChild(heroNode);
        heroNode.scale = GameConfig.getInstance().roleScale;
        this.heroAnima = heroNode.addComponent(sp.Skeleton);
        //我方小兵
        this.shadow = new Array<cc.Node>();
        let soliderNode: cc.Node = this.node.findChild('role/mine')
        let shadowNode: cc.Node = this.node.findChild('role/shadow');
        for (let i = 0; i < 10; i++) {
            let solider = new cc.Node('' + i)
            soliderNode.addChild(solider);
            solider.scale = GameConfig.getInstance().soliderScale;
            this.mineRole.push(solider.addComponent(sp.Skeleton));
        }
        //敌对小兵    
        soliderNode = this.node.findChild('role/other')
        for (let i = 0; i < 10; i++) {
            let solider = new cc.Node('' + i)
            soliderNode.addChild(solider);
            solider.scale = GameConfig.getInstance().soliderScale;
            this.enemyRole.push(solider.addComponent(sp.Skeleton));
        }
        //中立单位
        this.npcRole = new cc.Node('npc');
        this.npcRole.addComponent(cc.Sprite);
        soliderNode.addChild(this.npcRole);

        //阴影
        for (let i = 0; i < 22; i++) {
            let shadow = new cc.Node('s')
            shadow.addComponent(cc.Sprite);
            Res.getInstance().loadSprite(shadow.getComponent(cc.Sprite), "shadow")
            shadowNode.addChild(shadow);
            this.shadow.push(shadow);
        }
        //特效
        this.bornEffect = new Array<sp.Skeleton>();
        this.effectParent = this.node.findChild('role/effect');
        this.soliderNumTxt = this.node.findChild('res/txt').getComponent(cc.Label);
        this.soliderNumState = this.node.findChild('res/state').getComponent(cc.Sprite);
        //破釜沉舟
        this.recordNode = this.node.findChild('record');
        this.recordHistoryTxt = this.recordNode.findChild('height').getComponent(cc.Label);
        this.recordTxt = this.recordNode.findChild('cur').getComponent(cc.Label);
        this.recordShadowTxt = this.recordNode.findChild('cur/shadow').getComponent(cc.Label);

        super.onLoad();
    }

    register() {
        Event.getInstance().on(EventType.DialogClose, this.node, function () {
            this.gameState = GameState.Rush;
            this.playHeroAnima(Action.Run);
            this.playSoliderAnima(RoleType.Mine, Action.Run, GameData.getInstance().soliderLv);
        }.bind(this))

        Event.getInstance().on(EventType.Continue, this.node, function () {
            this.onContinue();
        }.bind(this))

        Event.getInstance().on(EventType.Retry, this.node, function () {
            this.onRetry();
        }.bind(this))

        Event.getInstance().on(EventType.Relive, this.node, function () {
            this.onRelive();
        }.bind(this))
    }

    onShow(params) {
        Sound.getInstance().playBgm(BgmType.FightBgm);
        this.gameMode = GameMode.Pattern;
        this.gameState = GameState.Dialog;
        this.initBg();
        this.initRole();
        this.initWave();
        this.syncShadow();
        this.refreshSoliderNum(0);
        UI.getInstance().showUI("Dialog", "周公吐哺，天下归心");
        this.recordNode.active = false;
        this.record = 0;
        GameData.getInstance().reliveNum = 3;
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
            this.cloud.y -= GameConfig.getInstance().BgSpUp * dt;

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
        this.npcPosList = new Array();
        for (let i = 0; i < this.bgList.length; i++) {
            for (let j = 0; j < this.bgList[i].length; j++) {
                this.bgList[i][j].node.y = 1600 * j;
                this.switchBgPic(i, this.bgList[i][j]);
            }
        }
        this.cloud.y = Math.random() * 800;
        this.cloud.getComponent(cc.Sprite).spriteFrame = Res.getInstance().sceneSprite[2][0];

        for (let i = 0; i < this.npcPosList.length; i++) {
            if (this.npcPosList[i].y == -340) {
                this.npcPosList.splice(i, 1)
                break;
            }
        }
    }

    /**
     * @description: 初始化地图角色
     * @param {*}
     * @return {*}
     */
    initRole() {
        GameData.getInstance().soliderNum = GameConfig.getInstance().roundSoliderNum;

        this.heroAnima.node.setPosition(0, GameConfig.getInstance().CCStartPosY);
        this.playHeroAnima(Action.Idle);
        this.playSoliderAnima(RoleType.Mine, Action.Idle, GameData.getInstance().soliderLv);

        let pos = this.getMineSoliderPos(Action.Idle, GameConfig.getInstance().CCStartPosY)
        let num = this.getMineSoliderUnitNum()
        for (let i = 0; i < this.mineRole.length; i++) {
            this.mineRole[i].node.active = i < num;
            this.mineRole[i].node.setPosition(pos[i].x, pos[i].y);
        }
        for (let i = 0; i < this.enemyRole.length; i++) {
            this.enemyRole[i].node.active = false;
        }

        //缩小村民的阴影
        this.shadow[1].scale = 0.8;
    }

    /**
     * @description: 
     * @param {*}
     * @return {*}
     */
    setNpcPos(spriteName: string, offsetY: number) {
        if (this.npcPosList == null)
            this.npcPosList = new Array();
        switch (spriteName) {
            case "bg2-1":
                this.npcPosList.push({ x: 150, y: -270 + offsetY });
                this.npcPosList.push({ x: -180, y: 330 + offsetY });
                break;
            case "bg2-2":
                this.npcPosList.push({ x: -160, y: -340 + offsetY });
                this.npcPosList.push({ x: 120, y: 100 + offsetY });
                break;
            case "bg2-3":
                this.npcPosList.push({ x: 120, y: -130 + offsetY });
                this.npcPosList.push({ x: 180, y: 600 + offsetY });

                break;
        }
    }

    /**
     * @description: 初始化中立怪|野怪
     * @param {*}
     * @return {*}
     */
    initWave() {
        this.curWave = -1;
        this.neutralPool = [2, 1, 1, 2, 1, 1, 2];
        this.enemyPool = [2, 2, 1];
        this.neutralPool.muddled();
        this.enemyPool.muddled();
        this.nextWave(GameConfig.getInstance().WaveStartPosY, GameData.getInstance().soliderLv);
    }

    /**
     * @description: 生成下一波
     * @param {number} posY
     * @param {number} lv
     * @return {*}
     */
    nextWave(posY: number, lv: number) {
        let roleType = null;
        this.curWave++;
        if (this.isFightWave(this.curWave)) {
            GameData.getInstance().reliveNum--;
            roleType = RoleType.Enemy
            if (this.gameMode == GameMode.Endless) {
                this.curOtherUnit = 10;
                this.curEnemyNum = 10 * GameConfig.getInstance().lv2Solider[GameData.getInstance().soliderLv];
            }
            else {
                this.curOtherUnit = this.enemyPool.pop();
                this.curEnemyNum = this.curOtherUnit * GameConfig.getInstance().lv2Solider[GameData.getInstance().soliderLv];
            }
            this.totalUnit = 0;

            this.wavePos = (this.npcPosList.shift()).y;// GameConfig.WaveStartPosY + 800 + Math.random() * 200
            let pos = this.getEnemySoliderPos(this.wavePos);
            for (let i = 0; i < this.enemyRole.length; i++) {
                this.enemyRole[i].node.stopAllActions();
                this.enemyRole[i].node.opacity = 255;
                this.enemyRole[i].node.active = i < this.curOtherUnit;
                this.enemyRole[i].node.setPosition(pos[i].x, pos[i].y);
                this.enemyRole[i].node.scale = GameConfig.getInstance().soliderScale;
                this.enemyRole[i].node.runAction(cc.fadeIn(0.5));
            }
            this.playSoliderAnima(roleType, Action.Idle, lv);
        }
        else {
            roleType = RoleType.Neutral;
            this.curOtherUnit = this.neutralPool.pop();
            this.totalUnit += this.curOtherUnit;
            let pos = this.npcPosList.shift();
            this.genNpcOnPos(pos);
            this.wavePos = pos.y;
        }

    }

    /**
     * @description: 生成Npc的位置
     * @param {object} pos 位置
     * @return {*}
     */
    genNpcOnPos(pos: { x: number, y: number }) {
        this.npcRole.active = true;
        this.npcRole.stopAllActions();
        this.npcRole.opacity = 255;
        let idx = Math.floor(Math.random() * Res.getInstance().npcSprite.length);
        this.npcId = idx;
        this.npcRole.getComponent(cc.Sprite).spriteFrame = Res.getInstance().npcSprite[idx];
        this.npcRole.x = pos.x;
        this.npcRole.y = pos.y;
        if (pos.x > 0)
            this.npcRole.scaleX = -1;
        else
            this.npcRole.scaleX = 1;
    }

    /**
     * @description: 获取其他士兵的站位数组
     * @param {*}
     * @return {*}
     */
    getEnemySoliderPos(startY: number): Array<any> {
        let array = new Array()
        //第一排
        array.push({ x: 0, y: startY })
        array.push({ x: -80, y: startY })
        array.push({ x: 80, y: startY })
        array.push({ x: -160, y: startY })
        array.push({ x: 160, y: startY })
        //第二排
        array.push({ x: 0, y: startY - 70 })
        array.push({ x: -80, y: startY - 70 })
        array.push({ x: 80, y: startY - 70 })
        array.push({ x: -160, y: startY - 70 })
        array.push({ x: 160, y: startY - 70 })
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
                //第一排：
                array.push({ x: -80, y: startY })
                array.push({ x: 80, y: startY })
                array.push({ x: -160, y: startY })
                array.push({ x: 160, y: startY })
                //第二排
                array.push({ x: -32, y: startY - 70 })
                array.push({ x: 32, y: startY - 70 })
                array.push({ x: -96, y: startY - 70 })
                array.push({ x: 96, y: startY - 70 })
                array.push({ x: -160, y: startY - 70 })
                array.push({ x: 160, y: startY - 70 })

                // for (let i = 0; i < 10; i++) {
                //     let x = (i % 5) * 80 - 160;
                //     let y = -Math.floor(i / 5) * 100 + startY - 100;
                //     array.push({ x: x, y: y });
                // }
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
        let pos = this.getMineSoliderPos(action, GameConfig.getInstance().CCTargetPosY);
        this.playSoliderAnima(RoleType.Mine, Action.Run, GameData.getInstance().soliderLv);
        for (let i = 0; i < this.mineRole.length; i++) {
            if (this.mineRole[i].node.active) {
                this.mineRole[i].node.stopAllActions();
                this.mineRole[i].node.runAction(cc.moveTo(duration, cc.v2(pos[i].x, pos[i].y)));
            }
            else {
                this.mineRole[i].node.setPosition(pos[i].x, pos[i].y);
            }
        }
        // this.heroAnima.node.stopAllActions();
        // if (action == Action.Attack)
        //     this.heroAnima.node.runAction(cc.moveTo(duration, cc.v2(0, GameConfig.getInstance().CCStartPosY - 100)));
        // else
        //     this.heroAnima.node.runAction(cc.moveTo(duration, cc.v2(0, GameConfig.getInstance().CCStartPosY)));

        this.scheduleOnce(function () {
            this.playSoliderAnima(RoleType.Mine, Action.Idle, GameData.getInstance().soliderLv);
            if (call)
                call();
        }.bind(this), duration + 0.05);
    }

    /**
     * @description: 背景滚动
     * @param {*} dt
     * @return {*}
     */
    scrollBg(dt) {
        for (let i = 0; i < this.bgList.length; i++) {
            for (let j = 0; j < this.bgList[i].length; j++) {
                this.bgList[i][j].node.y -= GameConfig.getInstance().BgSpDown * dt;
                if (this.bgList[i][j].node.y < -1600) {
                    this.bgList[i][j].node.y += 1600 * 3;
                    this.switchBgPic(i, this.bgList[i][j]);
                }
            }
        }

        for (let i = 0; i < this.npcPosList.length; i++) {
            this.npcPosList[i].y -= GameConfig.getInstance().BgSpDown * dt;
        }
    }

    /**
     * @description: 士兵滚动往下走
     * @param {*} dt
     * @return {*}
     */
    scrollRole(dt) {
        if (this.heroAnima.node.y < GameConfig.getInstance().CCTargetPosY) {
            this.heroAnima.node.y += dt * GameConfig.getInstance().BgSpDown;
            for (let i = 0; i < this.mineRole.length; i++) {
                this.mineRole[i].node.y += dt * GameConfig.getInstance().BgSpDown;
            }

            if (this.heroAnima.node.y > GameConfig.getInstance().CCTargetPosY) {
                let delta = this.heroAnima.node.y - GameConfig.getInstance().CCTargetPosY;
                this.heroAnima.node.y = GameConfig.getInstance().CCTargetPosY
                for (let i = 0; i < this.mineRole.length; i++) {
                    this.mineRole[i].node.y -= delta;
                }
            }
            this.scrollBg(-dt);
        }
        else {
            for (let i = 0; i < this.enemyRole.length; i++) {
                this.enemyRole[i].node.y -= dt * GameConfig.getInstance().BgSpDown;
            }
            this.wavePos -= dt * GameConfig.getInstance().BgSpDown;
            this.npcRole.y -= dt * GameConfig.getInstance().BgSpDown;
        }


        if (Math.abs(this.wavePos - this.heroAnima.node.y) <= 150) {
            this.gameState = null;
            if (this.isFightWave(this.curWave)) {
                this.gameState = GameState.Fight;
                Sound.getInstance().playSound(SoundType.MeetEnemy);
            }
            else {
                this.gameState = GameState.Answer;
                Sound.getInstance().playSound(SoundType.MeetNpc);
            }

            this.playHeroAnima(Action.Idle);
            this.playSoliderAnima(RoleType.Mine, Action.Idle, GameData.getInstance().soliderLv);

            this.scheduleOnce(function () {
                if (this.gameMode == GameMode.Pattern) {
                    if (this.gameState == GameState.Answer) {
                        UI.getInstance().showUI("Problem", {
                            waveIdx: this.curWave + 1,
                            npcId: this.npcId,
                            call: function (result) {
                                this.answerResult(result);
                            }.bind(this),
                            duration: Infinity
                        });
                    }
                    else {
                        this.originSoliderNum = GameData.getInstance().soliderNum;
                        this.switchSoliderFormat(Action.Attack, function () {
                            this.startFight();
                        }.bind(this))
                    }
                }
                else {
                    this.switchSoliderFormat(Action.Attack, function () {
                        this.originSoliderNum = GameData.getInstance().soliderNum;
                        this.startFight(0.5, 10);
                        UI.getInstance().showUI("Problem", {
                            waveIdx: this.curWave + 1,
                            npcId: Math.floor(Math.random() * Res.getInstance().npcSprite.length),
                            call: function (result) {
                                this.answerResult(result);
                            }.bind(this),
                            duration: 10,
                        })
                    }.bind(this))
                }
            }.bind(this), 0.5)
        }
    }


    /**
     * @description: 战斗 
     * @param {*} fightDuration 战斗间隔
     * @return {*}
     */
    startFight(fightDuration = 1, soliderLoss = GameConfig.getInstance().lv2Solider[GameData.getInstance().soliderLv]) {
        this.playHeroAnima(Action.Attack);
        this.playSoliderAnima(RoleType.Mine, Action.Attack, GameData.getInstance().soliderLv);
        this.playSoliderAnima(RoleType.Enemy, Action.Attack, GameData.getInstance().soliderLv);

        Sound.getInstance().playSound(SoundType.Fight, true);
        console.log("startFight:" + this.curOtherUnit)

        //做个延时，因为攻击动画有延时
        this.scheduleOnce(function () {
            this.fightTimer = setInterval(function () {
                if (GameData.getInstance().soliderNum > 0)
                    this.curEnemyNum -= soliderLoss;
                this.curOtherUnit = Math.ceil(this.curEnemyNum / GameConfig.getInstance().lv2Solider[GameData.getInstance().soliderLv]);
                for (let i = 0; i < this.enemyRole.length; i++) {
                    if (this.enemyRole[i].node.active && i >= this.curOtherUnit) {
                        this.soliderDead(this.enemyRole[i].node)
                    }
                }
                GameData.getInstance().soliderNum -= soliderLoss;
                if (GameData.getInstance().soliderNum < 0)
                    GameData.getInstance().soliderNum = 0;
                this.refreshSoliderNum(-1);
                let num = this.getMineSoliderUnitNum()
                for (let i = 0; i < this.mineRole.length; i++) {
                    if (this.mineRole[i].node.active && i >= num)
                        this.soliderDead(this.mineRole[i].node)
                }

                if (num <= 0) {
                    clearInterval(this.fightTimer);
                    this.playHeroAnima(Action.Idle);
                    this.playSoliderAnima(RoleType.Enemy, Action.Idle, GameData.getInstance().soliderLv);
                    Sound.getInstance().stopSound(SoundType.Fight);
                    Sound.getInstance().playSound(SoundType.FigthWin);

                    if (this.gameState == GameState.Over)
                        return;
                    this.scheduleOnce(function () {
                        if (this.gameState == GameState.Over)
                            return;
                        this.gameOver()
                        if (this.gameMode == GameMode.Pattern) {
                            UI.getInstance().showUI('Result', false);
                            console.log("[Pattern Model GameOver]");
                        }
                        else {
                            UI.getInstance().hideUI("Problem");
                            UI.getInstance().showUI("Record", { record: this.record })
                            console.log("[Endless Model GameOver]");
                        }
                    }.bind(this), 1)
                    return;
                }

                if (this.curOtherUnit <= 0) {
                    clearInterval(this.fightTimer);
                    this.playHeroAnima(Action.Idle);
                    this.playSoliderAnima(RoleType.Mine, Action.Idle, GameData.getInstance().soliderLv);
                    Sound.getInstance().stopSound(SoundType.Fight);
                    UI.getInstance().showFloatMsg("本次战斗消耗了你{0}兵力".format(this.originSoliderNum - GameData.getInstance().soliderNum));
                    this.scheduleOnce(function () {
                        if (this.curWave == 9) {
                            this.gameOver();
                            UI.getInstance().showUI('Result', true);
                            return;
                        }
                        this.nextWave(GameConfig.getInstance().WaveStartPosY + 400, GameData.getInstance().soliderLv);
                        this.switchSoliderFormat(Action.Run, function () {
                            this.gameState = GameState.Rush;
                            this.playHeroAnima(Action.Run);
                            this.playSoliderAnima(RoleType.Mine, Action.Run, GameData.getInstance().soliderLv);
                        }.bind(this));
                    }.bind(this), 1);
                }
            }.bind(this), fightDuration * 1000)
        }.bind(this), 0.5);
    }

    /**
     * @description:答题结果
     * @param {boolean} result
     * @return {*}
     */
    answerResult(result: boolean) {
        if (this.gameState == GameState.Over)
            return;
        let delay = 0.55;

        if (this.gameMode == GameMode.Pattern) {
            if (result) {
                UI.getInstance().showFloatMsg("回答正确，有{0}村民加入了你".format(this.curOtherUnit * GameConfig.getInstance().lv2Solider[GameData.getInstance().soliderLv]));
                Sound.getInstance().playSound(SoundType.AnswerRight);
                console.log("答对了");
                this.npcRole.runAction(cc.fadeOut(0.5));
                GameData.getInstance().soliderNum += this.curOtherUnit * GameConfig.getInstance().lv2Solider[GameData.getInstance().soliderLv];
                let num = this.getMineSoliderUnitNum();
                for (let i = 0; i < this.mineRole.length; i++) {
                    num--;
                    if (num < 0)
                        break;
                    if (this.mineRole[i].node.active)
                        continue;
                    else {
                        this.mineRole[i].node.active = true;
                        this.mineRole[i].node.opacity = 0;
                        this.mineRole[i].node.runAction(cc.fadeIn(0.5));
                        this.playBornEffect(this.mineRole[i].node.position);
                    }
                }
                delay = 1;
                this.refreshSoliderNum(1);
            }
            else {
                UI.getInstance().showFloatMsg("回答错误，村民不愿意加入你的队伍");
                Sound.getInstance().playSound(SoundType.AnswerWrong);
                console.log("答错了");
                this.npcRole.runAction(cc.fadeOut(0.5));
            }

            for (let i = 0; i < this.enemyRole.length; i++) {
                this.enemyRole[i].node.runAction(cc.fadeOut(0.5))
            }
            this.scheduleOnce(function () {
                this.playHeroAnima(Action.Run);
                this.playSoliderAnima(RoleType.Mine, Action.Run, GameData.getInstance().soliderLv);
                this.nextWave(GameConfig.getInstance().WaveStartPosY + 400, GameData.getInstance().soliderLv);
                this.gameState = GameState.Rush;
            }.bind(this), delay);
        }
        else {
            if (this.fightTimer != 0) {
                clearInterval(this.fightTimer);
                this.fightTimer = 0;
            }

            if (result) {
                this.record++;
                this.refreshRecord();
                UI.getInstance().showFloatMsg("回答正确,本次战斗消耗了你{0}兵力".format(this.originSoliderNum - GameData.getInstance().soliderNum));
            }
            else {
                let unitNum = GameConfig.getInstance().lv2Solider[GameData.getInstance().soliderLv];
                unitNum = unitNum * 2;

                UI.getInstance().showFloatMsg("回答错误,本次战斗消耗了你{0}兵力".format(unitNum));
                GameData.getInstance().soliderNum = this.originSoliderNum - unitNum;
                if (GameData.getInstance().soliderNum <= 0)
                    GameData.getInstance().soliderNum = 0;
                this.refreshSoliderNum(-1);
                let num = this.getMineSoliderUnitNum();
                console.log("num:" + num)
                for (let i = 0; i < this.mineRole.length; i++) {
                    if (this.mineRole[i].node.active && i >= num) {
                        this.soliderDead(this.mineRole[i].node);
                    }
                }

                if (GameData.getInstance().soliderNum <= 0) {
                    this.gameOver();
                    Sound.getInstance().stopSound(SoundType.Fight);
                    UI.getInstance().showUI("Record", { record: this.record })
                    return;
                }
            }


            for (let i = 0; i < this.enemyRole.length; i++) {
                if (this.enemyRole[i].node.active) {
                    this.soliderDead(this.enemyRole[i].node);
                }
            }

            this.scheduleOnce(function () {
                this.switchSoliderFormat(Action.Idle, function () {
                    this.playHeroAnima(Action.Run);
                    this.playSoliderAnima(RoleType.Mine, Action.Run, GameData.getInstance().soliderLv);
                    this.nextWave(GameConfig.getInstance().WaveStartPosY + 400, GameData.getInstance().soliderLv);
                    this.gameState = GameState.Rush;
                }.bind(this));
            }.bind(this), delay)

        }
    }

    /**
     * @description: 同步影子
     * @param {*}
     * @return {*}
     */
    syncShadow() {
        this.shadow[0].setPosition(this.heroAnima.node.x, this.heroAnima.node.y + 20);
        this.shadow[1].setPosition(this.npcRole.x, this.npcRole.y - 40);
        this.shadow[1].opacity = this.npcRole.opacity;
        for (let i = 0; i < this.mineRole.length; i++) {
            this.shadow[i + 2].scale = GameConfig.getInstance().soliderScale;
            this.shadow[i + 2].active = this.mineRole[i].node.active;
            this.shadow[i + 2].setPosition(this.mineRole[i].node.x, this.mineRole[i].node.y + 20);
            this.shadow[i + 2].opacity = this.mineRole[i].node.opacity;
        }
        for (let i = 0; i < this.enemyRole.length; i++) {
            this.shadow[i + 12].scale = GameConfig.getInstance().soliderScale;
            this.shadow[i + 12].active = this.enemyRole[i].node.active && this.enemyRole[i].skeletonData != null;
            this.shadow[i + 12].setPosition(this.enemyRole[i].node.x, this.enemyRole[i].node.y + 20);
            this.shadow[i + 12].opacity = this.enemyRole[i].node.opacity;
        }
    }

    /**
     * @description: 切换背景图片
     * @param {number} idx 0-路面层 1-场景层
     * @param {cc} sprite
     * @return {*}
     */
    switchBgPic(idx: number, sprite: cc.Sprite) {
        let i: number = Math.floor(Math.random() * Res.getInstance().sceneSprite[idx].length);
        sprite.spriteFrame = Res.getInstance().sceneSprite[idx][i];
        sprite.node.height = 1600;

        if (idx == 1) {
            this.setNpcPos(sprite.spriteFrame.name, sprite.node.y);
        }
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
            array = this.enemyRole;
            lv = 0;//写死敌兵1级资源
        }

        for (let i = 0; i < array.length; i++) {
            array[i].clearTracks();
            if (name == Action.Attack) {
                this.scheduleOnce(function () {
                    array[i].skeletonData = Res.getInstance().soliderAnima[role][name][lv + 1];
                    array[i].premultipliedAlpha = false;
                    array[i].setAnimation(0, "animation", true);
                }, Math.random());

            }
            else {
                array[i].skeletonData = Res.getInstance().soliderAnima[role][name][lv + 1];
                array[i].premultipliedAlpha = false;
                array[i].setAnimation(0, "animation", true);
            }
        }

        if (role == RoleType.Mine && name == Action.Run) {
            Sound.getInstance().playSound(SoundType.SoliderRun);
        }
    }

    /**
     * @description: 播放曹操动画
     * @param {Action} name
     * @return {*}
     */
    playHeroAnima(name: Action) {
        this.heroAnima.skeletonData = Res.getInstance().heroAnima[name];
        this.heroAnima.premultipliedAlpha = false;
        this.heroAnima.clearTracks();
        this.heroAnima.setAnimation(0, "animation", true);

        if (name == Action.Run)
            Sound.getInstance().playSound(SoundType.CCRun)
    }

    /**
     * @description: 当前波数是否为战斗
     * @param {number} idx
     * @return {*}
     */
    isFightWave(idx: number) {
        if (this.gameMode == GameMode.Pattern) {
            if (idx % 3 == 0 && idx > 0)
                return true;
            return false;
        }
        if (this.gameMode == GameMode.Endless) {
            return true;
        }
    }

    /**
     * @description:刷新当前小兵的数量
     * @param {*}-1:down 1:raise 0:equal
     * @return {*}
     */
    refreshSoliderNum(state: number) {
        if (state == 0)
            this.soliderNumState.node.active = false;
        else {
            this.soliderNumState.node.active = true;
            if (state == 1)
                this.soliderNumState.spriteFrame = Res.getInstance().commonSprite.get('up');
            if (state == -1)
                this.soliderNumState.spriteFrame = Res.getInstance().commonSprite.get('down');
        }
        this.soliderNumTxt.string = "" + GameData.getInstance().soliderNum;
    }

    /**
     * @description: 刷新破釜沉舟模式的记录
     * @param {*}
     * @return {*}
     */
    refreshRecord() {
        this.recordTxt.string = "已成功闯过{0}关".format(this.record);
        this.recordShadowTxt.string = this.recordTxt.string;
    }

    /**
     * @description: 获取我方小兵单位数量
     * @param {*}
     * @return {*}
     */
    getMineSoliderUnitNum() {
        return Math.ceil(GameData.getInstance().soliderNum / GameConfig.getInstance().lv2Solider[GameData.getInstance().soliderLv]);
    }

    /**
     * @description: 播放获得小兵的特效
     * @param {*} node
     * @return {*}
     */
    playGetSoliderEffect(node) {
        node.runAction(cc.fadeOut(0));
        node.runAction(cc.fadeIn(0.4));
    }

    /**
     * @description: 播放士兵的出现动画
     * @param {*} pos
     * @return {*}
     */
    playBornEffect(pos) {
        let node = new cc.Node('e');
        this.effectParent.addChild(node);
        node.setPosition(pos.x, pos.y);
        node.active = true;
        node.addComponent(sp.Skeleton);
        let spc: sp.Skeleton = node.getComponent(sp.Skeleton);
        spc.skeletonData = Res.getInstance().bornEffect;
        spc.loop = false;
        spc.premultipliedAlpha = false;
        spc.setAnimation(0, "animation", false);
        setTimeout(() => { spc.node.destroy(); }, spc.findAnimation('animation').duration * 1000);
    }

    gameOver() {
        this.unscheduleAllCallbacks();
        this.gameState = GameState.Over;
    }

    /**
     * @description: 士兵死亡渐渐消失
     * @param {*} solider
     * @return {*}
     */
    soliderDead(solider: cc.Node) {
        solider.stopAllActions();
        solider.runAction(cc.sequence(
            cc.fadeOut(0.4),
            cc.callFunc(function () {
                solider.opacity = 255;
                solider.active = false;
            }.bind(this))
        ))
    }

    /**
     * @description: 继续游戏，进入无尽模式
     * @param {*}
     * @return {*}
     */
    onContinue() {
        Sound.getInstance().playBgm(BgmType.FightBgm);
        this.switchSoliderFormat(Action.Idle, function () {
            this.recordNode.active = true;
            this.recordHistoryTxt.string = "*最高记录：成功闯过{0}关".format(GameData.getInstance().endlessRecord);
            this.record = 0;
            this.refreshRecord();

            this.gameState = GameState.Rush;
            this.gameMode = GameMode.Endless;
            this.playHeroAnima(Action.Run);
            this.playSoliderAnima(RoleType.Mine, Action.Run, GameData.getInstance().soliderLv);
            this.nextWave(GameConfig.getInstance().WaveStartPosY, GameData.getInstance().soliderLv);
        }.bind(this))
    }

    /**
     * @description: 重试
     * @param {*}
     * @return {*}
     */
    onRetry() {
        this.onShow({});
    }

    onRelive() {
        Sound.getInstance().playBgm(BgmType.FightBgm);
        for (let i = 0; i < this.enemyRole.length; i++) {
            if (this.enemyRole[i].node.active) {
                this.soliderDead(this.enemyRole[i].node);
            }
        }
        UI.getInstance().hideUI("Result")
        this.playHeroAnima(Action.Idle);
        this.switchSoliderFormat(Action.Idle, function () {
            this.gameState = GameState.Rush;
            this.gameMode = GameMode.Pattern;
            this.playHeroAnima(Action.Run);
            this.nextWave(GameConfig.getInstance().WaveStartPosY, GameData.getInstance().soliderLv);
        }.bind(this))
    }

    onHide(params) {

    }

}
