/*
 * @Author: your name
 * @Date: 2021-08-30 14:22:32
 * @LastEditTime: 2021-09-06 15:47:32
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \cocos_ts_frame\assets\scripts\config\GameConfig.ts
 */
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import IManager from "../base/IManager";

export default class GameConfig extends IManager {
    public BgSpDown: number = 200;//底层背景的移动速度
    public BgSpUp: number = 80;//云彩的移动速度
    public roleScale: number = 1;//曹操缩放比例
    public mineScale: number = 0.8;//士兵的缩放比例
    public enemyScale: number = 0.8;//敌兵的缩放比例
    public neutralScale: number = 1;//中立士兵相对其他士兵的缩放比例
    public TotalWave: number = 10;//总波数
    public WaveDelta: number = 1000;//每一波间隔的距离
    public WaveStartPosY: number = 200;//第一波的起始位置
    public CCStartPosY: number = -350;//曹操的起始y坐标
    public battlePosY: number = -350;// 我方小兵的战斗y坐标

    public roundSoliderNum: number = 1000;//每局开局的小兵数量

    public lv2Solider: number[] = [1000, 2000, 3000, 4000, 5000];
}
