import { _decorator, CCFloat, Component, NodeSpace, Quat, Vec3 } from 'cc';
import { InputManager } from './InputManager';
const { ccclass, property } = _decorator;

@ccclass('PlayerController')
export class PlayerController extends Component {
    private _inputManager: InputManager;

    @property({type: CCFloat, tooltip: "rolling speed in pi radians per second"}) 
    private rollSpeed: number; 
    @property({type: CCFloat, tooltip: "pitching speed in pi radians per second"}) 
    private pitchSpeed: number; 

    start(): void
    {
        this._inputManager = this.getComponent(InputManager);
    }

    update(deltaTime: number): void
    {
        this.updateRotation(deltaTime);
    }

    updateRotation(deltaTime: number): void
    {
        let rotationAmount: Quat = new Quat;
         //process pitch rotation
        rotationAmount.x = this._inputManager.rotationInputDirection.y * this.pitchSpeed * deltaTime * Math.PI;
        //process yaw rotation
        rotationAmount.y = 0;
        //process roll rotation
        rotationAmount.z = this._inputManager.rotationInputDirection.x * this.rollSpeed * deltaTime * Math.PI;

       
        this.node.rotate(rotationAmount, NodeSpace.LOCAL);
    }
}


