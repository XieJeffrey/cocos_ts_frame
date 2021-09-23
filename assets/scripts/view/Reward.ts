/*
 * @Author: your name
 * @Date: 2021-09-23 14:50:15
 * @LastEditTime: 2021-09-23 18:01:57
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \cocos_ts_frame\assets\scripts\view\Reward.ts
 */
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { IView } from "../base/IView";
import GameData from "../data/GameData";
import Res from "../module/Res";
import UI from "../module/UI";

const { ccclass, property } = cc._decorator;
const rewardList = [[0, 0, 0], [1, 1, 1,], [2, 3, 3], [3, 6, 6], [4, 9, 11]];
@ccclass
export default class Reward extends IView {
    soliderIcon: cc.Sprite = null;
    title: cc.Label = null;
    numTxt: Array<cc.Label> = null;
    desTxt: Array<cc.Label> = null;
    getBtn: cc.Node;

    onLoad() {
        this.soliderIcon = this.node.findChild('frame/solider').getComponent(cc.Sprite);
        this.title = this.node.findChild('frame/title').getComponent(cc.Label);

        let content = this.node.findChild('frame/content');
        let desNode = this.node.findChild('frame/descript')
        this.numTxt = new Array();
        this.desTxt = new Array();

        for (let i = 0; i < 3; i++) {
            this.numTxt.push(content.findChild('' + i + "/num").getComponent(cc.Label));
            this.desTxt.push(desNode.findChild('' + i).getComponent(cc.Label));
        }

        this.getBtn = this.node.findChild('get');
        super.onLoad();
    }

    register() {
        this.getBtn.on('click', this.onClose, this)
    }

    onShow() {
        let lv = GameData.getInstance().soliderLv;
        this.soliderIcon.spriteFrame = Res.getInstance().soliderIcon[lv];
        this.title.string = "恭喜你升到等级{0}".format(lv + 1);
        for (let i = 0; i < 3; i++) {
            this.numTxt[i].string = '' + rewardList[lv][i];
            let name = "";
            switch (i) {
                case 0:
                    name = "金钥匙";
                    break;
                case 1:
                    name = "通用加速60分钟"
                    break;
                case 2:
                    name = "等级7知识之书";
                    break;
            }
            this.desTxt[i].string = "{0} *{1}".format(name, rewardList[lv][i]);
        }
    }

    onHide() { }

    onClose() {
        UI.getInstance().hideUI('Reward');
    }
}
