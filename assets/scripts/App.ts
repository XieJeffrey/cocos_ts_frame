/*
 * @Author: your name
 * @Date: 2021-08-23 11:56:09
 * @LastEditTime: 2021-09-27 17:16:08
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \cocos_ts_frame\assets\scripts\App.ts
 */
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import Event from "./module/Event";
import Sound from "./module/Sound";
import UI from "./module/UI";
import Net from "./module/Net";
import IManager from "./base/IManager";
import Storage from "./module/Storage";
import Res from "./module/Res";
import Question from "./manager/Question";
import LogicMgr from "./manager/LogicMgr";
const { ccclass, property } = cc._decorator;

@ccclass
export default class App {
    ui: UI = UI.getInstance() as UI;
    sound: Sound = Sound.getInstance() as Sound;
    event: Event = Event.getInstance() as Event;
    net: Net = Net.getInstance() as Net;
    storage: Storage = Storage.getInstance() as Storage;
    res: Res = Res.getInstance() as Res;
    question: Question = Question.getInstance() as Question;
    logicMgr: LogicMgr = LogicMgr.getInstance() as LogicMgr;

    curInited: number = 0;
    total: number = 6;
    initCall: Function = null;

    public init(call: Function) {
        this.initCall = call;

        this.storage.init().then(function () {
            this.logicMgr.init().then(function () { this.inited() }.bind(this));
            this.inited()
        }.bind(this));
        this.sound.init().then(function () { this.inited() }.bind(this));
        this.res.init().then(function () { this.inited() }.bind(this));
        this.ui.init().then(function () { this.inited() }.bind(this));
        this.question.init().then(function () { this.inited() }.bind(this));
    }

    inited() {
        if (this.initCall) {
            this.curInited++;
            this.initCall({ cur: this.curInited, total: this.total })
        }
    }
}
