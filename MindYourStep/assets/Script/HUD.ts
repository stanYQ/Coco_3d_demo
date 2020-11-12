import { Component, game, LabelComponent, _decorator } from "cc";
import { GameEvent, GameMgr } from "./GameMgr";
import { UIMgr } from "./UIMgr";

const {ccclass,property} = _decorator;
@ccclass("HUD")
export class HUD extends Component{
    @property({type:LabelComponent})
    private score:LabelComponent = null;

       start () {
        // Your initialization goes here.
        game.on(GameEvent.SCORE_CHANGED,this.onScoreChanged,this);
        this.onScoreChanged();
        UIMgr.inst.showUI('MainMenu');
    }

    onScoreChanged(){
        this.score.string = 'Score:' + GameMgr.inst.score;
    }
}