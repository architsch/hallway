import GlobalObservables from "../Util/Observable/GlobalObservables";
import ObservableSet from "../Util/Observable/ObservableSet";

export default class KeyInputManager
{
    private pressedKeys: ObservableSet<string>;

    constructor()
    {
        this.pressedKeys = new ObservableSet<string>();
        GlobalObservables.add("pressedKeys", this.pressedKeys);

        this.onKeyDown = this.onKeyDown.bind(this);
        window.addEventListener("keydown", this.onKeyDown);

        this.onKeyUp = this.onKeyUp.bind(this);
        window.addEventListener("keyup", this.onKeyUp);

        this.onFocusDisturbed = this.onFocusDisturbed.bind(this);
        window.addEventListener("focus", this.onFocusDisturbed);
        window.addEventListener("blur", this.onFocusDisturbed);
        window.addEventListener("focusin", this.onFocusDisturbed);
        window.addEventListener("focusout", this.onFocusDisturbed);
    }

    private onKeyDown(event: KeyboardEvent)
    {
        event.preventDefault();
        this.pressedKeys.add(event.key);
    }

    private onKeyUp(event: KeyboardEvent)
    {
        event.preventDefault();
        this.pressedKeys.delete(event.key);
    }

    private onFocusDisturbed(_: any)
    {
        this.pressedKeys.clear();
    }
}