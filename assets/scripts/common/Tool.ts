import IManager from "../base/IManager";

/*
 * @Author: your name
 * @Date: 2021-08-23 14:41:29
 * @LastEditTime: 2021-09-16 10:25:35
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \cocos_ts_frame\assets\scripts\common\Tool.ts
 */
const { ccclass, property } = cc._decorator;

@ccclass('Tool')
export default class Tool extends IManager {
    init() {
        String.prototype.format = function () {
            if (arguments.length == 0) return this;
            var param = arguments[0];
            var s = this;
            if (typeof (param) == 'object') {
                for (var key in param)
                    s = s.replace(new RegExp("\\{" + key + "\\}", "g"), param[key]);
                return s;
            }
            else {
                for (var i = 0; i < arguments.length; i++)
                    s = s.replace(new RegExp("\\{" + i + "\\}", "g"), arguments[i]);
                return s;
            }
        }

        /**
         * @description: 首字母大写
         * @param {string} param1
         * @return {*}
         */
        String.prototype.capitalize = function () {
            return this[0].toUpperCase() + this.substring(1, this.length);
        }

        /**
         * @description: 加密字符串
         * @param {*}
         * @return {*}
         */
        String.prototype.encode = function () {
            let c = String.fromCharCode(this.charCodeAt(0) + this.length)
            for (let i = 1; i < this.length; i++) {
                c += String.fromCharCode(this.charCodeAt(i) + this.charCodeAt(i - 1));
            }

            return encodeURIComponent(c);
        }

        //解密字符串
        String.prototype.decode = function () {
            let str = decodeURIComponent(this);
            var c = String.fromCharCode(str.charCodeAt(0) - str.length)
            for (let i = 1; i < str.length; i++) {
                c += String.fromCharCode(str.charCodeAt(i) - c.charCodeAt(i - 1));
            }
            return c;
        }


        cc.Node.prototype.findChild = function (path: string): cc.Node {
            var paths = path.split("/");
            var parent = this;
            var child = this;
            for (var i = 0; i < paths.length; ++i) {
                child = parent.getChildByName(paths[i]);
                parent = child;
            }
            return child;
        }

        cc.Node.prototype.playDuangAnima = function () {
            this.scale = 0;
            this.stopAllActions();
            this.runAction(cc.sequence(
                cc.scaleTo(0.06, 0.9, 1.13),
                cc.scaleTo(0.12, 1.05, 0.9),
                cc.scaleTo(0.07, 0.9, 1.05),
                cc.scaleTo(0.07, 1.05, 0.95),
                cc.scaleTo(0.07, 1, 1)
            ))
        }

        cc.Node.prototype.playBreathAnima = function () {
            var seq = cc.repeatForever(
                cc.sequence(
                    cc.scaleTo(0.2, 1.05, 1.05),
                    cc.scaleTo(0.2, 1, 1),
                    cc.scaleTo(0.2, 0.95, 0.95),
                    cc.scaleTo(0.2, 1, 1)
                )
            )
            this.scale = 1;
            this.stopAllActions();
            this.runAction(seq);
        }

        /**
         * @description: 数组乱序
         * @param {*}
         * @return {*}
         */
        Array.prototype.muddled = function () {
            this.sort(function () {
                return (0.5 - Math.random());
            })
        }


        console.log("Tool constructor!!");
    }

    /**
     * @description: 时间转成00:00格式
     * @param {number} second
     * @return {*}
     */
    sec2mmss(second: number) {
        var min = Math.floor(second / 60);
        var sec = ~~(second % 60);
        var str = (min < 10 ? '0' + min : min) + ':' + (sec < 10 ? '0' + sec : sec);
        return str;
    }

    public static secToCNTime(second: number) {
        var date: Date = new Date(second);
        let Y = date.getFullYear();
        let M = date.getMonth() + 1;
        let D = date.getDate();

        return ("{0}年{1}月{2}日").format(Y, M, D);
    }
}