import { _decorator, Component, NodeSpace, Quat } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ForceObjectToUpdate')
export class ForceObjectToUpdate extends Component {

    //i don't know
    //i really don't fucking know why
    //but if i want the children of an object to move in space
    //i need to update the rotation of the object
    //don't ask my why
    //i spend 2 hours going insane trying to get my stupid bullets to move after spawning them
    //and they just weren't moving
    //but turns out that i just need to rotate the parent object by any amount(even if that amount is 0)
    //and then the children will actually move on the screen
    update(deltaTime: number) {
        this.node.rotate(Quat.IDENTITY, NodeSpace.LOCAL)
    }
}


