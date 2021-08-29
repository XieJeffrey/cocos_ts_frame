/*
 * @Author: your name
 * @Date: 2021-08-23 22:58:19
 * @LastEditTime: 2021-08-29 20:36:48
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
    private eventList: Map<number, [{ func: Function, node: cc.Node }]>=new Map<number, [{ func: Function, node: cc.Node }]>();

    on(id: number, node: cc.Node, func: Function) {
        if (node == null || func == null)
            return;

        if (this.eventList.has(id)) {
            let array = this.eventList.get(id);
            array.push({ node: node, func: func });
        }
        else {
            this.eventList.set(id, [{ node: node, func: func }]);
        }
    }

    emit(id: number, param: any) {
        if (this.eventList.has(id)) {
            let array = this.eventList.get(id)
            for (let i = 0; i < array.length; i++) {
                if (array[i].node.active) {
                    array[i].func.call(array[i].node, param);
                }
            }
        }
    }
}
