/*
 * @Author: your name
 * @Date: 2021-08-23 11:57:30
 * @LastEditTime: 2021-08-28 23:15:21
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
    scene_sand:Array<cc.SpriteFrame>=null;
    scene_tree:Array<cc.SpriteFrame>=null;

    init() {
        return new Promise((resolve, reject) => {
            let loadNum = 0;
            let total=4;
            let checkLoaded=function(){
                if(loadNum==total){
                    resolve(1)
                    console.log("[res inited]");
                }
            }

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

            //加载骨骼的bundle
            cc.assetManager.loadBundle("skeleton", function (err, bundle) {
                if (err) {
                    console.log("[load skeleton res fail]");
                    console.error(err);
                    reject();
                    return;
                }
                this.skeletonBundle = bundle;
                resolve(1);
                loadNum++;
                checkLoaded();
            })

            //加载场景的沙子
            cc.resources.loadDir("sand",cc.SpriteFrame,function(err,asset){
                if(err){
                    console.log("[load sand res fail]");
                    console.error(err);
                    reject();
                    return;
                }
                this.scene_sand=new Array<cc.SpriteFrame>();
                for(let i=0;i<asset.length;i++){
                    this.scene_sand.push(asset[i]);
                }
                loadNum++;
                checkLoaded();
            }.bind(this))

            //加载场景的树
            cc.resources.loadDir("tree",cc.SpriteFrame,function(err,asset){
                if(err){
                    console.log("[load tree res fail]");
                    console.error(err);
                    reject();
                    return;
                }
                this.scene_tree=new Array<cc.SpriteFrame>();
                for(let i=0;i<asset.length;i++){
                    this.scene_tree.push(asset[i]);
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
