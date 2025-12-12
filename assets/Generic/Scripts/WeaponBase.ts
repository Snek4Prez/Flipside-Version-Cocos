import { _decorator, CCBoolean, CCFloat, CCInteger, Component, instantiate, Prefab, Node, Vec3, randomRange, toRadian } from "cc";
import { BulletBase } from "./BulletBase";
import { ForceObjectToUpdate } from "../../Player/Scripts/ForceObjectToUpdate";
const { ccclass, property } = _decorator;

@ccclass('WeaponBase')
export abstract class WeaponBase extends Component
{
    protected static bulletHolder: Node;

    @property({type: CCFloat, tooltip: "firerate in bullets per second"})
    protected fireRate: number;
    @property({type: CCInteger, tooltip: "damage dealt per bullet"})
    protected damage: number;
    @property({type: CCFloat, tooltip: "accuracy of the weapon, in the maximum angle (in degrees) the bullet can deviate from the forward vector"})
    protected accuracy: number;
    @property({type: CCFloat, tooltip: "the maximum distance a bullet can travel before de-spawning"})
    protected range: number;
    @property({type: CCFloat, tooltip: "the speed the bullet will travel at"})
    protected bulletSpeed: number;

    @property({type: Node, tooltip: "location where the bullets will spawn at"})
    protected bulletSpawnLocation: Node;

    @property({type: Prefab})
    protected bulletPrefab: Prefab;

    /**is this weapon currently allowed to be fired? */
    protected canFire: boolean = true;
    
    protected start(): void 
    {
        if(WeaponBase.bulletHolder != null) return;
        WeaponBase.bulletHolder = instantiate(new Node("Bullet Holder"));
        //for some reason i have to manually set the parent of this new node to the scene root node, otherwise it just doesn't show up in the hierarchy, which in turns stops the bullets from showing up in the world for some reason
        WeaponBase.bulletHolder.setParent(this.node.parent);
        //for some godforsaken reason i need to add this to an object if i want it's children to move visually
        //see the class itself for a more detailed breakdown why
        WeaponBase.bulletHolder.addComponent(ForceObjectToUpdate);
    }

    protected spawnBullet(): void
    {
        let newBullet: Node = instantiate(this.bulletPrefab);
        newBullet.position = this.bulletSpawnLocation.worldPosition.clone();

        //give the bullet a random direction by taking the forward vector of the plane and multiplying this by the speed of the bullet
        //it then rotates this velocity around the x-axis(RIGHT) of the plane by a random amount (between 0 and the accuracy stat)
        //the velocity is then rotated around the z-axis(FORWARD) of the plane by a random amount (betweeon 0 and a full rotation)
        //thus ending up with the bullets travelling a random direction inside a cone with an angle equal to the acc
        let bulletVelocityWithAccuracy: Vec3 = Vec3.multiplyScalar(Vec3.ZERO.clone(), this.node.forward.clone(), this.bulletSpeed);
        Vec3.rotateN(bulletVelocityWithAccuracy, bulletVelocityWithAccuracy, newBullet.position, this.node.right, toRadian(randomRange(0, this.accuracy)));
        Vec3.rotateN(bulletVelocityWithAccuracy, bulletVelocityWithAccuracy, newBullet.position, this.node.forward, toRadian(randomRange(0, 360)));

        newBullet.getComponent(BulletBase).initializeBullet(this.damage, this.range, bulletVelocityWithAccuracy);

        //
        newBullet.setParent(WeaponBase.bulletHolder);
    }

    protected goOnCooldown()
    {
        this.canFire = false;
        setTimeout ( () => {this.canFire = true;}, 1000 / this.fireRate)
    }

    public abstract fire(): void; 
}

