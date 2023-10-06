import ECSManager from "./ECS/ECSManager";

require("./Game/Models/CoreComponents");
require("./Game/Models/DynamicComponents");
require("./Game/Models/LevelComponents");
require("./Graphics/Models/GraphicsComponents");
require("./Input/Models/InputComponents");
require("./Physics/Models/PhysicsComponents");

const ecs = new ECSManager();

const frameInterval = 0.025;

let appTime = 0;
let appTimePrev = 0;
let gameTime = 0;
let gameDeltaTime = 0;

function update(timeInMillis: number)
{
    appTime = timeInMillis * 0.001;
    gameDeltaTime += Math.min(gameDeltaTime + (appTime - appTimePrev), 0.05);
    appTimePrev = appTime;

    if (gameDeltaTime >= frameInterval)
    {
        gameTime += frameInterval;
        ecs.update(gameTime, frameInterval);
        gameDeltaTime -= frameInterval;
    }
    if (gameDeltaTime >= frameInterval)
    {
        gameDeltaTime = gameDeltaTime % frameInterval;
    }
    requestAnimationFrame(update);
}

requestAnimationFrame(update);