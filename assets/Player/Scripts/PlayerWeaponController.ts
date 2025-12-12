import { _decorator, Component, input, Node } from 'cc';
import { WeaponBase } from '../../Generic/Scripts/WeaponBase';
import { InputManager } from './InputManager';
const { ccclass, property, requireComponent } = _decorator;

@ccclass('PlayerWeaponController')
@requireComponent(InputManager)
export class PlayerWeaponController extends Component 
{
    @property({type: WeaponBase, tooltip: "The weapon the player currently has equipped"})
    private currentWeapon: WeaponBase;

    private _inputManager: InputManager;
    
    protected start(): void 
    {
        this._inputManager = this.getComponent(InputManager);
    }

    protected update(dt: number): void 
    {
        if(this._inputManager.fireWeaponInput)
            {
                this.currentWeapon.fire();
            }
    }
}


