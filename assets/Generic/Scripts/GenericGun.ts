import { _decorator, Component, Node } from 'cc';
import { WeaponBase } from './WeaponBase';
const { ccclass, property } = _decorator;

@ccclass('GenericGun')
export class GenericGun extends WeaponBase 
{
    public fire(): void 
    {
        if(!this.canFire) return;
        this.spawnBullet();
        this.goOnCooldown();
    }   
}


