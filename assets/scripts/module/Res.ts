/*
 * @Author: your name
 * @Date: 2021-08-23 11:57:30
 * @LastEditTime: 2021-09-02 10:25:00
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
    sceneSprite: Array<Array<cc.SpriteFrame>>;
    cacheSprite: Map<string, cc.SpriteFrame>;
    soliderAnima = {
        zl: {
            zhan: {},
            zou: {},
            attack: {},
        },

        zb: {
            zhan: {},
            zou: {},
            attack: {},
        },
        db: {
            zhan: {},
            zou: {},
            attack: {},
        }
    };
    heroAnima = {
        zhan: null,
        zou: null,
        attack: null,
    }

    init() {
        return new Promise((resolve, reject) => {
            let loadNum = 0;
            let total = 3;
            let checkLoaded = function () {
                if (loadNum == total) {
                    resolve(1)
                    console.log("[res inited]");
                }
            }

            this.cacheSprite = new Map<string, cc.SpriteFrame>();
            //加载图片的bundle
            cc.assetManager.loadBundle("image", function (err, bundle) {
                if (err) {
                    console.log("[load image res fail]");
                    console.error(err);
                    reject();
                    return;
                }
                this.spriteBundle = bundle;
                loadNum++;
                checkLoaded();
            }.bind(this))

            //加载场景的背景
            this.sceneSprite = new Array<Array<cc.SpriteFrame>>();
            cc.resources.loadDir("scene", cc.SpriteFrame, function (err, asset) {
                if (err) {
                    console.log("[load sceneImg res fail]");
                    console.error(err);
                    reject();
                    return;
                }
                for (let i = 0; i < 3; i++) {
                    this.sceneSprite.push(new Array<cc.SpriteFrame>());
                }
                for (let i = 0; i < asset.length; i++) {
                    let name: string = asset[i].name;
                    name = name.replace('bg', '');
                    let idx: number = parseInt(name.split('-')[0]) - 1;
                    this.sceneSprite[idx].push(asset[i]);
                }

                loadNum++;
                checkLoaded();
            }.bind(this))

            //加载士兵的骨骼动画
            cc.resources.loadDir("skeleton/solider", sp.SkeletonData, function (err, asset) {
                if (err) {
                    console.log("[load solider from res fail]")
                    console.error(err)
                    return;
                }

                for (let i = 0; i < asset.length; i++) {
                    let tmp: string[] = asset[i].name.split('_')
                    let camp = tmp[0]
                    let lv = tmp[1]
                    let action = tmp[2]
                    this.soliderAnima[camp][action][lv] = asset[i]
                }
                loadNum++;
                checkLoaded();
            }.bind(this))

            cc.resources.loadDir("skeleton/hero", sp.SkeletonData, function (err, asset) {
                if (err) {
                    console.log("[load hero from res fail]")
                    console.error(err)
                    return;
                }

                for (let i = 0; i < asset.length; i++) {
                    let tmp: string[] = asset[i].name.split('_')

                    let action = tmp[1]
                    this.heroAnima[action] = asset[i]
                }
                loadNum++;
                checkLoaded();
            }.bind(this))
        })
    }

    /**
     * @description: 加载图片资源
     * @param {string} name
     * @return {*}
     */
    loadSprite(sprite: cc.Sprite, name: string) {
        if (this.spriteBundle) {
            if (this.cacheSprite.has(name)) {
                sprite.spriteFrame = this.cacheSprite.get(name);
            }
            else {
                this.spriteBundle.load("game/" + name, cc.SpriteFrame, function (err, spriteFrame) {
                    if (err) {
                        console.log("[load image fail]:{0}".format(name))
                        console.error("err")
                        return null;
                    }
                    this.cacheSprite.set(name, spriteFrame);
                    sprite.spriteFrame = this.cacheSprite.get(name);
                }.bind(this))
            }
        }
    }

}
