import WorldManager from "./WorldManager";

async function startApp()
{
    const worldManager = new WorldManager();
    await worldManager.init();

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

        if (gameDeltaTime < minGameDeltaTime)
            return;
        gameTime += gameDeltaTime;

        worldManager.update(gameTime, gameDeltaTime);
        
        gameDeltaTime = 0;
        requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
};

startApp();