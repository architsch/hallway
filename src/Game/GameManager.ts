import GameMode from "./GameMode";

export default class GameManager
{
    private gameMode: GameMode;

    constructor()
    {
        this.gameMode = GameMode.Idle;
    }

    update(t: number, dt: number)
    {
    }
}