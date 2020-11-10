import { Component, EventMouse, Node, sys, SystemEvent, systemEvent, _decorator } from "cc";

const { ccclass, property } = _decorator;
@ccclass('GameCtrl')
export class GameCtrl extends Component {
    @property({ type: Node })
    private mobileCtrl: Node = null;

    start() {
        if (!sys.isMobile) {
            /**非移动端隐藏移动端控制 监听鼠标点击*/
            systemEvent.on(SystemEvent.EventType.MOUSE_UP, this.onMouseUp, this);
            this.mobileCtrl.active = false;
        } else {
            this.mobileCtrl.active = true;
        }
    }

    protected onMouseUp(evt: EventMouse) {

    }

    protected onLeftClick(){

    }

    protected onRightClick(){
        
    }

}