import Phaser from 'phaser'

import { createCharacterAnims } from '../anims/CharacterAnims'
import { Faune, Player } from '../characters'
import MenuItem from '../ui/MenuItem'
import SoundManager from '../managers/SoundManager'

export default class MainMenu extends Phaser.Scene {

    private cursors?: Phaser.Types.Input.Keyboard.CursorKeys
    private player!: Player
    private sndmgr = new SoundManager(this)
    private speed: number = 50
    private menu: MenuItem[] = []
    private _menuIndex: number = 0

    constructor() {
        super({key: 'mainmenu'})
    }

    get menuSelection() {
        return this.menu[this.menuIndex]
    }
    get menuIndex() {
        return this._menuIndex
    }
    set menuIndex(index: number) {
        this.menu[this.menuIndex].selected=false
        this._menuIndex = index<0 ? 0 : index+1>this.menu.length ? this.menu.length-1 : index
        this.menu[this.menuIndex].selected=true
    }

    preload() {
        const centerX = this.cameras.main.worldView.x + this.cameras.main.width / 2
        const titleConfig: Phaser.Types.GameObjects.Text.TextStyle = {
            fontSize: '20px',
        }
        const textConfig: Phaser.Types.GameObjects.Text.TextStyle = {
            fontSize: '14px',
        }
        this.add.text(centerX, 45, 'Dungeon Crawler', titleConfig).setOrigin(0.5).setScrollFactor(0, 0)
        const menuIndicators: Phaser.GameObjects.Image[] = [
            this.add.image(centerX - 66, 190, 'ui-menu-left').setScale(0.5).setScrollFactor(0, 0),
            this.add.image(centerX + 66, 190, 'ui-menu-right').setScale(0.5).setScrollFactor(0, 0),
        ]
        this.menu = [
            new MenuItem(this, centerX, 190, 'Start', textConfig, {nextScene: 'game', menuIndicators}),
            new MenuItem(this, centerX, 215, 'Options', textConfig, {nextScene: 'options', menuIndicators}),
        ]
        this.menuIndex=0
        createCharacterAnims(this.anims)
		const map = this.make.tilemap({key: 'dungeon-start'})
		const tileset = map.addTilesetImage('dungeon', 'tiles', 16, 16, 1, 2)
		map.createStaticLayer('Ground', tileset)
		const wallsLayer = map.createStaticLayer('Walls', tileset)
        wallsLayer.setCollisionByProperty({collides: true})
        const playerTile = map.getObjectLayer('Characters').objects.find(obj=>obj.type==='player') as Phaser.Types.Tilemaps.TiledObject
        this.player = new Faune(this, playerTile.x!, playerTile.y!)
        this.cameras.main.startFollow(this.player, true)
        this.cursors = this.input.keyboard.addKeys('up,down,left,right,space,enter')
        this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER).on('up', ()=>this.select())
    }

    create() {
        this.cameras.main.fadeIn(550, 0, 0, 0)
        this.sndmgr.play('music-menu', {loop: true})
        this.walk()
        this.time.addEvent({
            delay: 90000,
            callback: ()=>{
                this.walk(-this.speed)
            },
            loop: true
        })
    }

    private select() {
        this.input.keyboard.removeAllKeys()
        if( this.menuSelection.nextScene==='game' ) this.sndmgr.fade('music-menu')
        this.cameras.main.fadeOut(1000, 0, 0, 0)
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, ()=>{
            this.scene.start(this.menuSelection.nextScene)
        })
    }

    walk(speed:number = this.speed) {
        this.player.setDirection(speed, 0)
        this.player.setVelocityX(speed)
        this.player.play(this.player.directionAnim, true)
        this.speed=speed
    }

    update(t:number, dt:number) {
		super.update(t, dt)
        if( !this.cursors ) return;
        if ( Phaser.Input.Keyboard.JustDown(this.cursors.space!) ) {
            this.select()
        } else if ( Phaser.Input.Keyboard.JustDown(this.cursors.up!) ) {
            this.menuIndex--
        } else if ( Phaser.Input.Keyboard.JustDown(this.cursors.down!) ) {
            this.menuIndex++
        } else if ( Phaser.Input.Keyboard.JustDown(this.cursors.left!) ) {
            console.log("Left")
        } else if ( Phaser.Input.Keyboard.JustDown(this.cursors.right!) ) {
            console.log("Right")
        }
    }

}