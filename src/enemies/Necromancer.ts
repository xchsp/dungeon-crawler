import Phaser from 'phaser'
import Enemy from './Enemy'

export default class Necromancer extends Enemy {

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string|number) {
        super(scene, x, y, texture, frame)
        this.animIdle = 'necromancer_idle'
        this.animRun = 'necromancer_run'
        this.damageInflicted = 0.5
        this.speed = Phaser.Math.Between(60, 90)
        this.customOffset.set(3, 4)
        this.moveEvent = scene.time.addEvent({
            delay: Phaser.Math.Between(3000, 6000),
            callback: ()=>this.changeDirection(),
            loop: true
        })
    }

    public setup() {
        this.body.setSize(12, 15)
        super.setup()
    }

    public handleDamage(amt: number) {
		this.scene.sound.play('monster-nec-' + Phaser.Math.Between(1,3))
        super.handleDamage(amt)
    }

}