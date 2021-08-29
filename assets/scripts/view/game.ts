/*
 * @Author: your name
 * @Date: 2021-08-23 17:37:41
 * @LastEditTime: 2021-08-29 20:37:15
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \cocos_ts_frame\assets\scripts\view\game.ts
 */
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import App from "../App";
import { IView } from "../base/IView";
import { EventType, GameMode, GameState } from "../common/BaseType";
import Pool from "../common/Pool";
import Event from "../module/Event";
import Res from "../module/Res";
import UI from "../module/UI";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Game extends IView {
    bgList: Array<cc.Node> = new Array<cc.Node>();
    startBg: cc.Node;
    sandParent:cc.Node;
    sandList: Array<cc.Node>;
    treeParent:cc.Node;
    treeList:Array<cc.Node>;
    gameMode:GameMode;
    gameState:GameState;

    pool: {
        sand: Array<cc.Node>;
        tree: Array<cc.Node>;
    }

    onLoad() {
        //滚动背景
        let bgNode: cc.Node = this.node.findChild('bg');
        this.startBg = bgNode.findChild('start');

        this.bgList.push(bgNode.findChild('0'));
        this.bgList.push(bgNode.findChild('1'))

        //装饰物      
        this.sandParent = this.node.findChild('decorate/sand');
        this.sandList = new Array<cc.Node>();
        this.treeParent = this.node.findChild('decorate/tree');
        this.treeList = new Array<cc.Node>();
      
        super.onLoad();
    }  

    register() {
        let sandNode = new cc.Node("sand");
        sandNode.addComponent(cc.Sprite);
        Pool.getInstance().register("sand", sandNode,this.sandParent);
        let treeNode = new cc.Node("tree");
        treeNode.addComponent(cc.Sprite);
        Pool.getInstance().register("tree", treeNode,this.treeParent);

        Event.getInstance().on(EventType.DialogClose,this.node,function(){
            this.gameState=GameState.Rush;
        }.bind(this))
    }

    onShow(params) {
        this.gameMode=GameMode.Pattern;
        this.gameState=GameState.Dialog;
        this.initBg();
        UI.getInstance().showUI("Dialog","周公吐哺，天下归心");      
    }

    update(dt) {
        switch (this.gameState) {
            case GameState.Rush:
                this.scrollBg(dt);                
                break;
        
            default:
                break;
        }
    }

    /**
     * @description: 初始化背景
     * @param {*}
     * @return {*}
     */
    initBg() {
        this.startBg.y = 0;
        this.bgList[0].y = 1600;
        this.bgList[1].y = 3200;
        this.genDecorate(this.startBg);
        this.genDecorate(this.bgList[0]);
        this.genDecorate(this.bgList[1]);
    }

    /**
     * @description: 生成场景装饰物
     * @param {*}
     * @return {*}
     */
    genDecorate(node) {
        let num = Math.ceil(Math.random() * 4) + 3
        let deltaY = 1600 / num;
        for (let i = 0; i < num; i++) {
            let sandItem: cc.Node = Pool.getInstance().get("sand")
            sandItem.active = true;
            this.sandList.push(sandItem);
            let sandIdx: number = Math.floor(Math.random() * Res.getInstance().scene_sand.length);
            sandItem.getComponent(cc.Sprite).spriteFrame = Res.getInstance().scene_sand[sandIdx];
            sandItem.scale = Math.random() * 2 + 1;
            sandItem.setPosition((Math.random() < 0.5 ? 1 : -1) * (Math.random() * 100 + 100), Math.random() * deltaY + deltaY * i + node.y)

            let treeItem: cc.Node = Pool.getInstance().get("tree");
            treeItem.active = true;
            this.treeList.push(treeItem);
            let treeIdx: number = Math.floor(Math.random() * Res.getInstance().scene_sand.length);
            treeItem.getComponent(cc.Sprite).spriteFrame = Res.getInstance().scene_tree[treeIdx];
            treeItem.scale = Math.random() * 1 + 1;
            treeItem.setPosition((Math.random() < 0.5 ? 1 : -1) * (Math.random() * 100 + 250), sandItem.y + (Math.random() * 50) * (Math.random() > 0.5 ? 1 : -1) + node.y)
        }
    }

    /**
     * @description: 背景滚动
     * @param {*} dt
     * @return {*}
     */    
    scrollBg(dt) {
        let speed=600
        if (this.startBg.active) {
            this.startBg.y -= dt*speed
            if (this.startBg.y <= -1600) {
                this.startBg.active = false;
                console.log(this.bgList)
            }
        }
        
        for(let i=0;i<this.bgList.length;i++){
            this.bgList[i].y-=dt*speed
            if(this.bgList[i].y<=-1600){
                this.bgList[i].y+=3200;
                this.genDecorate(this.bgList[i]);
            }
        }
        

       for(let i=0;i<this.sandList.length;i++){
           this.sandList[i].y-=dt*speed
           if(this.sandList[i].y<-1600-this.sandList[i].height*this.sandList[i].scale){
                let item=this.sandList.splice(i,1)[0]
                Pool.getInstance().recycle("sand",item);            
           }
       }

       for(let i=0;i<this.treeList.length;i++){
           this.treeList[i].y-=dt*speed
            if(this.treeList[i].y<-1600-this.treeList[i].height*this.treeList[i].scale){
                let item=this.treeList.splice(i,1)[0]
                Pool.getInstance().recycle("tree",item);            
            }
        }
    }

    onHide(params) { }


}
