import AbstractScene from './AbstractScene.js'

import Player from '../game/sprites/Player.js'
import Bomb from '../game/sprites/Bomb.js'
import KeyboardController from '../input/KeyboardController.js'

const PREFIX = 'GameScene'

export default class GameScene extends AbstractScene {
  // ----------------------------------------
  // static
  // ----------------------------------------

  static spritesClasses = [Player, Bomb]

  // ----------------------------------------
  // instance
  // ----------------------------------------

  // carrotsCollected = 0

  /** @type */
  keyboardController

  // /** @type {Phaser.Physics.Arcade.StaticGroup} */
  // platforms

  /** @type {Phaser.Physics.Arcade.Group} */
  players

  /** @type {Phaser.Physics.Arcade.Group} */
  bombs

  // /** @type {Phaser.Physics.Arcade.Group} */
  // carrots

  // /** @type {Phaser.GameObjects.Text} */
  // carrotsCollectedText

  constructor() {
    const FUNC_NAME = 'constructor'
    console.log(`${PREFIX}#${FUNC_NAME} [START]`)

    super('game')

    this.spritesClasses = console.log(
      `${this.CLASS_NAME}#${FUNC_NAME} [FINISHED]`
    )
  }

  onPreloadPrepare() {
    const FUNC_NAME = 'onPreloadPrepare'
    console.log(`${this.CLASS_NAME}#${FUNC_NAME} [START]`)

    // load texture atlas
    let path = '../../assets/img/jumperpack_kenney/Spritesheets'
    this.load.atlasXML(
      'spritesheet_jumper',
      `${path}/spritesheet_jumper.png`,
      `${path}/spritesheet_jumper.xml`
    )

    GameScene.spritesClasses.forEach((spritesClass) => {
      spritesClass.preload(this)
    })

    console.log(`${this.CLASS_NAME}#${FUNC_NAME} [FINISHED]`)
  }

  onPreloadFinished() {
    const FUNC_NAME = 'onPreloadFinished'
    console.log(`${this.CLASS_NAME}#${FUNC_NAME} [START]`)

    GameScene.spritesClasses.forEach((spritesClass) => {
      spritesClass.preloadFinished(this)
    })

    console.log(`${this.CLASS_NAME}#${FUNC_NAME} [FINISHED]`)
  }

  create(data) {
    const FUNC_NAME = 'create'
    console.log(`${this.CLASS_NAME}#${FUNC_NAME} [START]`, data)

    const width = this.scale.width
    const height = this.scale.height

    //
    this.keyboardController = new KeyboardController(this, '')

    // back
    const backOption = {
      hitKey: 'keydown-ESC',
      clickable: true,
      callback: () => {
        this.sceneTo('game-over')
      },
    }
    this.addText('left', 1, '<<[ESC]', {}, backOption)

    // // title
    // const titleImg = this.add.image(width * 0.5, height * 0.33, 'title')
    // titleImg.setScale((width / titleImg.width) * 0.75)

    // this.add.image(240, 320, 'background').setScrollFactor(1, 0)

    // this.physics.add.image(240, 320, 'player_idle1').setScale(0.5)
    // // create the group
    // this.platforms = this.physics.add.staticGroup()
    // // then create 5 plaforms from the group
    // for (let i = 0; i < 5; i++) {
    //   const x = Phaser.Math.Between(80, 400)
    //   const y = 150 * i
    //   /** @type {Phaser.Physics.Arcade.Sprite} */
    //   const platform = this.platforms.create(x, y, 'platform')
    //   platform.scale = 0.5
    //   /** @type {Phaser.Physics.Arcade.StaticBody} */
    //   const body = platform.body
    //   body.updateFromGameObject()
    // }

    // create the players
    this.players = this.physics.add.group()
    this.players.add(new Player(this, width * (1 / 2), height * (1 / 2)), true)

    // create the bombs
    this.bombs = this.physics.add.group()
    for (let i = 0; i < 10; i++) {
      const bomb = new Bomb(
        this,
        Math.random() * width,
        Math.random() * height,
        1 / 12
      )
      this.bombs.add(bomb, true)
    }
    this.physics.world.addCollider(this.bombs, this.bombs)

    // this.physics.add.collider(this.player)
    // this.physics.add.collider(this.platforms, this.player)
    // this.player.body.checkCollision.up = false
    // this.player.body.checkCollision.left = false
    // this.player.body.checkCollision.right = false
    // // craete a carrots
    // this.carrots = this.physics.add.group({ classType: Carrot })
    // // this.carrots.get(240, 320, 'carrot')
    // // add this collider
    // this.physics.add.collider(this.platforms, this.carrots)
    // // formatted this way to make it easier to read
    // this.physics.add.overlap(
    //   this.player,
    //   this.carrots,
    //   this.handleCollectCarrot, // called on overlap
    //   undefined,
    //   this
    // )
    // // camera settings
    // this.cameras.main.startFollow(this.player)
    // // set the horizontal dead zone to 1.5x game width
    // this.cameras.main.setDeadzone(this.scale.width * 1.5)
    // const style = { color: '#000', fontSize: 24 }
    // this.carrotsCollectedText = this.add
    //   .text(240, 10, 'Carrots: 0', style)
    //   .setScrollFactor(0)
    //   .setOrigin(0.5, 0)

    this.sceneIn()
    console.log(`${this.CLASS_NAME}#${FUNC_NAME} [FINISHED]`)
  }

