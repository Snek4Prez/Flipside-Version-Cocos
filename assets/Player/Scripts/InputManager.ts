import { _decorator, Component, EventKeyboard, input, Input, KeyCode, Vec3} from 'cc';
const { ccclass, property } = _decorator;

@ccclass('InputManager')
export class InputManager extends Component 
{
    public rotationInputDirection: Vec3 = new Vec3; //vector that contains the input direction for which way the player should rotate
    
    public accelerationInput: boolean = false;

    protected start(): void
    {
        input.on(Input.EventType.KEY_DOWN, (callback: EventKeyboard) => this.KeyboardInputDown(callback)); //the arrow notation is used so that the scope of "this" inside the KeyboardInputDown stays as the InputManager class, and not the class that instantiates the callback
        input.on(Input.EventType.KEY_UP, (callback: EventKeyboard) => this.KeyboardInputUp(callback));
    }

    private keyboardInputSwitch(callback: EventKeyboard, keyPressed: boolean): void
    {
        switch (callback.keyCode) 
        {   //key bindings for rotation
            //each binding checks if the input vector is already set in their direction. This is to help prevent a rare scenario where you permanently get stuck rotating in a direction after a glitched keyUp event
            case KeyCode.KEY_A:
                if(keyPressed) 
                {
                    if(!(this.rotationInputDirection.x > 0)) this.rotationInputDirection.x += 1;
                }
                else this.rotationInputDirection.x -= 1;
                break;
            case KeyCode.KEY_D:
                if(keyPressed)
                {
                    if(!(this.rotationInputDirection.x < 0)) this.rotationInputDirection.x -= 1;
                }
                else this.rotationInputDirection.x += 1;
                break;
            case KeyCode.KEY_W:
                if(keyPressed)
                { 
                    if(!(this.rotationInputDirection.y < 0)) this.rotationInputDirection.y -= 1;
                }
                else this.rotationInputDirection.y += 1;
                break;
            case KeyCode.KEY_S:
                if(keyPressed)
                {
                    if(!(this.rotationInputDirection.y > 0)) this.rotationInputDirection.y += 1;
                }
                else this.rotationInputDirection.y -= 1;
                break;
            case KeyCode.KEY_Q:
                if(keyPressed)
                {
                    if(!(this.rotationInputDirection.z > 0)) this.rotationInputDirection.z += 1;
                } 
                else this.rotationInputDirection.z -= 1;
                break;
            case KeyCode.KEY_E:
                if(keyPressed)
                 {
                if(!(this.rotationInputDirection.z < 0)) this.rotationInputDirection.z -= 1;
                }
                else this.rotationInputDirection.z += 1;
                break;
            
            //key bindings for movement
            case KeyCode.SHIFT_LEFT:
                this.accelerationInput = keyPressed;
            break;
            
            default:
            break;
        }
        
    }
    
    //methods that get registered for callback whenever a key is pressed.
    //they then pass that information to a switch statement so i don't have to duplicate code into both methods
    public KeyboardInputDown(callback: EventKeyboard)
    {
        this.keyboardInputSwitch(callback, true);
    }
    public KeyboardInputUp(callback: EventKeyboard)
    {
        this.keyboardInputSwitch(callback, false);
    }

}
