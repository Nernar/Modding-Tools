# Dev Editor
[![Beta 0.3.2](https://img.shields.io/badge/version-0.3.2-green.svg)](https://vk.com/wall-168765348_96)
[![Support](https://img.shields.io/github/repo-size/maxfeed/dev-editor)](https://vk.com/nteditor)
[![License](https://img.shields.io/:license-apache-blue.svg)](http://www.apache.org/licenses/LICENSE-2.0.html)

![Logo](https://i.imgur.com/DBA28dI.png)

## Introduction

We're created it's for you, developers like us. _Creating content directly in-game — is the main task of this API._ Menu button will open extensive possibilities of visual modification part, special tools for developers and modelers.

_The following options are currently available:_
- Simulation of static models **ICRender**
- Create special transitions **Transition**
- Modeling object models **Render**
- Editing and designing the environment
- Supportables built into modification
- New features being developed

## Development

If you have any suggestions/wishes and/or errors during work of our environment, you can report it on our board in [Trello](https://trello.com/b/wzYtpA3W/dev-editor). It's will be extremely interesting for us to study your problem or suggestion in order to fix or add them in near future.

You can takes part in development process as soon source code is published here, everyone will be able to make any kind of edits thanks to `GitHub` technologies. For any questions please contact [our group](https://vk.me/nernar). Currently version can always be found in it.

## Usage

For start, just go into any world. In upper left part of screen (it may differ depending on version) there's will be only _one button_ — it's enough to open extensive possibilities of modification. For example, let's create a render from scratch, just add a block with a render to your project (modification or script). Let's open designer in ourselves a bit, create textures and simulate something new.

You can also add an existing render to your project, just open any script of your modification via import. For example, you can create a file in `Dev Editor/saves` folder as _.js_ format and use following code to add a nightstand:
```js
var render = new ICRender.Model();
BlockRenderer.setStaticICRender(1, 0, render);
var model = BlockRenderer.createModel();

model.addBox(0/16, 0/16, 0/16, 1/16, 16/16, 16/16, "wood", 0);
model.addBox(31/16, 0/16, 0/16, 32/16, 16/16, 16/16, "wood", 0);
model.addBox(1/16, 0/16, 0/16, 16/16, 16/16, 1/16, "wood", 0);
model.addBox(16/16, 0/16, 0/16, 31/16, 16/16, 1/16, "wood", 0);
model.addBox(1/16, 1/16, 1/16, 16/16, 2/16, 16/16, "wood", 0);
model.addBox(16/16, 1/16, 1/16, 31/16, 2/16, 16/16, "wood", 0);
model.addBox(1/16, 8/16, 1/16, 16/16, 9/16, 16/16, "wood", 0);
model.addBox(16/16, 8/16, 1/16, 31/16, 9/16, 16/16, "wood", 0);
model.addBox(1/16, 15/16, 1/16, 16/16, 16/16, 16/16, "wood", 0);
model.addBox(16/16, 15/16, 1/16, 31/16, 16/16, 16/16, "wood", 0);
model.addBox(5/16, 9/16, 10/16, 14/16, 11/16, 15/16, "stone", 0);

render.addEntry(model);
```
> Before using this model in-game, replace ID (1) of render setting with yours!

## Information

Menu opens at fronts of itself main available items. _You can directly import a part of code, and modification itself recognizes supported parts of the project._ In this case, script will be converted into one project — this will allow storing information more conveniently.
 
Default export folder is located in mods folder, `Dev Editor`. All projects are saved here and from here they are loaded, this folder changes in game's file explorer.

Interface is divided into types — there are coordinate windows, selection of elements, project trees, and others. Access to windows is available _only in world_, since many of possibilities are only accessible from inside.

To use many tools, you're need a basic concept of [coordinate system](https://en.m.wikipedia.org/wiki/Cartesian_coordinate_system). Coordinates form actual position of element in world, rotation of elements is expressed in degrees as developer's choice.

-------

**We wish you a pleasant modeling!**
