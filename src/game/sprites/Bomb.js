import Phaser from '../../lib/phaser.js'

import AbstractSprite from './AbstractSprite.js'

const PREFIX = 'Bomb'

export default class Bomb extends AbstractSprite {
  // ----------------------------------------
  // static
  // ----------------------------------------

  static preload(scene) {
    const FUNC_NAME = 'preload'
    console.log(`${PREFIX}#${FUNC_NAME} [START]`)

    // nothing
    // (animations will be created with texture atlas that loaded in Scene)

    console.log(`${PREFIX}#${FUNC_NAME} [FINISHED]`)
  }

  static preloadFinished(scene) {
    const FUNC_NAME = 'preloadFinished'
    console.log(`${PREFIX}#${FUNC_NAME} [START]`)

    scene.anims.create({
      key: `${PREFIX}_idle`,
      frames: [
        { key: 'spritesheet_jumper', frame: 'spikeBall1.png' },
        { key: 'spritesheet_jumper', frame: 'spikeBall_2.png' },
      ],
      frameRate: 8,
      repeat: -1,
    })

    console.log(`${PREFIX}#${FUNC_NAME} [FINISHED]`)
  }

  // ----------------------------------------
  // instance
  // ----------------------------------------

  accelerationX
  accelerationY
  accelerationMaxX
  accelerationMaxY
  additionalX
  additionalY

  /**
   * @param {Phaser.Scene} scene
   * @param {number} x
   * @param {number} y
   * @param {string} scale
   */
  constructor(scene, x, y, scale) {
    const FUNC_NAME = 'constructor'
    console.log(`${PREFIX}#${FUNC_NAME} [START]`)

    super(scene, x, y, `${PREFIX}_idle`, 0)

    this.init(scale)

    console.log(`${this.CLASS_NAME}#${FUNC_NAME} [FINISHED]`)
  }

  init(scale) {
    const FUNC_NAME = 'init'
    console.log(`${this.CLASS_NAME}#${FUNC_NAME} [START]`)

    // sprite setup
    this.play(`${PREFIX}_idle`)
    this.setScaleAgaintSceneWidth(scale)
    this.scene.physics.world.enable(this)

    //
    this.accelerationX = 0
    this.accelerationY = 0
    this.accelerationMaxX = 400
    this.accelerationMaxY = 400
    this.additionalX = 1
    this.additionalY = 1

    console.log(`Bomb#${FUNC_NAME} [FINISHED]`)
  }

  /**
   *
   * @param {Phaser.Physics.Arcade.Sprite} target
   */
  update(time, delta, target) {
    // calc
    this.accelerationX +=
      Math.abs(this.accelerationX) < this.accelerationMaxX
        ? this.additionalX * (this.x < target.x ? 1 : -1)
        : 0
    this.accelerationY +=
      Math.abs(this.accelerationY) < this.accelerationMaxY
        ? this.additionalY * (this.y < target.y ? 1 : -1)
        : 0

    // move
    this.setVelocityX(this.accelerationX)
    this.setVelocityY(this.accelerationY)

    this.horizontalWrap()
    this.verticalWrap()
  }
}
