/*
 * @Author: your name
 * @Date: 2021-08-23 11:15:56
 * @LastEditTime: 2021-09-24 11:10:24
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \cocos_ts_frame\assets\scripts\module\ui .ts
 */
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import IManager from "../base/IManager";
import { IView } from "../base/IView";
import { UIConfig } from "../config/UIConfig";
import Float from "../view/Float";
import { ViewType } from "../common/BaseType";
import Loading from "../view/Loading";
const { ccclass, property } = cc._decorator;

@ccclass
export default class UI extends IManager {
    uiList: Map<string, { node: cc.Node, script: IView }> = new Map<string, { node: cc.Node, script: IView }>();
    root: cc.Node;
    bundle: any;
    cacheList: Map<string, boolean> = new Map<string, boolean>();

    getInstance() { }

    public init() {
        let promise = new Promise((resolve, reject) => {
            if (this.bundle) {
                console.log("uiManager has been loaded");
                resolve(1);
                return;
            }
            this.root = cc.find("Canvas/Root")

            cc.assetManager.loadBundle('prefab', function (err, loadedBundle) {
                if (err) {
                    console.error(err);
                    return;
                }
                this.bundle = loadedBundle;
                console.log("[uiBundle loaded]");

                if (UIConfig.preload.length == 0) {
                    resolve(1);
                    return;
                }
                let loadedNum: number = 0;
                for (let i = 0; i < UIConfig.preload.length; i++) {
                    this.load(UIConfig.preload[i], function (node) {
                        node.active = false;
                        loadedNum++;
                        if (loadedNum == UIConfig.preload.length) {
                            resolve(1);
                        }
                    }.bind(this))
                }
            }.bind(this))
        })
        return promise;
    }

    private load(name: string, call: Function) {
        name = name.capitalize();
        console.log("[loading view:" + name + "....]")
        if (this.cacheList.has(name))
            return;

        this.cacheList.set(name, true);
        this.bundle.load("view/" + name, cc.Prefab, function (err, prefab) {
            if (err) {
                console.error(err)
                return;
            }
            var node: cc.Node = cc.instantiate(prefab);
            node.name = name;
            node.zIndex = UIConfig.uiList.get(name).order;
            this.root.addChild(node);
            node.height = cc.view.getVisibleSize().height;
            node.width = cc.view.getVisibleSize().width;
            if (this.uiList.has(name)) {
                node.destroy();
                return;
            }
            this.uiList.set(name, {
                node: node,
                script: node.addComponent(UIConfig.uiList.get(name).script.capitalize())
            })
            if (this.uiList.get(name).script == undefined) {
                console.error("[UIManager]:addComponent {0} failed".format(name));
                return
            }
            this.cacheList.delete(name);
            if (call) {
                console.log("ui:" + name + "is loaded");
                call(node)
            }
        }.bind(this))
    }

    public showUI(name: string, params?: any) {
        name = name.capitalize();
        if (this.uiList.has(name)) {
            this.uiList.get(name).node.active = true;
            this.uiList.get(name).script.onShow(params);
            return;
        }
        this.load(name, function (node) {
            node.active = true;
            this.uiList.get(name).script.onShow(params);
        }.bind(this))
    }

    public hideUI(name: string, params?: any) {
        name = name.capitalize();
        if (this.uiList.has(name)) {
            let obj: any = this.uiList.get(name);
            obj.node.active = false;
            obj.script.onHide(params);

            switch (obj.script.cacheType) {
                case ViewType.cache:
                    obj.node.active = false;
                    break;
                case ViewType.normal:
                    obj.node.destroy();
                    this.uiList.delete(name);
                default:
                    obj.node.destroy();
                    this.uiList.delete(name);
                    break;
            }
        }
        else {
            for (let i = 0; i < this.root.children.length; i++) {
                if (this.root.children[i].name == name) {
                    this.root.children[i].destroy();
                    return;
                }

            }
        }
    }

    public isShow(name: string): boolean {
        if (this.uiList.has(name)) {
            return this.uiList.get(name).node.active;
        }
        return false;
    }

    /**
     * @description: 播放飘字动画
     * @param {string} msg
     * @return {*}
     */
    public showFloatMsg(msg: string, duration: number = 1.5): void {
        if (this.uiList.has("Float")) {
            (this.uiList.get("Float").script as Float).showFloatMsg(msg, duration);
        }
        else {
            this.load("Float", function (node) {
                node.active = true;
                (this.uiList.get("Float").script as Float).showFloatMsg(msg, duration);
            }.bind(this))
        }
    }

    /**
     * @description: 播放loading界面
     * @param {number} duration
     * @param {Function} call
     * @return {*}
     */
    public showLoading(duration: number, call: Function) {
        if (this.uiList.has("Loading")) {
            this.showUI("Loading", { duration: duration, call: call });
        }
        else {
            this.load("Loading", function (node) {
                this.showUI("Loading", { duration: duration, call: call });
            }.bind(this))
        }
    }
}
