import { Component, game, _decorator } from "cc";

const {ccclass,property} = _decorator;

export enum GameState{
    NONE,
    PLAYING,
    PAUSE,
    GAME_OVER
}

export class GameEvent {
    public static JUMP_ONE_STEP: string = 'GameEvent.JUMP_ONE_STEP';
    public static JUMP_TWO_STEP: string = 'GameEvent.JUMP_TWO_STEP';
    public static PLAYER_RESET: string = 'GameEvent.PLAYER_RESET';
    public static PLAYER_JUMP_END: string = 'GameEvent.PLAYER_JUMP_END';
    public static SCORE_CHANGED: string = 'GameEvent.SCORE_CHANGED';
}

@ccclass('GameMgr')
export class GameMgr extends Component{
    private static _inst:GameMgr =null;
    public static get inst():GameMgr{
        if(!this._inst){
            this._inst = new GameMgr();
        }
        return this._inst;
    }
    /**当前游戏状态 */
    public gameState:GameState = GameState.NONE;
    private _score:number = 0;
    /**获取分数 */
    public get score():number{
        return this._score;
    }                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       

    /**设置分数 */
    public set score(value:number){
        let dirty = this._score !=value;
        this._score = value;
        if(dirty){
            game.emit(GameEvent.SCORE_CHANGED);
        }
    }

    public reset(){
        this.score = 0;
        game.emit(GameEvent.PLAYER_RESET);
    }

    public play(){
        this.score = 0;
        this.gameState = GameState.PLAYING;
    }

    public gameOver(){
        this.gameState = GameState.GAME_OVER;
    }

}