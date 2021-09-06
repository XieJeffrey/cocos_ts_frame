/*
 * @Author: your name
 * @Date: 2021-08-24 00:26:36
 * @LastEditTime: 2021-09-06 11:02:49
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \cocos_ts_frame\assets\scripts\data\UserData.ts
 */
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import IManager from "../base/IManager";

export default class UserData extends IManager {
  public GameID: string = "";
  public Mail: string = "";
  public Phone: string = "";
  public Name: string = "";
  public Address: string = ""

  public static init() { }

  public static load(data: string) {

  }
}
