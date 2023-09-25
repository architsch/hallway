import ECSManager from "./ECS/ECSManager";

require("./AI/Models/AIComponents");
require("./Game/Models/CoreComponents");
require("./Game/Models/DynamicComponents");
require("./Game/Models/LevelComponents");
require("./Game/Models/TriggerComponents");
require("./Graphics/Models/GraphicsComponents");
require("./Input/Models/InputComponents");
require("./Physics/Models/PhysicsComponents");

const ecs = new ECSManager();

const minFPS = 10;
const maxFPS = 50;
const maxGameDeltaTime = 1 / minFPS;
const minGameDeltaTime = 1 / maxFPS;

let appTime = 0;
let appTimePrev = 0;
let gameTime = 0;
let gameDeltaTime = 0;

function update(timeInMillis: number)
{
    appTime = timeInMillis * 0.001;
    gameDeltaTime = Math.min(gameDeltaTime + (appTime - appTimePrev), maxGameDeltaTime);
    appTimePrev = appTime;

    if (gameDeltaTime >= minGameDeltaTime)
    {
        gameTime += gameDeltaTime;
        ecs.update(gameTime, gameDeltaTime);
        gameDeltaTime = 0;
    }
    requestAnimationFrame(update);
}

requestAnimationFrame(update);