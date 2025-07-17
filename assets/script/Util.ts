import { Component, error, instantiate, Label, math, Node, Prefab, random, randomRangeInt, resources, tween, v3, Vec3, } from "cc";
import { DamageText } from "./DamageText";
import { Monster } from "./Monster";
import { Globats } from "./Globats";
import { Constant } from "./Constant";

export class Util {


    static showText(text: string, color: string, worldPos: Vec3, parent: Node) {

        const ndText = Globats.getNode(Constant.PrefabUrl.DAMAGE_TEXT, parent)


        ndText.getComponent(Label).string = text;
        // ndText.getComponent(DamageText).setLabelText(text);

        const newPos = v3(worldPos);
        newPos.add3f(randomRangeInt(-10, 10), 30, 0);

        ndText.setWorldPosition(newPos);
        ndText.getComponent(Label).color = math.color(color);

        ndText.setScale(1, 1, 1);

        tween(ndText)
            .to(0.1, { scale: new Vec3(1.5, 1.5, ndText.scale.z) })
            .delay(0.5)
            .to(0.1, { scale: new Vec3(0.1, 0.1, ndText.scale.z) })
            // .delay(1.5)
            .call(() => {
                ndText.destroy();
            })
            .start();

    }


    static createMonster(prefab: Prefab, parent: Node) {
        const ndMoster = instantiate(prefab);
        ndMoster.parent = parent;
        return ndMoster;



    }


    static moveNode(node: Node, radian: number, distance: number) {
        const x = node.position.x + Math.cos(radian) * distance;
        const y = node.position.y + Math.sin(radian) * distance;
        node.setPosition(x, y);
    }

    static getPosition(start: Vec3, radian: number, distance: number) {
        const x = start.x + Math.cos(radian) * distance;
        const y = start.y + Math.sin(radian) * distance;
        return new Vec3(x, y, start.z);
    }

    static getRadian(start: Vec3, end: Vec3) {
        return Math.atan2(end.y - start.y, end.x - start.x);
    }
}