/*
 * @Author: your name
 * @Date: 2021-08-23 11:56:09
 * @LastEditTime: 2021-08-24 00:24:28
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
import Net  from "./module/Net";
const { ccclass, property } = cc._decorator;

@ccclass
export default class App {
    ui: UI = UI.getInstance() as UI;
    sound: Sound = Sound.getInstance() as Sound;
    event: Event = Event.getInstance() as Event;
    net:Net= Net.getInstance() as Net;

    curInit: number = 5;
    totalInit: number = 0;
    initCall:Function=null;
    init(call: Function) {
        this.initCall=call;
        this.ui.init().then(this.inited);
        this.sound.init().then(this.inited);
        this.event.init().then(this.inited);
        this.net.init().then(this.inited);
    }



    inited() {

    }
}
