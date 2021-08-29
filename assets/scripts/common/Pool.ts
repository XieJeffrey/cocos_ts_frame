/*
 * @Author: your name
 * @Date: 2021-08-28 22:58:29
 * @LastEditTime: 2021-08-29 14:46:33
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \cocos_ts_frame\assets\scripts\common\Pool.ts
 */
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import IManager from "../base/IManager";
import UI from "../module/UI";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Pool extends IManager {
    private sampleList={node:cc.Node,parent:cc.Node};
    public cacheList:Map<string, Array<cc.Node>>=new Map<string,Array<cc.Node>>();
    private parent=UI.getInstance().root;
    /**
     * @description: 缓冲池注册
     * @param {string} name
     * @param {cc} node
     * @return {*}
     */    
    register(name:string,node:cc.Node,parent:cc.Node){
        if(this.cacheList.has(name))
        {
            console.log(["pool:regist duplicate name"])
            return;
        }
        this.sampleList[name]={node:node,parent:parent};
        this.cacheList.set(name,new Array<cc.Node>());
    }

    /**
     * @description: 获取预制体
     * @param {string} name
     * @return {*}
     */    
    get(name:string){
        if(this.cacheList.has(name))
        {
            let list:Array<cc.Node>=this.cacheList.get(name);
            if(list.length>0)
            {
                let item:cc.Node=list.pop();
                return item;
            }
            else{
                let item=cc.instantiate(this.sampleList[name].node)
                this.sampleList[name].parent.addChild(item)
                return item;
            }
        }
        console.log("[pool can't find obj named:{0}]".format(name));
    }   

    recycle(name:string,node:cc.Node){
        node.active=false;
        if(this.cacheList.has(name)){
            this.cacheList.get(name).push(node)
            return;
        }
        
        node.destroy();
    }

    /**
     * @description: 清除缓冲池的元素
     * @param {string} name
     * @return {*}
     */    
    clear(name:string){
        if(this.cacheList.has(name)){
            let list=this.cacheList.get(name)
            for(let i=0;i<list.length;i++){
                list[i].destroy();
                list.splice(i,1);
                i--;
            }
        }
    }

}
