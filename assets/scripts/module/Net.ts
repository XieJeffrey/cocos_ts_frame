/*
 * @Author: your name
 * @Date: 2021-08-23 23:55:12
 * @LastEditTime: 2021-09-25 23:54:00
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \cocos_ts_frame\assets\scripts\module\Net.ts
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
export default class Net extends IManager {
    get(url) {
        return new Promise((resolve, reject) => {
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    var response = JSON.parse(xhr.responseText);
                    console.log(response);
                    resolve(response);
                }
            };
            console.log(url);
            xhr.open("GET", url, true);
            xhr.send();
        })
    }

    post(url, obj) {
        return new Promise<string>((resolve, reject) => {
            var str = this.obj2qs(obj);
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (xhr.readyState !== 4) return;//忽略未完成的请求
                if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                    var response = xhr.responseText;
                    console.log(JSON.parse(response));
                    resolve(JSON.parse(response));
                }
                else
                    reject();
            };
            console.log('request:' + url + "?" + str);
            xhr.open("POST", url, true);
            xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded;charset=utf-8');
            xhr.send(str);
        })
    }

    obj2qs(obj) {
        let str = "";
        for (let key in obj) {
            str += key + "=" + obj[key] + "&";
        }
        str = str.substr(0, str.length - 1);
        return str;
    }
}
