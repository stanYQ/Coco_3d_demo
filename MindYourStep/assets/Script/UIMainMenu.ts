import { Component, Node, sys, _decorator } from "cc";
import { GameMgr } from "./GameMgr";

const {ccclass,property} = _decorator;
@ccclass('UIMainMenu')
export class UIMainMenu extends Component{
    @property(Node)
    private tipeOnPc:Node = null;

    @property(Node)
    private tipeOnMobile:Node = null;

    start(){
        /**根据操作环境处理*/
        this.tipeOnPc.active = !sys.isMobile;
        this.tipeOnMobile.active  = sys.isMobile;
    }

    onBtnPlayClick(){
        this.node.active = false;
        //避免立即响应
        this.scheduleOnce(()=>{
            GameMgr.inst.play();
        },0.5)
    }
}

