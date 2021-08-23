/*
 * @Author: your name
 * @Date: 2021-08-23 11:15:56
 * @LastEditTime: 2021-08-23 17:57:47
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

import { IView } from "../base/IView";
import { UIConfig } from "../config/UIConfig";

const { ccclass, property } = cc._decorator;

@ccclass
export default class UI {
    uiList: Map<string, { node: cc.Node, script: IView }> = new Map<string, { node: cc.Node, script: IView }>();
    root: cc.Node;
    bundle: any;

    public init() {
        let promise = new Promise((resolve, reject) => {
            if (this.bundle) {
                console.log("uiManager has been loaded");
                resolve(1);
                return;
            }
            this.root = cc.find("Root")

            cc.assetManager.loadBundle('prefab', function (err, loadedBundle) {
                if (err) {
                    console.error(err);
                    return;
                }
                this.bundle = loadedBundle;
                console.log("uiBundle loaded");

                if (UIConfig.preload.length == 0)
                    resolve(1);
                let loadedNum: number = 0;
                for (let i = 0; i < UIConfig.preload.length; i++) {
                    this.load(UIConfig.preload[i].name, function (node) {
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
        console.log("[loading view:" + name + "....]")
        name = name.toLowerCase();
        if (this.uiList.has(name)) {
            call(this.uiList[name].node)
            return;
        }

        console.log(this.bundle);
        this.bundle.load("view/" + name, cc.Prefab, function (err, prefab) {
            if (err) {
                console.error(err)
                return;
            }
            var node = cc.instantiate(prefab);
            node.name = name;
            node.zIndex = UIConfig.uiList.get(name).order;
            node.parent = this.root;
            this.uiList.set(name, {
                node: node,
                script: node.addComponent(UIConfig.uiList.get(name).script)
            })
            if (this.uiList.get(name).script == undefined) {
                console.error("[UIManager]:addComponent {0} failed".format(name));
                return
            }
            this.uiList.get(name).script.onLoad();
            if (call) {
                console.log("ui:" + name + "is loaded");
                call(node)
            }
        }.bind(this))
    }

    public showUI(name: string, params?: any) {
        if (this.uiList.has(name)) {
            this.uiList.get(name).node.active = true;
            this.uiList.get(name).script.onLoad();
            return;
        }
        this.load(name, function (node) {
            node.active = true;
            this.uiList.get(name).script.onShow(params);
        }.bind(this))
    }

    public hideUI(name: string, params?: any) {
        if (this.uiList.has(name)) {
            let obj: any = this.uiList.get(name);
            obj.node.active = false;
            obj.node.onHide(params);

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
    }

    public isShow(name: string): boolean {
        if (this.uiList.has(name)) {
            return this.uiList.get(name).node.active;
        }
        return false;
    }
}
