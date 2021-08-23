
/*
 * @Author: your name
 * @Date: 2021-08-23 14:41:29
 * @LastEditTime: 2021-08-23 23:07:25
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \cocos_ts_frame\assets\scripts\common\Tool.ts
 */
const { ccclass, property } = cc._decorator;

@ccclass('Tool')
export default class Tool  {   
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

        console.log("Tool constructor!!");
    }
}