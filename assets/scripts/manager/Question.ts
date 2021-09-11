/*
 * @Author: your name
 * @Date: 2021-08-24 17:22:35
 * @LastEditTime: 2021-09-11 21:58:37
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \cocos_ts_frame\assets\scripts\config\Question.ts
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
export default class Question extends IManager {
    question: Object;

    init() {
        return new Promise(function (resolve, reject) {
            cc.resources.load('config/QuesConfig', cc.JsonAsset, function (err, data) {
                if (err) {
                    console.error(err)
                    return;
                }
                this.question = data.json;
                console.log("[quesion loaded]")
                resolve(1);
            }.bind(this))
        }.bind(this))
    }

    /**
     * @description: 获取题目库
     * @param {*}
     * @return {*}
     */
    getQuestion() {
        let length = Object.keys(this.question).length;
        let idx = Math.floor(Math.random() * length);
        let key: string = Object.keys(this.question)[idx]
        console.log(this.question[key])
        return JSON.stringify(this.question[key]);
    }
}
