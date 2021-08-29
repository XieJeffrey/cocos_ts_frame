/*
 * @Author: your name
 * @Date: 2021-08-23 11:20:53
 * @LastEditTime: 2021-08-29 19:51:50
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
        ['Dialog',{prefab:'Dialog',order:20,script:"Dialog"}]
    ])

    public static preload = ["Menu"]
}