import { Node, Prefab } from "cc";
import { Player } from "./Player";

export class BattleContext {
    static ndMosterParent: Node;
    static ndTextParent: Node;
    static ndPlayer: Node;
    static ndWeapon: Node;

    static ndCamera: Node;

    static player: Player;
}