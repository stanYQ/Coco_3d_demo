import { Component, LabelComponent, _decorator } from 'cc';
import { GameMgr } from './GameMgr';
import { UIMgr } from './UIMgr';
const { ccclass, property } = _decorator;

@ccclass('UIGameOver')
export class UIGameOver extends Component {
    /* class member could be defined like this */
    // dummy = '';

    /* use `property` decorator if your want the member to be serializable */
    @property({type:LabelComponent})
    desc:LabelComponent = null;

    start () {
        // Your initialization goes here.
    }

    onEnable(){
        //随机一句诗
        let arr = [
            '人生自古谁无死\n留取丹心照汗青',
            '醉卧沙场君莫笑\n古来征战几人回',
            '出师未捷身先死\n长使英雄泪满襟',
            '只解沙场为国死\n何须马革裹尸还'
        ];
        let index = ~~(Math.random() * arr.length);
        this.desc.string = arr[index];
    }

    onBtnIKnow(){
        UIMgr.inst.hideAll();
        UIMgr.inst.showUI('MainMenu');
        GameMgr.inst.reset();
    }
}
