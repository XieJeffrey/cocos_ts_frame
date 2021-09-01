/*
 * @Author: your name
 * @Date: 2021-08-23 17:37:41
 * @LastEditTime: 2021-09-01 17:35:26
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
    //拦路小兵
    curWave: number;//当前波数
    wavePos: number;//小兵的y坐标
    pool: {
        sand: Array<cc.Node>;
        tree: Array<cc.Node>;
    }

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
        bgNode.findChild('2').addChild(this.cloud);
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
        let soliderNode: cc.Node = this.node.findChild('role/mine')
        for (let i = 0; i < 10; i++) {
            let solider = new cc.Node('' + i)
            soliderNode.addChild(solider);
            solider.scale = GameConfig.soliderScale;
            this.mineRole.push(solider.addComponent(sp.Skeleton));
        }
        //中立|敌对小兵    
        soliderNode = this.node.findChild('role/other')
        for (let i = 0; i < 10; i++) {
            let solider = new cc.Node('' + i)
            soliderNode.addChild(solider);
            solider.scale = GameConfig.soliderScale;
            this.otherRole.push(solider.addComponent(sp.Skeleton));
        }

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
        UI.getInstance().showUI("Dialog", "周公吐哺，天下归心");
    }

    update(dt) {
        switch (this.gameState) {
            case GameState.Rush:
                this.scrollBg(dt);
                this.scrollSolider(dt);
                break;

            default:
                break;
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
        this.heroAnima.node.setPosition(0, GameConfig.CCStartPosY);
        this.playHeroAnima(Action.Idle);
        this.playSoliderAnima(RoleType.Mine, Action.Idle, GameData.soliderLv);

        let pos = this.getMineSoliderPos(Action.Idle, GameConfig.CCStartPosY)
        for (let i = 0; i < this.mineRole.length; i++) {
            this.mineRole[i].node.active = true;
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
        this.wavePos = posY// GameConfig.WaveStartPosY + 800 + Math.random() * 200
        let pos = this.getOtherSoliderPos(this.wavePos);
        for (let i = 0; i < this.otherRole.length; i++) {
            this.otherRole[i].node.active = true;
            this.otherRole[i].node.setPosition(pos[i].x, pos[i].y);
            this.otherRole[i].node.scale = GameConfig.soliderScale;
            if (roleType == RoleType.Neutral) {
                this.otherRole[i].node.scale *= GameConfig.zlScaleFactor;
            }
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
    getMineSoliderPos(action: Action, startY: number): Array<any> {
        let array = new Array()

        switch (action) {
            case Action.Attack:
                for (let i = 0; i < 10; i++) {
                    let x = (i % 5) * 50 - 100;
                    let y = -Math.floor(i / 5) * 30 - 30 + startY;
                    array.push({ x: x, y: y });
                }
                break;
            default:
                for (let i = 0; i < 10; i++) {
                    let x = (i % 2) * 100 - 50
                    let y = -Math.floor(i / 2) * 60 - 50 + startY;
                    array.push({ x: x, y: y })
                }
                break;
        }
        return array;
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

        this.cloud.y -= GameConfig.BgSpUp * dt;
        if (this.cloud.y < -1600) {
            this.cloud.y += 3200 + Math.random() * 800;
        }
    }

    /**
     * @description: 士兵滚动往下走
     * @param {*} dt
     * @return {*}
     */
    scrollSolider(dt) {
        for (let i = 0; i < this.otherRole.length; i++) {
            this.otherRole[i].node.y -= dt * GameConfig.BgSpDown;
        }
        this.wavePos -= dt * GameConfig.BgSpDown;
        if (Math.abs(this.wavePos - this.heroAnima.node.y) <= 100) {
            this.gameState = GameState.Answer;
            this.playHeroAnima(Action.Idle);
            this.playSoliderAnima(RoleType.Neutral, Action.Idle, 1);
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



    onHide(params) { }


}
