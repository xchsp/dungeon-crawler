import Phaser from 'phaser'
import { sceneEvents } from '../events/EventCenter'

export default class GameUI extends Phaser.Scene {

    private face!: Phaser.GameObjects.Image
    private heartsGroup?: Phaser.GameObjects.Group
    private coinsLabel!: Phaser.GameObjects.Text
    private livesLabel!: Phaser.GameObjects.Text

    private _character: string = 'faune'
    private _coins!: number
    private _hearts!: number
    private _health!: number
    private _lives!: number

    constructor() {
        super('game-ui')
    }

    init(data) {
        this._character = data.character ?? this._character
        this._coins = data.coins ?? 0
        this._hearts = data.hearts ?? 3
        this._health = data.health ?? 3
        this._lives = data.lives ?? 3
    }

    get character() {return this._character}
    set character(name: string) {this.setCharacter(name)}
    get coins() {return this._coins}
    set coins(quantity: number) {this.setCoins(quantity)}
    get hearts() {return this._hearts}
    set hearts(quantity: number) {this.setHearts(quantity)}
    get health() {return this._health}
    set health(health: number) {this.setHealth(health)}
    get lives() {return this._lives}
    set lives(quantity: number) {this.setLives(quantity)}

    create() {
        const coinSprite = this.add.sprite(57, 27, 'treasure')
        coinSprite.play('coin-spin')
        this.coinsLabel = this.add.text(64, 21, '0', {
            fontSize: 12
        })
        this.livesLabel = this.add.text(33, 21, 'x3', {
            fontSize: 12
        })
        this.add.rectangle(0, 0, 220, 73, 0x000000, 0.5).setDepth(-1)
        this.setCharacter()
        this.setCoins()
        this.setHearts()
        this.setHealth()
        this.setLives()
        sceneEvents.on('player-coins-changed', this.setCoins, this)
        sceneEvents.on('player-health-changed', this.setHealth, this)
        sceneEvents.on('player-lives-changed', this.setLives, this)
        this.events.once(Phaser.Scenes.Events.SHUTDOWN, ()=>{
            sceneEvents.off('play-coins-changed', this.setCoins, this)
            sceneEvents.off('play-health-changed', this.setHealth, this)
            sceneEvents.off('play-lives-changed', this.setLives, this)
        })
    }

    setCharacter(name: string = this.character) {
        this._character = name
        this.face?.destroy()
        this.face = this.add.image(2, 1, 'face_' + name)
            .setOrigin(0, 0)
            .setScale(0.5)
    }

    setHearts(quantity: number = this.hearts) {
        this._hearts = quantity
        this.heartsGroup?.destroy()
        this.heartsGroup = this.add.group({
            classType: Phaser.GameObjects.Image
        })
        this.heartsGroup.createMultiple({
            key: 'ui-heart-full',
            setXY: {
                x: 40, 
                y: 10,
                stepX: 15
            },
            quantity
        })
    }

    setHealth(health: number = this.health) {
        this._health = health
        this.heartsGroup?.children?.each((go, idx)=>{
            const heart = go as Phaser.GameObjects.Image
            if( idx<Math.floor(health) ) heart.setTexture('ui-heart-full')
            else if( idx<health) heart.setTexture('ui-heart-half')
            else heart.setTexture('ui-heart-empty')
        })
    }

    setLives(quantity: number = this.lives) {
        this._lives = quantity
        this.livesLabel.text = 'x' + quantity
    }

    setCoins(coins: number = this.coins) {
        this.coinsLabel.text = coins.toLocaleString()
    }

}