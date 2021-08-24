/*
 * @Author: your name
 * @Date: 2021-08-23 21:10:42
 * @LastEditTime: 2021-08-24 11:29:21
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \cocos_ts_frame\assets\scripts\module\Sound.ts
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
export default class Sound extends IManager {
    audioBundle: cc.AssetManager.Bundle;
    musicOn: Boolean;
    bgmCache: Map<string, cc.AudioClip> = new Map<string, cc.AudioClip>();
    soundCache: Map<string, cc.AudioClip> = new Map<string, cc.AudioClip>();

    /**
     * @description: 初始化
     * @param {*}
     * @return {*}
     */
    public init() {
        super.init()
        let promise = new Promise(function (resolve, reject) {
            var local = cc.sys.localStorage.getItem('Music');
            if (local === "" || local === null || local === 0)
                this.musicOn = false;
            else {
                this.musicOn = true;
            }

            cc.assetManager.loadBundle('audios', function (err, bundle) {
                if (err) {
                    console.error(err);
                    reject();
                    return;
                }
                this.audioBundle = bundle;
                console.log("[audio has been loaded]");
                resolve(1);
            }.bind(this))
        }.bind(this))
        return promise;
    }

    /**
     * @description: 开启/关闭音量开关
     * @param {*}
     * @return {*}
     */
    public turn() {
        this.musicOn = !this.musicOn;
        if (!this.musicOn)
            cc.audioEngine.stopAll();
        else
            this.playBgm();

        cc.sys.localStorage.setItem('Music', this.musicOn ? 1 : 0);
    }

    /**
     * @description: 播放背景音乐
     * @param {string} name
     * @return {*}
     */
    public playBgm(name?: string) {
        if (!this.musicOn)
            return

        if (this.bgmCache.has(name)) {
            cc.audioEngine.playMusic(this.bgmCache.get(name), true);
        }
        else {
            this.audioBundle.load(name, cc.AudioClip, function (err, audio) {
                if (err) {
                    console.log("[load bmg fail]:{0}".format(name))
                    console.error(err)
                    return;
                }
                this.bgmCache.set(name, audio);
                cc.audioEngine.playMusic(audio, true);
            }.bind(this))
        }
    }

    public stopBgm() {
        cc.audioEngine.stopMusic();
    }

    /**
     * @description: 播放音效（不循环的）
     * @param {string} name
     * @return {*}
     */
    public playSound(name: string) {
        if (!this.musicOn)
            return
        if (this.soundCache.has(name)) {
            cc.audioEngine.playEffect(this.soundCache.get(name), false);
        }
        else {
            this.audioBundle.load(name, cc.AudioClip, function (err, audio) {
                if (err) {
                    console.log("[load sound fail]:{0}".format(name))
                    console.error(err)
                    return;
                }
                this.soundCache.set(name, audio);
                cc.audioEngine.playEffect(audio, false);
            }.bind(this))
        }
    }

}
