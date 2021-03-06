import Phaser from 'phaser'
import Player from '../characters/Player'
import SoundManager from '../managers/SoundManager'

export default class Item extends Phaser.Physics.Arcade.Sprite {

    private _health:number = 1
    private _used:boolean = false
    protected sndmgr:SoundManager

    constructor(scene:Phaser.Scene, x:number, y:number, texture:string, frame:string|number) {
        super(scene, x, y, texture, frame)
        this.sndmgr = new SoundManager(scene)
    }

    get health() {
        return this._health
    }

    set health(newval:number) {
        this._health = newval
        if( newval<=0 ) this.destroy()
    }

    get used() {
        return this._used
    }

    use(player:Player) { // eslint-disable-line @typescript-eslint/no-unused-vars
        this._used = true
    }

}