/*
 * @Author: your name
 * @Date: 2021-08-30 14:22:32
 * @LastEditTime: 2021-09-20 17:51:39
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
    public url: string = "https://pig2.shaoweiwy.cn:3001";//服务器地址
    public download: string = "https://vda.lilisi.com/tracking?dap_code=c05828ae83f8f47f3c7c39c1e81cfab7";//下载链接
    public GameTip: Array<string> = [
        "帮助村民解答难题，他们将会加入您的队伍，并肩作战"
    ];

    public BgSpDown: number = 300;//底层背景的移动速度
    public BgSpUp: number = 120;//云彩的移动速度
    public roleScale: number = 1;//曹操缩放比例
    public soliderScale: number = 0.8;//士兵的缩放比例 
    public TotalWave: number = 10;//总波数
    public WaveDelta: number = 1000;//每一波间隔的距离
    public WaveStartPosY: number = 200;//第一波的起始位置
    public CCStartPosY: number = -350;//曹操的起始y坐标
    public CCTargetPosY: number = -150;//曹操的最终坐标

    public roundSoliderNum: number = 0;//每局开局的小兵数量

    public lv2Solider: number[] = [100, 200, 400, 600, 1000];
    public isAnswerMuddled: boolean = true;//是否打乱答案顺序
    public activityStart: number = 0;//活动开始时间
    public activityEndTime: number = 0;//活动结束时间

    public exchangeStartTime: number = 0;//兑换开始时间
    public exchangeEndTime: number = 0;//兑换结束时间
    public solider2Point = 1;//兵力跟积分的兑换比例

    public maxPoint2Lv: number[] = [1000, 2000, 4000, 6000, 10000];//积分上限跟兵力的关系
    public troops2lv: number[] = [1, 0.6, 0.4, 0.2, 0.1];//积分兑换各个等级的兵的关系
}
