import Phaser from 'phaser'
import Player from '../characters/Player'
import Item from './Item'

export default class Chest extends Item {

    constructor(scene:Phaser.Scene, x:number, y:number) {
        super(scene, x, y, 'chest', 0)
        this.play('chest-closed')
    }

    use(player:Player) {
        if( this.used ) return
        super.use(player)
        this.play('chest-open')
        this.sndmgr.play('coin')
        player.coins += Phaser.Math.Between(50, 200)
        // Spin a coin on the chest
        const coin = this.scene.physics.add.sprite(this.x, this.y, 'treasure')
        coin.play('coin-spin')
        coin.setVelocityY(-10)
        setTimeout(()=>{
            this.scene.tweens.add({
                targets: coin,
                alpha: 0,
                onComplete: () => coin.destroy(),
                duration: 750
            })
        }, 1000)
    }

}