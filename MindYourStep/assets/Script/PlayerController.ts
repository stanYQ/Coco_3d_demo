import { Animation, Component, game, SkeletalAnimation, v3, Vec3, _decorator } from "cc";
import { GameEvent, GameMgr } from "./GameMgr";
const { ccclass, property } = _decorator;

@ccclass("PlayerController")
export class PlayerController extends Component {

    @property({ type: Animation })
    public BodyAnim: Animation = null;
    @property({ type: SkeletalAnimation })
    public CocosAnim: SkeletalAnimation = null;

    // for fake tween
    private _startJump: boolean = false;
    private _jumpStep: number = 0;
    private _curJumpTime: number = 0;
    private _jumpTime: number = 0.3;
    private _curJumpSpeed: number = 0;
    private _curPos: Vec3 = v3();
    private _deltaPos: Vec3 = v3(0, 0, 0);
    private _targetPos: Vec3 = v3();
    private _isMoving = false;
    private _totalStep = 0;
    private

    start() {
        game.on(GameEvent.JUMP_ONE_STEP, this.onJumpOneStep, this);
        game.on(GameEvent.JUMP_TWO_STEP, this.onJumpTwoStep, this);
        game.on(GameEvent.PLAYER_RESET, this.onPlayerReset, this);
    }

    onDestroy() {
        game.off(GameEvent.JUMP_ONE_STEP, this.onJumpOneStep, this);
        game.off(GameEvent.JUMP_TWO_STEP, this.onJumpTwoStep, this);
        game.on(GameEvent.PLAYER_RESET, this.onPlayerReset, this)
    }

    public get totalStep(): number {
        return this._totalStep;
    }

    jumpByStep(step: number) {
        if (this._isMoving) {
            return;
        }
        this._startJump = true;
        this._jumpStep = step;
        this._curJumpTime = 0;
        this._curJumpSpeed = this._jumpStep / this._jumpTime;
        this.node.getPosition(this._curPos);
        Vec3.add(this._targetPos, this._curPos, v3(this._jumpStep, 0, 0));
        this._isMoving = true;
        if (step === 1) {
            this.BodyAnim.play('oneStep');
        } else if (step === 2) {
            this.BodyAnim.play('twoStep');
        }
        this.CocosAnim.getState('cocos_anim_jump').speed = 3.5; //跳跃动画时间比较长，这里加速播放
        this.CocosAnim.play('cocos_anim_jump'); //播放跳跃动画
    }

    onOnceJumpEnd() {
        this._isMoving = false;
        this._totalStep += this._jumpStep;
        this.CocosAnim.play('cocos_anim_idle');
        game.emit(GameEvent.PLAYER_JUMP_END);
    }

    update(deltaTime: number) {
        if (this._startJump) {
            this._curJumpTime += deltaTime;
            if (this._curJumpTime > this._jumpTime) {
                // end
                this.node.setPosition(this._targetPos);
                this._startJump = false;
                this.onOnceJumpEnd();
                GameMgr.inst.score += this._jumpStep
            } else {
                // tween
                this.node.getPosition(this._curPos);
                this._deltaPos.x = this._curJumpSpeed * deltaTime;
                Vec3.add(this._curPos, this._curPos, this._deltaPos);
                this.node.setPosition(this._curPos);
            }
        }
    }

    onJumpOneStep() {
        this.jumpByStep(1);
    }
    onJumpTwoStep() {
        this.jumpByStep(2);
    }
    onPlayerReset() {
        this._totalStep = 0;
        this.node.setPosition(v3(0, 0, 0));
    }
}