# Dev Editor

[](https://icmods.mineprogramming.org/mod?id=614)![Beta 0.3.2](https://img.shields.io/badge/version-0.3.2-green.svg)

![Logo](https://i.imgur.com/DBA28dI.png)

## Introduction

We created it for you, developers like us. *Creating content right in the game is the main purpose of this API link.* The menu button will open up extensive possibilities of the visual part of the modification, special tools for developers and fashion designers.

*At the moment there are the following possibilities:*

- Modeling static **ICRender** models
- Creating custom **Transition**s
- **Render** object model modeling
- Environment editing and design
- Modular system built into the modification
- New features being developed

## Development of

If you have any suggestions/wishes and/or errors during the work of our environment, you can tell about it on our board in [Trello](https://trello.com/b/wzYtpA3W/dev-editor). It will be extremely interesting for us to study your problem or suggestion in order to fix or add them in the near future.

It will be possible to take part in the development of the mod as soon as the source code is published here, everyone will be able to make any kind of edits thanks to the technologies of `GitHub`. For any questions please contact [our group](https://vk.me/nernar). The current version can always be found in it.

## Using

For a start, just go to any world. In the upper left part of the screen (it may differ depending on the version), only *one button* will appear - it is enough to open the extensive possibilities of the mod. For example, let's create a render from scratch, just add a block with a render to your project (modification or script). Let's open the designer in ourselves a bit, create textures and simulate something new.

You can also add an existing render to your project, just open any script of your modification via import. For example, you can create a *.js* file in the `Dev Editor` folder and use the following code to add a nightstand:

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

> Before using this model in the game, replace the ID (1) of the render setting with yours!

## Information

The menu opens in front of itself the main available items. *You can directly import part of the code, and the modification itself recognizes the supported parts of the project.* At the same time, the script will be converted into one project - this will allow storing information more conveniently.

The default export folder is located in the `Dev Editor/saves` folder.  All projects are saved here and from here they are loaded, this folder changes in the file explorer of the game.

The interface is divided into types - there are coordinate windows, selection of elements, project trees and others.  The modeling access is only available to *in the world*, as many of the capabilities are only available from within.

To use many tools, a basic concept of [the coordinate axis is](https://ru.m.wikipedia.org/wiki/%D0%A1%D0%B8%D1%81%D1%82%D0%B5%D0%BC%D0%B0_%D0%BA%D0%BE%D0%BE%D1%80%D0%B4%D0%B8%D0%BD%D0%B0%D1%82) needed. The coordinates form the actual position of the element in the world, the rotation of the elements is expressed in degrees at the option of the developer.

---

**We wish you a pleasant modeling!**
