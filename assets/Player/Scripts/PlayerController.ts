import { _decorator, CCFloat, Component, NodeSpace, Quat, Vec3 } from 'cc';
import { InputManager } from './InputManager';
const { ccclass, property } = _decorator;

@ccclass('PlayerController')
export class PlayerController extends Component {
    private _inputManager: InputManager;

    //rotation parameters
    @property({type: CCFloat, tooltip: "rolling speed in pi radians per second"}) 
    private rollSpeed: number; 
    @property({type: CCFloat, tooltip: "pitching speed in pi radians per second"}) 
    private pitchSpeed: number; 

    //movement parameters
    @property({type: CCFloat})
    private acceleration: number;
    @property ({type: CCFloat})
    private maxSpeed: number;
    @property ({type: CCFloat, tooltip: "value used to lerp velocity to zero when not accelerating"})
    private drag: number;

    private _velocity: Vec3 = Vec3.ZERO.clone();

    start(): void
    {
        this._inputManager = this.getComponent(InputManager);
    }

    update(deltaTime: number): void
    {
        this.updateRotation(deltaTime);
        this.updateMovement(deltaTime);
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

    updateMovement(deltaTime: number): void
    {
        if(this._inputManager.accelerationInput)
        {   //add acceleration to the velocity vector, in the direction of the forward vector of the player
            let accelerationVector: Vec3 = this.node.forward.multiplyScalar(deltaTime * this.acceleration);
            this._velocity.add(accelerationVector);
        } else 
        {
            Vec3.lerp(this._velocity, this._velocity, Vec3.ZERO.clone(), this.drag * deltaTime);
        }   

        if(this._velocity.length() > this.maxSpeed)
        {   //clamp speed by normalizing the vector and multiplying by maxSpeed
            this._velocity.normalize();
            this._velocity = this._velocity.multiplyScalar(this.maxSpeed);
        } 

        //use vec3.clone() because otherwise displacement becomes a reference to velocity, and operations done to displacement would in fact be done to velocity
        let displacement: Vec3 = this._velocity.clone();
        this.node.position.add(displacement.multiplyScalar(deltaTime));
    }
}


