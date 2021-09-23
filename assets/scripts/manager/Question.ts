/*
 * @Author: your name
 * @Date: 2021-08-24 17:22:35
 * @LastEditTime: 2021-09-23 19:36:16
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
import { GameMode } from "../common/BaseType";

const { ccclass, property } = cc._decorator;
let normal = [10003, 10004, 10005, 10006, 100010, 10014, 10016, 10018, 10139, 10225, 10253, 10254, 10255, 10281, 10306, 10314, 10335, 10403, 10405, 10410,
    10425, 10426, 10427, 10428, 10429, 10430, 10431, 10432, 10433, 10434, 10435, 10436, 10437, 10438, 10439, 10440, 10441, 10442, 10443, 10445, 10446,
    10447, 10448, 10449, 10450, 10451, 10452, 10453, 10454, 10455
]
@ccclass
export default class Question extends IManager {
    question: Object;

    init() {
        // cc.resources.load('config/question', cc.TextAsset, function (err, data: cc.TextAsset) {
        //     if (err) {
        //         console.log(err);
        //         return;
        //     }
        //     let array: Array<{ ID: string, cn: string }> = JSON.parse(data.text);
        //     let output = {};
        //     for (let i = 0; i < array.length; i++) {
        //         //     console.log(array[i].cn)
        //         if (array[i].ID.split('_').length == 2) {
        //             let id = array[i].ID.split('_')[1]
        //             output[id] = {
        //                 cn: "",
        //                 option: {},
        //             }
        //             output[id].cn = array[i].cn
        //         }
        //         if (array[i].ID.split('_').length == 3) {
        //             let id = array[i].ID.split('_')[1];
        //             let option = array[i].ID.split('_')[2];
        //             output[id].option[option] = array[i].cn;
        //         }
        //     }

        //     console.log(output)
        //     let outStr = JSON.stringify(output);
        //     console.log(outStr)
        // })


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
    getQuestion(model: GameMode) {
        let length = Object.keys(this.question).length;
        let idx = Math.floor(Math.random() * length);
        let key: string = Object.keys(this.question)[idx]
        if (model == GameMode.Pattern) {
            while (!this.checkIsNormal(key)) {
                idx = Math.floor(Math.random() * length);
                key = Object.keys(this.question)[idx]
            }
        }
        else {
            while (this.checkIsNormal(key)) {
                idx = Math.floor(Math.random() * length);
                key = Object.keys(this.question)[idx]
            }
        }
        console.log(this.question[key])
        return JSON.stringify(this.question[key]);
    }

    /**
     * @description: 检测是否是普通模式的题库
     * @param {string} key
     * @return {*}
     */
    checkIsNormal(key: string) {
        for (let i = 0; i < normal.length; i++) {
            if (normal[i] == parseInt(key))
                return true;
        }
        return false;
    }
}
