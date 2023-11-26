# Hallway

[Visit Website](https://thingspool.net)

## About this project

This is a custom web-based game engine I wrote for experimental purposes. It runs on any web browser, and is based on pure WebGL (No graphics engine such as Pixi.js or Three.js). The code architecture is based on ECS (Entity Component System), so the whole engine is highly scalable and modular.

Please note, however, that the current implementation does not fully leverage the power of ECS. In an ideal scenario, my code would have to take advantage of ECS's optimization tricks such as multithreading, data contiguity, and many others. For now, I am only focused on figuring out how much ECS can simplify the structure of gameplay systems, without wasting too much time trying to maximize their performance to the utmost degree.

## How to compile and run

Inside your console window, navigate to the project's root directory and run the following commands (Make sure that Node.js and NPM are installed on your machine):

1. **npm install** (To install all the dependencies)
2. **npm build** (To build the project)
3. **npm start** (To run the project)