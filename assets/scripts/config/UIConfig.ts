/*
 * @Author: your name
 * @Date: 2021-08-23 11:20:53
 * @LastEditTime: 2021-09-15 17:01:27
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \cocos_ts_frame\assets\scripts\config\uiConfig.ts
 */
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
export class UIConfig {
    public static uiList = new Map([
        ['Game', { prefab: 'Game', order: 3, script: "Game" }],
        ['Problem', { prefab: 'Problem', order: 4, script: "Problem" }],
        ['Menu', { prefab: 'Game', order: 2, script: "Menu" }],
        ['Float', { prefab: 'Float', order: 100, script: "Float" }],
        ['Dialog', { prefab: 'Dialog', order: 20, script: "Dialog" }],
        ['Rank', { prefab: "Rank", order: 5, script: "Rank" }],
        ['Result', { prefab: "Result", order: 5, script: "Result" }],
        ['Person', { prefab: "Person", order: 5, script: "Person" }],
        ['Loading', { prefab: "Loading", order: 21, script: "Loading" }],
        ['Record', { prefab: "Record", order: 5, script: "Record" }]
    ])

    public static preload = ["Menu"]
}