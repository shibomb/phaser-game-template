import Phaser from '../../lib/phaser.js'

import AbstractContainer from './AbstractContainer.js'

const PREFIX = 'Player'

export default class Player extends AbstractContainer {
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
   */
  constructor(scene, x, y) {
    const FUNC_NAME = 'constructor'
    console.log(`${PREFIX}#${FUNC_NAME} [START]`)

    super(scene, x, y)

    // ----------------------------------------
    // スプライト設定
    // ----------------------------------------

    // ---------------
    // メインスプライト
    // ---------------
    this.main = scene.add
      .sprite(0, 0, `${PREFIX}_idle`, 0)
      .play(`${PREFIX}_idle`)

    this.main.setOrigin(0.5, 1)
    this.main.setScale((scene.scale.width / this.main.displayWidth) * (1 / 12))

    this.add(this.main)

    // ---------------
    // デバッグ情報
    // ---------------
    this.isDebug = true
    this.createDebugInfo()

    // ----------------------------------------
    // 物理エンジン設定
    // ----------------------------------------
    scene.physics.world.enable(this)

    // body範囲を調整
    /** @type {Phaser.Physics.Arcade.Body} */
    const body = this.body
    body.setSize(this.main.displayWidth * 0.75, this.main.displayHeight * 0.75)
    body.setOffset(
      body.width * -this.main.originX,
      body.height * -this.main.originY
    )

    // ----------------------------------------
    // 設定リセット
    // ----------------------------------------
    this.init()

    console.log(`${this.CLASS_NAME}#${FUNC_NAME} [FINISHED]`)
  }

  /**
   * 設定リセット
   */
  init() {
    const FUNC_NAME = 'init'
    console.log(`${this.CLASS_NAME}#${FUNC_NAME} [START]`)

    // moving data
    this.#movingData = {
      // mode: 'direct',
      mode: 'inertia',
      velocity: { x: 0, y: 0 }, // 速度
      velocityMax: { x: 200, y: 200 }, // 最大速度
      acceleration: { x: 5, y: 5 }, //  for inertia mode only. 加速度
      decelerationRate: { x: 0.98, y: 0.98 }, // for inertia mode only. no deceleration { x: 1, y: 1 }
    }

    console.log(`${this.CLASS_NAME}#${FUNC_NAME} [FINISHED]`)
  }

  /**
   * 更新前処理
   *
   * @param {number} time
   * @param {number} delta
   */
  preUpdate(time, delta) {
    const FUNC_NAME = 'preUpdate'
    // console.log(`${this.CLASS_NAME}#${FUNC_NAME} [START]`, [time, delta])

    this.setDebugInfo(null) // reset debug info

    /** @type {Phaser.Physics.Arcade.Body} */
    const body = this.body

    // 計算
    this.#updateMovingData(time, delta)

    // 移動
    body.setVelocityX(this.#movingData.velocity.x)
    body.setVelocityY(this.#movingData.velocity.y)

    this.horizontalWrap()
    this.verticalWrap()

    // スプライトの見た目を変更
    if (body.velocity.x == 0 && body.velocity.y == 0) {
      this.main.anims.play(`${PREFIX}_idle`, true)
    } else {
      this.main.anims.play(`${PREFIX}_move`, true)
      this.main.setFlipX(body.velocity.x < 0)
    }

    this.addDebugInfo([this.CLASS_NAME, `x=${this.x}`, `y=${this.y}`])

    // console.log(`${this.CLASS_NAME}#${FUNC_NAME} [FINISHED]`)
  }

  /**
   * 移動データ更新
   * @param {number} time
   * @param {number} delta
   */
  #updateMovingData(time, delta) {
    const inputDirection = this.scene.keyboardController.direction()
    const inputShift = this.scene.keyboardController.shift()
    const inputSpace = this.scene.keyboardController.space()
    const inputCtrl = this.scene.keyboardController.ctrl()

    const md = this.#movingData

    // ----------------------------------------
    // direct mode
    // ----------------------------------------
    if (md.mode == 'direct') {
      md.velocity.x = md.velocityMax.x * inputDirection.x
      md.velocity.y = md.velocityMax.y * inputDirection.y

      // sample: shift slow
      if (inputShift) {
        md.velocity.x *= inputShift ? 0.5 : 1
        md.velocity.y *= inputShift ? 0.5 : 1
      }
      // sample: ctrl turbo
      else if (inputCtrl) {
        md.velocity.x *= inputCtrl ? 2 : 1
        md.velocity.y *= inputCtrl ? 2 : 1
      }

      return
    }

    // ----------------------------------------
    // inertia mode
    // ----------------------------------------

    // sample: shift slow
    if (inputShift) {
      md.velocityMax = { x: 100, y: 100 }
    }
    // sample: ctrl turbo
    else if (inputCtrl) {
      md.velocityMax = { x: 800, y: 800 }
    } else {
      md.velocityMax = { x: 200, y: 200 }
    }

    // sample: space no stop
    if (inputSpace) {
      md.decelerationRate = { x: 1, y: 1 }
    } else {
      md.decelerationRate = { x: 0.98, y: 0.98 }
    }

    if (inputDirection.x == 0) {
      if (Math.abs(md.velocity.x) > md.acceleration.x) {
        md.velocity.x = md.velocity.x * md.decelerationRate.x
      } else {
        md.velocity.x = 0
      }
    } else {
      if (
        (inputDirection.x == -1 && md.velocity.x > 0) ||
        (inputDirection.x == 1 && md.velocity.x < 0) ||
        Math.abs(md.velocity.x) > md.velocityMax.x
      ) {
        md.velocity.x = md.velocity.x * md.decelerationRate.x
      }

      md.velocity.x +=
        Math.abs(md.velocity.x + md.acceleration.x * inputDirection.x) <=
        md.velocityMax.x
          ? md.acceleration.x * inputDirection.x
          : 0
    }

    if (inputDirection.y == 0) {
      if (Math.abs(md.velocity.y) > md.acceleration.y) {
        md.velocity.y = md.velocity.y * md.decelerationRate.y
      } else {
        md.velocity.y = 0
      }
    } else {
      if (
        (inputDirection.y == -1 && md.velocity.y > 0) ||
        (inputDirection.y == 1 && md.velocity.y < 0) ||
        Math.abs(md.velocity.y) > md.velocityMax.y
      ) {
        md.velocity.y = md.velocity.y * md.decelerationRate.y
      }
      md.velocity.y +=
        Math.abs(md.velocity.y + md.acceleration.y * inputDirection.y) <=
        md.velocityMax.y
          ? md.acceleration.y * inputDirection.y
          : 0
    }
  }
}
