import { _decorator, Component, Node, Vec3, Enum } from 'cc';
const { ccclass, property } = _decorator;

export enum ROAD_POINT_TYPE {
    /**正常点 */
    NOEMAL = 1,
    /**开始点 */
    STAR,
    /**接客点 */
    GREETING,
    /**送客点 */
    GOODBYE,
    /**终点 */
    END,
    AI_START
}

Enum(ROAD_POINT_TYPE)

export enum ROAD_MOVE_TYPE {
    LINE = 1,
    CUEVE
}

Enum(ROAD_MOVE_TYPE)
@ccclass('RoadPoint')
export class RoadPoint extends Component {
    @property({
        type: ROAD_POINT_TYPE,
        displayOrder:1
    })
    type = ROAD_POINT_TYPE.NOEMAL;

    @property({
        type: Node,
        displayOrder:3,
        visible:function(this:RoadPoint){
            return this.type !=ROAD_POINT_TYPE.END
        }
    })
    nextStation:Node = null;

    @property({
        type: ROAD_MOVE_TYPE,
        displayOrder:2,
        visible:function(this:RoadPoint){
            return this.type !=ROAD_POINT_TYPE.END
        } 
    })
    moveType = ROAD_MOVE_TYPE.LINE;

    @property({
        displayOrder:5,
        visible:function(this:RoadPoint){
            return this.type !=ROAD_POINT_TYPE.END &&this.moveType===ROAD_MOVE_TYPE.CUEVE;
        }
    })
    clockwis =true;

    @property({
        type:Vec3,
        displayOrder:4,
        visible:function(this:RoadPoint){
            return this.type ===ROAD_POINT_TYPE.GOODBYE||this.type===ROAD_POINT_TYPE.GREETING
        }
    })
    diretion = new Vec3(1,0,0);

    @property({
        displayOrder:6,
        visible:function(this:RoadPoint){
            return this.type ===ROAD_POINT_TYPE.AI_START
        }
    })
    interval = 3;

    @property({
        displayOrder:7 ,
        visible:function(this:RoadPoint){
            return this.type ===ROAD_POINT_TYPE.AI_START
        }
    })
    delayTime=0;

    @property({
        displayOrder:8,
        visible:function(this:RoadPoint){
            return this.type ===ROAD_POINT_TYPE.AI_START
        }
    })
    speed = 0.05;

    @property({
        displayOrder:9,
        visible:function(this:RoadPoint){
            return this.type===ROAD_POINT_TYPE.AI_START
        }
    })
    cars = '201'
}
