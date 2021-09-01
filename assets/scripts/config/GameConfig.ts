/*
 * @Author: your name
 * @Date: 2021-08-30 14:22:32
 * @LastEditTime: 2021-09-01 16:58:42
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

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameConfig {
    public static BgSpDown: number = 200;//底层背景的移动速度
    public static BgSpUp: number = 80;//云彩的移动速度
    public static roleScale: number = 0.4;//曹操缩放比例
    public static soliderScale: number = 0.2;//士兵的缩放比例
    public static zlScaleFactor: number = 1.5;//中立士兵相对其他士兵的缩放比例
    public static TotalWave: number = 10;//总波数
    public static WaveDelta: number = 1000;//每一波间隔的距离
    public static WaveStartPosY: number = 200;//第一波的起始位置
    public static CCStartPosY: number = -350;//曹操的起始y坐标
}
