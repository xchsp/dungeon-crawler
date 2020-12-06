import Phaser from 'phaser'
import Enemy from './Enemy'

export default class Chort extends Enemy {

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string|number) {
        super(scene, x, y, texture, frame)
        this.animIdle = 'chort_idle'
        this.animRun = 'chort_run'
        this.damageInflicted = 0.5
        this.speed = Phaser.Math.Between(75, 125)
        this.customOffset.set(2, 8)
        this.moveEvent = scene.time.addEvent({
            delay: Phaser.Math.Between(500, 2500),
            callback: ()=>this.changeDirection(),
            loop: true
        })
    }

    public setup() {
        this.body.setSize(12, 16)
        super.setup()
    }

    public handleDamage(amt: number) {
		this.scene.sound.play('monster-1')
        super.handleDamage(amt)
    }

}