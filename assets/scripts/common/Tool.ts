import IManager from "../base/IManager";

/*
 * @Author: your name
 * @Date: 2021-08-23 14:41:29
 * @LastEditTime: 2021-08-26 11:42:12
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

        cc.Node.prototype.findChild = function (path: string) {
            var paths = path.split("/");
            var parent = this;
            var child = this;
            for (var i = 0; i < paths.length; ++i) {
                child = parent.getChildByName(paths[i]);
                parent = child;
            }
            return child;
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
}