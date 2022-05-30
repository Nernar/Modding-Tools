# Dev Editor

[![Snapshot 0.4](https://img.shields.io/badge/version-0.4-green.svg)](https://icmods.mineprogramming.org/mod?id=614)
[![Support](https://img.shields.io/github/repo-size/nernar/dev-editor)](https://vk.com/nteditor)
[![License](https://img.shields.io/:license-apache-blue.svg)](http://www.apache.org/licenses/LICENSE-2.0.html)

![Logo](.preview/header.png)

## Introduction

We're created it for you, developers like us. *Creating content right in-game — main purpose of that API link.* Control menu button will open up extensive possibilities of visual part of modification, special tools for developers and fashion designers.

At moment there're following possibilities:
- Modeling static `ICRender` models
- Creating and playing `Transition`
- `Render` object model modeling
- Environment editing and design
- Modular system built into modification
- New features being developed

## From devs to devs

If you have any suggestions/wishes and/or errors during work of our environment, you can tell about it on our board in [Trello](https://trello.com/b/wzYtpA3W/dev-editor). It will be extremely interesting for us to study your problem or suggestion in order to fix or add them in near future.

It will be possible to take part in development: source code is published here, everyone able to make any kind of edits thanks to technologies of `GitHub`. For any questions please contact [our group](https://vk.me/nernar). Currently version can be always found in it.

## Usage

For a start, just enter to any world. In upper left part of screen (it may differ depending on version), only *one button* will appear — it's enough to open extensive possibilities of mod. For example, let's create a render from scratch, just add a block with a render to your project (modification or script). Let's open designer in ourselves a bit, create textures and simulate something new.

You can also add an existing render to your project, just open any script of your modification via import. For example, you can create a *.js* file in `Dev Editor` folder and use following code to add a nightstand:

```js
let render = new ICRender.Model();
BlockRenderer.setStaticICRender(1, 0, render);
let model = BlockRenderer.createModel();

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

> Before using this model in game, replace ID (1) of render setting with yours!

## Information

Control menu opens in front of itself main available items. *You can directly import part of code, and modification itself recognizes supported parts of project.* At same time, script will be converted into one project — this will allow storing information more conveniently.

Default export folder located in `Dev Editor/projects` folder. All projects are saved here and from here they're loaded, this folder changes in file explorer of game.

Interface divided into types — there're coordinate windows, selection of elements, project trees and others. Modeling access availabled only *in-world*, as many of capabilities are only available from within.

To use many tools, a basic concept of [coordinate axis](https://en.wikipedia.org/wiki/Coordinate_system) is needed. Coordinates form actual position of element in world, elements rotation expressed in degrees at option of developer.

---

**We wish you a pleasant modeling!**
