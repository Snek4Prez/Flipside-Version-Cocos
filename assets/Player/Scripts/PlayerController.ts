import { _decorator, CCFloat, Component, instantiate, NodeSpace, Prefab, Quat, Vec3, Node } from 'cc';
import { InputManager } from './InputManager';
const { ccclass, property, requireComponent } = _decorator;

@ccclass('PlayerController')
@requireComponent(InputManager)
export class PlayerController extends Component {
    private _inputManager: InputManager;

    //rotation parameters
    @property({type: CCFloat, tooltip: "rolling speed when not accelerating, in pi radians per second"}) 
    private baseRollSpeed: number; 
    @property({type: CCFloat, tooltip: "rolling speed during acceleration, in pi radians per second"})
    private acceleratingRollSpeed: number;
    @property({type: CCFloat, tooltip: "pitching speed when not accelerating in pi radians per second "}) 
    private basePitchSpeed: number; 
    @property({type: CCFloat, tooltip: "pitching speed during accelerating, in pi radians per second "}) 
    private acceleratingPitchSpeed: number; 
    @property({type: CCFloat, tooltip: "yawing speed when not accelerating, in pi radians per second "}) 
    private baseYawSpeed: number; 
    @property({type: CCFloat, tooltip: "yawing speed during accelerating, in pi radians per second "}) 
    private acceleratingYawSpeed: number; 

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
        rotationAmount.x = this._inputManager.rotationInputDirection.y * this.dynamicPitchSpeed() * deltaTime * Math.PI;
        //process yaw rotation
        rotationAmount.y = this._inputManager.rotationInputDirection.z *this.dynamicYawSpeed() * deltaTime * Math.PI;
        //process roll rotation
        rotationAmount.z = this._inputManager.rotationInputDirection.x * this.dynamicRollSpeed() * deltaTime * Math.PI;

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

    private dynamicRollSpeed(): number
    {
        if(this._inputManager.accelerationInput) return this.acceleratingRollSpeed;
        else return this.baseRollSpeed;
    }

    private dynamicPitchSpeed(): number
    {
        if(this._inputManager.accelerationInput) return this.acceleratingRollSpeed;
        else return this.basePitchSpeed;
    }

    private dynamicYawSpeed(): number
    {
        if(this._inputManager.accelerationInput) return this.acceleratingYawSpeed;
        else return this.baseYawSpeed;
    }
}


