/*
 * @Author: your name
 * @Date: 2021-08-23 11:57:30
 * @LastEditTime: 2021-08-24 16:11:19
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \cocos_ts_frame\assets\scripts\module\Res.ts
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
export default class Res extends IManager {
    spriteBundle: cc.AssetManager.Bundle = null;
    skeletonBundle: cc.AssetManager.Bundle = null;

    init() {
        return new Promise((resolve, reject) => {
            let loadNum = 0;
            cc.assetManager.loadBundle("image", function (err, bundle) {
                if (err) {
                    console.log("[load image res fail]");
                    console.error(err);
                    reject();
                    return;
                }
                this.spriteBundle = bundle;
                loadNum++
                if (loadNum == 2) {
                    resolve(1)
                    console.log("[res inited]")
                }
            }.bind(this))

            cc.assetManager.loadBundle("skeleton", function (err, bundle) {
                if (err) {
                    console.log("[load skeleton res fail]");
                    console.error(err);
                    reject();
                    return;
                }
                this.skeletonBundle = bundle;
                resolve(1);
                loadNum++
                if (loadNum == 2) {
                    resolve(1)
                    console.log("[res inited]")
                }
            })

        })
    }

    /**
     * @description: 加载图片资源
     * @param {string} name
     * @return {*}
     */
    loadSprite(name: string) {
        if (this.spriteBundle) {
            this.spriteBundle.load(name, cc.SpriteFrame, function (err, spriteFrame) {
                if (err) {
                    console.log("[load image fail]:{0}".format(name))
                    console.error("err")
                    return null;
                }
                return spriteFrame;
            })
        }
    }

}
