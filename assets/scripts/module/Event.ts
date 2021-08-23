/*
 * @Author: your name
 * @Date: 2021-08-23 22:58:19
 * @LastEditTime: 2021-08-23 23:27:20
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \cocos_ts_frame\assets\scripts\module\Event.ts
 */
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle funcbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-funcbacks.html

import IManager from "../base/IManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Event extends IManager {
    public eventList: Map<string, [{ func: Function, node: cc.Node }]>;

    init() {
        let promise = new Promise(function (resolve, reject) {
            this.eventList = new Map<string, [{ func: Function, node: cc.Node }]>();
            resolve(1);
        }.bind(this))
        return promise;
    }

    on(name: string, node: cc.Node, func: Function) {
        if (name == "" || node == null || func == null)
            return;

        if (this.eventList.has(name)) {
            let array = this.eventList.get(name);
            array.push({ node: node, func: func });
        }
        else {
            this.eventList.set(name, [{ node: node, func: func }]);
        }
    }

    emit(name: string, param: any) {
        if (this.eventList.has(name)) {
            let array = this.eventList.get(name)
            for (let i = 0; i < array.length; i++) {
                if (array[i].node.active) {
                    array[i].func.call(array[i].node, param);
                }
            }
        }
    }
}
