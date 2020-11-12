import { Component, EventMouse, game, Node, sys, SystemEvent, systemEvent, _decorator } from "cc";
import { GameEvent, GameMgr, GameState } from "./GameMgr";

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
        //当前不在游戏中
        if (GameMgr.inst.gameState != GameState.PLAYING) {
            return
        }
        //右键点击
        if (evt.getButton() === 0) {
            game.emit(GameEvent.JUMP_ONE_STEP);
        } else if (evt.getButton() === 2) {
            game.emit(GameEvent.JUMP_TWO_STEP);
        }
    }

    /**按钮点击 */
    protected onLeftClick() {
        //当前不在游戏中
        if (GameMgr.inst.gameState != GameState.PLAYING) {
            return
        }
        game.emit(GameEvent.JUMP_ONE_STEP);
    }

    /**
     * 右侧按钮
     */
    protected onRightClick() {
        //当前不在游戏中
        if (GameMgr.inst.gameState != GameState.PLAYING) {
            return
        }
        game.emit(GameEvent.JUMP_TWO_STEP);
    }

}