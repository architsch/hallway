import KeyInputManager from "./KeyInputManager";

export default class InputManager
{
    private keyInputManager: KeyInputManager;

    constructor()
    {
        this.keyInputManager = new KeyInputManager();
    }
}