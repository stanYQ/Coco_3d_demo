import { Component, game, instantiate, ModelComponent, Node, NodePool, Prefab, v4, _decorator } from 'cc';
import { GameEvent, GameMgr, GameState } from './GameMgr';
import { PlayerController } from './PlayerController';
import { UIMgr } from './UIMgr';
const { ccclass, property } = _decorator;

@ccclass('RoadManager')
export class RoadManager extends Component {
    @property({ type: Prefab })
    private tilePrefab: Prefab = null;

    @property(Node)
    private player: Node = null;

    private _blocks = [];

    private _inited = false;

    private _blocksPool: NodePool = null;

    onLoad() {
        this._blocksPool = new NodePool("road");
    }

    start() {
        // Your initialization goes here哦
        game.on(GameEvent.PLAYER_JUMP_END, this.onPlayerJumpEnd, this);
        game.on(GameEvent.PLAYER_RESET, this.onPlyaerReset, this);

        this.onPlyaerReset();
    }

    onDestroy() {
        game.off(GameEvent.PLAYER_JUMP_END, this.onPlayerJumpEnd, this);
        game.off(GameEvent.PLAYER_RESET, this.onPlyaerReset, this);
    }

    onPlyaerReset() {
        this.node.removeAllChildren();
        while (this.node.children.length) {
            this.putBlockToPool(this.node.children[0]);
        }
        this._blocks = [];
        this.spawnNewBlocks(1);
    }

    onPlayerJumpEnd() {
        let index = this.player.getComponent(PlayerController).totalStep;
        for (let i = 0; i < this._blocks.length; ++i) {
            let block = this._blocks[i];
            if (block.index == index && !block.node) {
                GameMgr.inst.gameOver();
                UIMgr.inst.showUI('GameOver');
            }
        }
    }


    /**从对象池中获取对象 */
    protected getBlockFromPool(): Node {
        if (this._blocksPool.size()) {
            return this._blocksPool.get();
        } else {
            let node = instantiate(this.tilePrefab);
            if (!this._inited) {
                node.getComponent(ModelComponent).sharedMaterial.setProperty('fogParams', v4(0.231, 0.352, 0.784, 0.05));
                this._inited = true;
            }
            return node;
        }
    }

    /**回收节点池 */
    protected putBlockToPool(node: Node) {
        if (node) {
            node.removeFromParent();
            this._blocksPool.put(node);
        }
    }

    /**生产新的地块 */
    spawnNewBlocks(num: number) {
        let index = 0;
        if (this._blocks.length) {
        let block = this._blocks[this._blocks.length-1];
            index = block.index + 1;
        }

        //地块是由1到 5个组成
        for (let i = 0; i < num; i++) {
            let numOfNewBlocks = Math.floor(Math.random() * 4 + 1);
            for (let j = 0; j < numOfNewBlocks; j++) {
                let node = this.getBlockFromPool();
                let pos = node.position;
                node.setPosition(index, pos.y, pos.z);
                this.node.addChild(node);
                this._blocks.push({
                    index: index,
                    x: index,
                    node: node
                })
                index++;
            }
        }

        this._blocks.push({
            index: index,
            x: index,
        })
        index++
    }

    update(deltaTime: number) {
        if (GameMgr.inst.gameState != GameState.PLAYING) {
            return;
        }

        //如果超出左边屏幕一定距离，则移除
        while (this._blocks.length) {
            let head = this._blocks[0];
            if (head.x - this.player.position.x < -5) {
                this.putBlockToPool(head.node);
                this._blocks.shift();
            }
            else {
                break;
            }
        }

        //如果最后一个地块太靠近右边，则创建新的来填补
        let last = this._blocks[this._blocks.length - 1];
        if (!last || (last.x - this.player.position.x) < 50) {
            this.spawnNewBlocks(3);
        }
    }
}
