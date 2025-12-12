import { _decorator, Collider, Component, ITriggerEvent, Node, RigidBody, SphereCollider, Vec3 } from 'cc';
import { HealthController } from './HealthController';
const { ccclass} = _decorator;

@ccclass('BulletBase')
export class BulletBase extends Component 
{
    private _damage: number;
    private _range: number;
    private _velocity: Vec3;
    private _speed: number; // used to track how far the bullet has travelled;
    private _distanceTravelled: number = 0;

    public initializeBullet(bulletDamage: number, bulletRange:number, velocity: Vec3): void
    {
        this._damage = bulletDamage;
        this._range = bulletRange;
        this._velocity = velocity.clone();
        this._speed = velocity.length();
        //this.node.getComponent(Collider).on('onTriggerEnter', this.onTriggerEnter, this);
    }

    protected update(deltaTime: number): void
    {
        if(this._distanceTravelled > this._range) 
            {
                console.log("bullet too far, destroying");
                this.node.destroy();
                return;
            }
        let displacement: Vec3 = this._velocity.clone();
        this.node.position.add(displacement.multiplyScalar(deltaTime));
        this._distanceTravelled += this._speed * deltaTime;
    }

    private onTriggerEnter(event: ITriggerEvent)
    {
        let healthController: HealthController = event.otherCollider.node.getComponent(HealthController);
        if(healthController == null) 
        {
            this.node.destroy();
            return;
        }

        healthController.takeDamage(this._damage);
        this.node.destroy();
    }
}