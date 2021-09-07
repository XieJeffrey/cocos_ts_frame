/*
 * @Author: your name
 * @Date: 2021-08-25 14:02:31
 * @LastEditTime: 2021-09-07 16:53:44
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

import { IView } from "../base/IView";
import Question from "../manager/Question";
import Res from "../module/Res";
import UI from "../module/UI";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Problem extends IView {
    problemPanel: cc.Node;
    resultPanel: cc.Node;
    question: cc.Label;
    optionArray: Array<cc.Label> = new Array<cc.Label>();
    toggleArray: Array<cc.Toggle> = new Array<cc.Toggle>();

    answer: Array<string> = new Array<string>();
    answerIdx: number = 0;
    selectAnswerIdx: number = 0;
    resultCall: Function = null;
    sureBtn: cc.Node;
    closeBtn: cc.Node;

    onLoad() {
        this.problemPanel = this.node.findChild('problem')
        this.resultPanel = this.node.findChild('result')
        this.sureBtn = this.node.findChild('problem/sure')
        this.closeBtn = this.node.findChild('result/sure')

        this.question = this.node.findChild('problem/frame/question/txt').getComponent(cc.Label);
        this.toggleArray.push(this.node.findChild('problem/frame/option/0').getComponent(cc.Toggle));
        this.toggleArray.push(this.node.findChild('problem/frame/option/1').getComponent(cc.Toggle));
        this.toggleArray.push(this.node.findChild('problem/frame/option/2').getComponent(cc.Toggle));
        this.toggleArray.push(this.node.findChild('problem/frame/option/3').getComponent(cc.Toggle));

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
        this.closeBtn.on("click", this.onClose, this)
    }


    onShow(call = null) {
        if (call)
            this.resultCall = call;
        this.problemPanel.active = true;
        this.resultPanel.active = false;

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
        this.refreshToggleBg();
    }

    onHide() {
        this.resultCall = null;
    }

    onSelectOption(event) {
        let idx: number = parseInt(event.node.name)
        if (event.isChecked)
            this.selectAnswerIdx = idx;

        this.refreshToggleBg();
    }

    refreshToggleBg() {
        for (let i = 0; i < this.toggleArray.length; i++) {
            if (this.selectAnswerIdx == i) {
                this.toggleArray[i].getComponent(cc.Sprite).spriteFrame = Res.getInstance().commonSprite.get("select");
            }
            else {
                this.toggleArray[i].getComponent(cc.Sprite).spriteFrame = Res.getInstance().commonSprite.get("noselect");
            }
        }
    }

    onSure() {
        this.problemPanel.active = false;
        this.resultPanel.active = true;
        if (this.selectAnswerIdx == this.answerIdx) {
            this.resultPanel.findChild('frame/resultTxt').getComponent(cc.Label).string = "回答正确!";
        }
        else {
            this.resultPanel.findChild('frame/resultTxt').getComponent(cc.Label).string = "回答错误!";
        }
    }

    onClose() {
        if (this.selectAnswerIdx == this.answerIdx) {
            if (this.resultCall)
                this.resultCall(true);
        }
        else {
            if (this.resultCall)
                this.resultCall(false);
        }
        UI.getInstance().hideUI("problem");
    }
}
