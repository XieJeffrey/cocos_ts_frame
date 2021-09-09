/*
 * @Author: your name
 * @Date: 2021-08-25 14:02:31
 * @LastEditTime: 2021-09-09 15:24:46
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \cocos_ts_frame\assets\scripts\view\Problem.ts
 */
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import App from "../App";
import { IView } from "../base/IView";
import Question from "../manager/Question";
import Res from "../module/Res";
import UI from "../module/UI";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Problem extends IView {
    problemPanel: cc.Node;
    question: cc.Label;
    optionArray: Array<cc.Label> = new Array<cc.Label>();
    toggleArray: Array<cc.Toggle> = new Array<cc.Toggle>();
    qusIdxLabel: cc.Label;

    answer: Array<string> = new Array<string>();
    answerIdx: number = 0;
    selectAnswerIdx: number = 0;
    resultCall: Function = null;
    sureBtn: cc.Node;
    roleSprite: cc.Sprite;

    onLoad() {
        this.problemPanel = this.node.findChild('problem')
        this.sureBtn = this.node.findChild('problem/sure')
        this.qusIdxLabel = this.node.findChild('problem/question/title/txt').getComponent(cc.Label);
        this.roleSprite = this.node.findChild("problem/role/role").getComponent(cc.Sprite);

        this.question = this.node.findChild('problem/question/txt').getComponent(cc.Label);
        this.toggleArray.push(this.node.findChild('problem/option/0').getComponent(cc.Toggle));
        this.toggleArray.push(this.node.findChild('problem/option/1').getComponent(cc.Toggle));
        this.toggleArray.push(this.node.findChild('problem/option/2').getComponent(cc.Toggle));
        this.toggleArray.push(this.node.findChild('problem/option/3').getComponent(cc.Toggle));

        for (let i = 0; i < this.toggleArray.length; i++) {
            this.optionArray.push(this.toggleArray[i].node.findChild('txt').getComponent(cc.Label));
        }
        super.onLoad();
    }

    register() {
        for (let i = 0; i < this.optionArray.length; i++) {
            this.toggleArray[i].node.on("toggle", this.onSelectOption, this)
        }
        this.sureBtn.on("click", this.onSure, this)
    }


    onShow(params) {
        this.qusIdxLabel.string = "Q" + params.waveIdx;
        this.roleSprite.spriteFrame = Res.getInstance().commonSprite.get(params.roleName);
        if (params.call)
            this.resultCall = params.call;

        this.problemPanel.active = true;

        let queStr: string = Question.getInstance().getQuestion();
        console.log("queStr:{0}".format(queStr));
        let qData = JSON.parse(queStr);
        for (let i in qData["option"])
            this.answer.push(qData["option"][i])
        let answerStr = this.answer[0]
        this.answer.muddled()
        this.question.string = qData["cn"];
        for (let i = 0; i < this.answer.length; i++) {
            this.optionArray[i].string = this.answer[i];
            if (answerStr == this.answer[i])
                this.answerIdx = i;
        }

        this.selectAnswerIdx = 0;
        this.toggleArray[0].check();
    }

    onHide() {
        this.resultCall = null;
    }

    onSelectOption(event) {
        let idx: number = parseInt(event.node.name)
        if (event.isChecked)
            this.selectAnswerIdx = idx;

    }

    onSure() {
        this.problemPanel.active = false;
        if (this.selectAnswerIdx == this.answerIdx) {
            UI.getInstance().showFloatMsg("回答正确，村民加入了你的队伍");
        }
        else {
            UI.getInstance().showFloatMsg("回答错误，村民失望的离开了");
        }

        setTimeout(function () {
            if (this.resultCall)
                this.resultCall(this.selectAnswerIdx == this.answerIdx)
            UI.getInstance().hideUI("Problem")
        }.bind(this), 600)

    }
}
