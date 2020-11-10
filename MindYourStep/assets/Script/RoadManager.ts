import { Component, instantiate, ModelComponent, Node, NodePool, Prefab, v4, _decorator } from 'cc';
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
        // Your initialization goes here.
    }

    /**从对象池中获取对象 */
    protected getBlockFromPool():Node{
        if (this._blocksPool.size) {
            return this._blocksPool.get();
        } else {
            let node = instantiate(this.tilePrefab);
            if (!this._inited) {
                node.getComponent(ModelComponent).sharedMaterial.setProperty('fogParams', v4(0.231, 0.352, 0.784, 0.05));
                node.children[0].getComponent(ModelComponent).sharedMaterial.setProperty('fogParams', v4(0.231, 0.352, 0.784, 0.05));
                this._inited = true;
            }
            return node;
        }
    }

    /**回收节点池 */
    protected puBlockToPool(node:Node){
        if(node){
            node.removeFromParent();
            this._blocksPool.put(node);
        }
    }

    /**生产新的地块 */
    spawnNewBlocks(num:number){
        let  index = 0;
        if(this._blocks.length){
            let block = this._blocks[this._blocks.length];
            index = block.index+1;
        }

        //地块是由1到 5个组成
        for(let i=0;i<num;i++){
            let  numOfNewBlocks = Math.floor(Math.random()*4+1);
            for(let  j=0;j<numOfNewBlocks;j++){
                let node =this.getBlockFromPool();
                let pos = node.position;
                node.setPosition(index,pos.y,pos.z);
                this.node.addChild(node);
                this._blocks.push({
                    index:index,
                    x:index,
                    node:node
                })
                index ++;
            }
        }

        this._blocks.push({
            index:index,
            x:index,
        })
        index++
    }

    onDestroy(){

    }

    


}
