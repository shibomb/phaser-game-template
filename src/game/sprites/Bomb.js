import Phaser from '../../lib/phaser.js'

import AbstractContainer from './AbstractContainer.js'

const PREFIX = 'Bomb'

export default class Bomb extends AbstractContainer {
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

  // moving variables
  #movingData

  // player
  #target

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
    // メインスプライトの生成
    this.main = this.scene.add
      .sprite(0, 0, `${PREFIX}_idle`, 0)
      .play(`${PREFIX}_idle`)

    this.main.setOrigin(0.5, 0.5)
    this.main.setScale(
      (this.scene.scale.width / this.main.displayWidth) * (1 / 12)
    )

    this.add(this.main)

    // ---------------
    // デバッグ情報
    // ---------------
    this.isDebug = false
    this.createDebugInfo()

    // ----------------------------------------
    // 物理エンジン設定
    // ----------------------------------------
    this.scene.physics.world.enable(this)

    // body範囲を調整
    /** @type {Phaser.Physics.Arcade.Body} */
    const body = this.body
    // body.setSize(this.main.displayWidth * 0.75, this.main.displayHeight * 0.75)
    body.setCircle(this.main.displayWidth * 0.5 * 0.75)
    body.setOffset(
      body.width * -this.main.originX,
      body.height * -this.main.originY
    )

    // ----------------------------------------
    // 設定リセット
    // ----------------------------------------
    // groupにaddする場合は、add後に呼び出す必要がある
    // this.init()

    console.log(`${this.CLASS_NAME}#${FUNC_NAME} [FINISHED]`)
  }

  init() {
    const FUNC_NAME = 'init'
    console.log(`${this.CLASS_NAME}#${FUNC_NAME} [START]`)

    // moving data
    this.#movingData = {
      velocity: { x: 0, y: 0 }, // 速度
      velocityMax: { x: 400, y: 400 }, // 最大速度
      acceleration: { x: 5, y: 5 }, // 加速度
    }

    const body = this.body
    body.setVelocityX(
      this.#movingData.velocityMax.x * Phaser.Math.FloatBetween(-1, 1)
    )
    body.setVelocityY(
      this.#movingData.velocityMax.y * Phaser.Math.FloatBetween(-1, 1)
    )
    body.collideWorldBounds = true
    body.bounce.set(1)

    console.log(`${this.CLASS_NAME}#${FUNC_NAME} [FINISHED]`)
  }

  /**
   *
   */
  setTarget(target) {
    const FUNC_NAME = 'setTarget'
    // console.log(`${this.CLASS_NAME}#${FUNC_NAME} [START]`, [time, delta])

    this.#target = target

    // console.log(`${this.CLASS_NAME}#${FUNC_NAME} [FINISHED]`)
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
    // this.#updateMovingData(time, delta)

    // 移動
    // body.setVelocityX(this.#movingData.velocity.x)
    // body.setVelocityY(this.#movingData.velocity.y)

    // this.horizontalWrap()
    // this.verticalWrap()

    const angle = Phaser.Math.Angle.BetweenPoints(this, this.#target)
    this.main.rotation = angle

    this.addDebugInfo([
      this.CLASS_NAME,
      JSON.stringify(this.body.velocity),
      angle,
    ])

    // console.log(`${this.CLASS_NAME}#${FUNC_NAME} [FINISHED]`)
  }

  /**
   * 移動データ更新
   *
   * @param {number} time
   * @param {number} delta
   */
  #updateMovingData(time, delta) {
    const FUNC_NAME = 'updateMovingData'
    // console.log(`${this.CLASS_NAME}#${FUNC_NAME} [START]`, [time, delta])

    // this.addDebugInfo([
    //   this.CLASS_NAME,
    //   `x=${this.#target.x}`,
    //   `y=${this.#target.y}`,
    // ])

    const md = this.#movingData

    md.velocity.x += md.acceleration.x * (this.x < this.#target.x ? 1 : -1)
    if (Math.abs(md.velocity.x) > md.velocityMax.x) {
      md.velocity.x += md.acceleration.x * (md.velocity.x > 0 ? -1 : 1)
    }

    md.velocity.y += md.acceleration.y * (this.y < this.#target.y ? 1 : -1)
    if (Math.abs(md.velocity.y) > md.velocityMax.y) {
      md.velocity.y += md.acceleration.y * (md.velocity.y > 0 ? -1 : 1)
    }

    // console.log(`${this.CLASS_NAME}#${FUNC_NAME} [FINISHED]`)
  }
}
