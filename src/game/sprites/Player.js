import Phaser from '../../lib/phaser.js'

import AbstractSprite from './AbstractSprite.js'

const PREFIX = 'Player'

export default class Player extends AbstractSprite {
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
        { key: 'spritesheet_jumper', frame: 'bunny1_ready.png' },
        { key: 'spritesheet_jumper', frame: 'bunny1_stand.png' },
      ],
      frameRate: 2,
      repeat: -1,
    })

    scene.anims.create({
      key: `${PREFIX}_move`,
      frames: scene.anims.generateFrameNames('spritesheet_jumper', {
        prefix: 'bunny1_walk',
        suffix: '.png',
        start: 1,
        end: 2,
        zeroPad: 1,
      }),
      frameRate: 8,
      repeat: -1,
    })

    scene.anims.create({
      key: `${PREFIX}_jump`,
      frames: [{ key: 'spritesheet_jumper', frame: 'bunny1_jump.png' }],
      frameRate: 1,
      repeat: -1,
    })

    console.log(`${PREFIX}#${FUNC_NAME} [FINISHED]`)
  }

  // ----------------------------------------
  // instance
  // ----------------------------------------

  /** @type {Phaser.Types.Input.Keyboard.CursorKeys} */
  cursors

  /** @type {any} */
  keys

  // moving variables
  #movingData

  /**
   * @param {Phaser.Scene} scene
   * @param {number} x
   * @param {number} y
   * @param {string} scale
   */
  constructor(scene, x, y) {
    const FUNC_NAME = 'constructor'
    console.log(`${PREFIX}#${FUNC_NAME} [START]`)

    super(scene, x, y, `${PREFIX}_idle`, 0)
    this.init()

    console.log(`${this.CLASS_NAME}#${FUNC_NAME} [FINISHED]`)
  }

  init() {
    const FUNC_NAME = 'init'
    console.log(`${this.CLASS_NAME}#${FUNC_NAME} [START]`)

    // sprite setup
    this.play(`${PREFIX}_idle`)
    this.setScaleAgaintSceneWidth(1 / 12)
    this.scene.physics.world.enable(this)

    // moving data
    this.#movingData = {
      mode: 'inertia', // 'direct' or 'inertia'
      acceleration: { x: 0, y: 0 },
      accelerationMax: { x: 200, y: 200 },
      additional: { x: 5, y: 5 }, // for inertia mode only.
      decelerationRate: { x: 0.98, y: 0.98 }, // for inertia mode only. no deceleration { x: 1, y: 1 }
    }

    console.log(`${this.CLASS_NAME}#${FUNC_NAME} [FINISHED]`)
  }

  update(time, delta) {
    // const FUNC_NAME = 'update'
    // console.log(`${this.CLASS_NAME}#${FUNC_NAME} [START]`, [time, delta])

    // calc
    this.#updateByController(time, delta)

    // move
    this.setVelocityX(this.#movingData.acceleration.x)
    this.setVelocityY(this.#movingData.acceleration.y)

    this.horizontalWrap()
    this.verticalWrap()

    // set animation
    if (this.body.velocity.x != 0 || this.body.velocity.y != 0) {
      this.anims.play(`${PREFIX}_move`, true)
      this.setFlipX(this.body.velocity.x < 0)
    } else {
      this.anims.play(`${PREFIX}_idle`, true)
    }
  }

  #updateByController(time, delta) {
    const inputDirection = this.scene.keyboardController.direction()
    const inputShift = this.scene.keyboardController.shift()
    const inputSpace = this.scene.keyboardController.space()
    const inputCtrl = this.scene.keyboardController.ctrl()

    const md = this.#movingData

    // --------------------
    // direct mode
    // --------------------
    if (md.mode == 'direct') {
      md.acceleration.x = md.accelerationMax.x * inputDirection.x
      md.acceleration.y = md.accelerationMax.y * inputDirection.y

      // sample: shift slow
      if (inputShift) {
        md.acceleration.x *= inputShift ? 0.5 : 1
        md.acceleration.y *= inputShift ? 0.5 : 1
      }
      // sample: ctrl turbo
      else if (inputCtrl) {
        md.acceleration.x *= inputCtrl ? 2 : 1
        md.acceleration.y *= inputCtrl ? 2 : 1
      }

      return
    }

    // --------------------
    // inertia mode
    // --------------------

    // sample: shift slow
    if (inputShift) {
      md.accelerationMax = { x: 100, y: 100 }
    }
    // sample: ctrl turbo
    else if (inputCtrl) {
      md.accelerationMax = { x: 800, y: 800 }
    } else {
      md.accelerationMax = { x: 200, y: 200 }
    }

    // sample: space no stop
    if (inputSpace) {
      md.decelerationRate = { x: 1, y: 1 }
    } else {
      md.decelerationRate = { x: 0.98, y: 0.98 }
    }

    if (inputDirection.x == 0) {
      if (Math.abs(md.acceleration.x) > md.additional.x) {
        md.acceleration.x = md.acceleration.x * md.decelerationRate.x
      } else {
        md.acceleration.x = 0
      }
    } else {
      if (
        (inputDirection.x == -1 && md.acceleration.x > 0) ||
        (inputDirection.x == 1 && md.acceleration.x < 0) ||
        Math.abs(md.acceleration.x) > md.accelerationMax.x
      ) {
        md.acceleration.x = md.acceleration.x * md.decelerationRate.x
      }

      md.acceleration.x +=
        Math.abs(md.acceleration.x + md.additional.x * inputDirection.x) <=
        md.accelerationMax.x
          ? md.additional.x * inputDirection.x
          : 0
    }

    if (inputDirection.y == 0) {
      if (Math.abs(md.acceleration.y) > md.additional.y) {
        md.acceleration.y = md.acceleration.y * md.decelerationRate.y
      } else {
        md.acceleration.y = 0
      }
    } else {
      if (
        (inputDirection.y == -1 && md.acceleration.y > 0) ||
        (inputDirection.y == 1 && md.acceleration.y < 0) ||
        Math.abs(md.acceleration.y) > md.accelerationMax.y
      ) {
        md.acceleration.y = md.acceleration.y * md.decelerationRate.y
      }
      md.acceleration.y +=
        Math.abs(md.acceleration.y + md.additional.y * inputDirection.y) <=
        md.accelerationMax.y
          ? md.additional.y * inputDirection.y
          : 0
    }
  }
}
