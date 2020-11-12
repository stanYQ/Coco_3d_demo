import { Component, Node, _decorator } from 'cc';
const { ccclass, property } = _decorator;
/**UI管理器 */
@ccclass('UIMgr')
export class UIMgr extends Component {
    private static _inst: UIMgr = null;
    public static get inst(): UIMgr { return this._inst; }

    @property({ type: [Node] })
    uiList: Node[] = [];

    onLoad(){
        UIMgr._inst = this;
    }

    start() {
    }

    // update (deltaTime: number) {
    //     // Your update function goes here.
    // }

    hideAll() {
        for (let i = 0; i < this.uiList.length; ++i) {
            this.uiList[i].active = false;
        }
    }

    showUI(uiName) {
        uiName = 'UI_' + uiName;
        for (let i = 0; i < this.uiList.length; ++i) {
            if (this.uiList[i].name == uiName) {
                this.uiList[i].active = true;
                return;
            }
        }
    }
}