  update(time, delta) {
    // const FUNC_NAME = 'update'
    // console.log(`${this.CLASS_NAME}#${FUNC_NAME} [START]`)

    this.players.getChildren().forEach((sprite) => {
      sprite.update(time, delta)
    })

    this.bombs.getChildren().forEach((sprite) => {
      sprite.update(time, delta, this.players.getFirstAlive())
    })

    // ----------
    // player
    // ----------
    // const touchingDown = this.player.body.touching.down
    // if (touchingDown) {
    //   this.player.setVelocityY(-300)
    //   // switch to jump texture
    //   this.player.setTexture('bunny-jump')
    //   // play jump sound
    //   this.sound.play('jump')
    // }
    // const vy = this.player.body.velocity.y
    // if (vy > 0 && this.player.texture.key !== 'bunny-stand') {
    //   this.player.setTexture('bunny-stand')
    // }
    // this.horizontalWrap(this.player)

    // // ----------
    // // platform
    // // ----------
    // this.platforms.children.iterate((child) => {
    //   /** @type {Phaser.Physics.Arcade.Sprite} */
    //   const platform = child
    //   const scrollY = this.cameras.main.scrollY
    //   if (platform.y >= scrollY + 700) {
    //     platform.y = scrollY - Phaser.Math.Between(50, 100)
    //     platform.body.updateFromGameObject()
    //     // create a carrot above the platform being reused
    //     this.addCarrotAbove(platform)
    //   }
    // })
    // // ----------
    // // game over
    // // ----------
    // const bottomPlatform = this.findBottomMostPlatform()
    // if (this.player.y > bottomPlatform.y + 200) {
    //   // console.log('game over')
    //   // add this...
    //   this.scene.start('game-over')
    // }
  }

  // /**
  //  * @param {Phaser.GameObjects.Sprite} sprite
  //  */
  // horizontalWrap(sprite) {
  //   const halfWidth = sprite.displayWidth * 0.5
  //   const gameWidth = this.scale.width
  //   if (sprite.x < -halfWidth) {
  //     sprite.x = gameWidth + halfWidth
  //   } else if (sprite.x > gameWidth + halfWidth) {
  //     sprite.x = -halfWidth
  //   }
  // }

  // /**
  //  * @param {Phaser.GameObjects.Sprite} sprite
  //  */
  // addCarrotAbove(sprite) {
  //   const y = sprite.y - sprite.displayHeight

  //   /** @type {Phaser.Physics.Arcade.Sprite} */
  //   const carrot = this.carrots.get(sprite.x, y, 'carrot')

  //   // set active and visible
  //   carrot.setActive(true)
  //   carrot.setVisible(true)

  //   this.add.existing(carrot)

  //   // update the physics body size
  //   carrot.body.setSize(carrot.width, carrot.height)

  //   // make sure body is enabed in the physics world
  //   this.physics.world.enable(carrot)

  //   return carrot
  // }

  // /**
  //  * @param {Phaser.Physics.Arcade.Sprite} player
  //  * @param {Carrot} carrot
  //  */
  // handleCollectCarrot(player, carrot) {
  //   // hide from display
  //   this.carrots.killAndHide(carrot)

  //   // disable from physics world
  //   this.physics.world.disableBody(carrot.body)

  //   // increment by 1
  //   this.carrotsCollected++

  //   // create new text value and set it
  //   const value = `Carrots: ${this.carrotsCollected}`
  //   this.carrotsCollectedText.text = value
  // }

  // findBottomMostPlatform() {
  //   const platforms = this.platforms.getChildren()
  //   let bottomPlatform = platforms[0]

  //   for (let i = 1; i < platforms.length; ++i) {
  //     const platform = platforms[i]

  //     // discard any platforms that are above current
  //     if (platform.y < bottomPlatform.y) {
  //       continue
  //     }

  //     bottomPlatform = platform
  //   }
  //   return bottomPlatform
  // }
}
