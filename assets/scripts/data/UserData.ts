/*
 * @Author: your name
 * @Date: 2021-08-24 00:26:36
 * @LastEditTime: 2021-09-15 11:20:59
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

  public init() { }

  public load(data: string) {
    let obj = JSON.parse(data);
    this.GameID = obj.id;
    this.Name = obj.name;
    this.Phone = obj.tel;
    this.Address = obj.address;
    this.Mail = obj.mail
  }
}
