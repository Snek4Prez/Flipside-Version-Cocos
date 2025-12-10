import { _decorator, CCInteger, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('HealthController')
export class HealthController extends Component 
{
    @property({type: CCInteger})
    protected maxHealth: number;
    protected _currentHealth: number;
    
    public getHealth(): number
    {
        return this._currentHealth;
    }

    public takeDamage(damage: number): boolean
    {
        this._currentHealth -= damage;

        if(this._currentHealth > 0) return false;
        this.die();
        return true;
    }

    protected die(): void
    {
        this.node.emit("OnDeath");
    }

}
