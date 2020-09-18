# Dev Editor

[](https://icmods.mineprogramming.org/mod?id=614)![Beta 0.3.2](https://img.shields.io/badge/version-0.3.2-green.svg)

![Logo](https://i.imgur.com/DBA28dI.png)

## Introduction

We created it for you, developers like us. *Creating content right in the game is the main purpose of this API link.* The menu button will open up extensive possibilities of the visual part of the modification, special tools for developers and fashion designers.

*At the moment there are the following possibilities:*

- Modeling static **ICRender** models
- Создание специальных переходов **Transition**
- Моделирование объектных моделей **Render**
- Редактирование и проектирование окружения
- Modular system built into the modification
- New features being developed

## Development of

Если у Вас есть предложения/пожелания и/или ошибки во время работы нашей среды, Вы можете рассказать об этом на нашей доске в [Trello](https://trello.com/b/wzYtpA3W/dev-editor). Нам будет крайне интересно изучить Вашу проблему или предложение, чтобы исправить или добавить их в ближайшее время.

Принять участие в разработке мода можно будет как только исходный код будет опубликован здесь, каждый сможет вносить любого рода правки благодаря технологиям `GitHub`. По любым вопросам обращайтесь в [нашу группу](https://vk.me/nernar). Актуальную версию всегда можно найти в ней.

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

Стандартная папка для экспорта находится в папке `Dev Editor/saves`. Сюда сохраняются все проекты и отсюда же они загружаются, эта папка меняется в файловом проводнике игры.

Интерфейс разделяется по типам — существуют окна координат, выделения элементов, деревьев проекта и прочие. Доступ к моделированию доступен *только в мире*, так как многие возможности доступны только изнутри.

To use many tools, a basic concept of [the coordinate axis is](https://ru.m.wikipedia.org/wiki/%D0%A1%D0%B8%D1%81%D1%82%D0%B5%D0%BC%D0%B0_%D0%BA%D0%BE%D0%BE%D1%80%D0%B4%D0%B8%D0%BD%D0%B0%D1%82) needed. The coordinates form the actual position of the element in the world, the rotation of the elements is expressed in degrees at the option of the developer.

---

**We wish you a pleasant modeling!**
