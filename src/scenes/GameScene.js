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

  /** @type {Phaser.Time.Clock} */
  gameTimerLoop

  /** @type {number} */
  gameTimer = 0

  /** @type {Phaser.GameObjects.Text} */
  gameTimerText

  /** @type {any} */
  scoreData = {
    current: 0,
    high: 0,
  }

  /** @type {Phaser.GameObjects.Text} */
  scoreText

  /** @type {Phaser.GameObjects.Text} */
  highScoreText

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

    // ----------------------------------------
    // セーブデータをロード
    // ----------------------------------------
    this.scoreData =
      JSON.parse(localStorage.getItem('scoreData')) ?? this.scoreData

    // ----------------------------------------
    // 背景
    // ----------------------------------------
    this.cameras.main.setBackgroundColor('#000000')

    // ----------------------------------------
    // GUI
    // ----------------------------------------
    // back
    const backOption = {
      hitKey: 'keydown-ESC',
      clickable: true,
      callback: () => {
        this.sceneTo('game-over')
      },
    }
    this.addText('left', 1, '<<[ESC]', {}, backOption)

    this.gameTimerText = this.addText('right', 1, `TIME: 0`, {}, {})

    this.scoreText = this.addText('center', 1, `SCORE: 0`, {}, {})
    this.highScoreText = this.addText(
      'center',
      2,
      `HIGH-SCORE: ${this.scoreData.high}`,
      {},
      {}
    )

    // ----------------------------------------
    // スプライト
    // ----------------------------------------

    // --------------------
    // create the players
    this.keyboardController = new KeyboardController(this, '')
    this.players = this.physics.add.group()
    if (true) {
      const player = new Player(
        this,
        this.scale.width * (1 / 2),
        this.scale.height * (1 / 2)
      )
      this.add.existing(player)

      this.players.add(player)

      player.init()
    }

    // --------------------
    // create the bombs
    this.bombs = this.physics.add.group()
    // add on game timer

    // ----------------------------------------
    // 物理エンジン
    // ----------------------------------------

    this.physics.world.addCollider(this.players, this.bombs)
    this.physics.world.addCollider(this.bombs, this.bombs)

    this.physics.add.overlap(
      this.players,
      this.bombs,
      this.handleHitPlayerAndBomb,
      undefined,
      this
    )

    // --------------------
    // init
    this.gameTimer = 0
    this.scoreData.current = 0

    this.gameTimerLoop = this.time.addEvent({
      delay: 1000,
      callback: () => {
        this.gameTimer++
        this.gameTimerText.text = `TIME: ${this.gameTimer}`

        if (this.gameTimer == 30) {
          this.time.removeAllEvents()
          localStorage.setItem('scoreData', JSON.stringify(this.scoreData))

          this.sceneTo('game-over')
        }

        this.spawnBomb()
      },
      callbackScope: this,
      loop: true,
    })

    // --------------------
    //
    this.sceneIn()
    console.log(`${this.CLASS_NAME}#${FUNC_NAME} [FINISHED]`)
  }

  update(time, delta) {}

  /**
   *
   */
  spawnBomb() {
    const bomb = new Bomb(
      this,
      Math.random() * this.scale.width,
      Math.random() * this.scale.height
    )
    this.add.existing(bomb)

    this.bombs.add(bomb)

    // body操作系の処理は group add の後で呼び出す必要がある
    bomb.setTarget(this.players.children.get(0))
    bomb.init()
  }

  /**
   * @param {Player} player
   * @param {Bomb} bomb
   */
  handleHitPlayerAndBomb(player, bomb) {
    const FUNC_NAME = 'handleHitPlayerAndBomb'
    console.log(`${this.CLASS_NAME}#${FUNC_NAME} [START]`)

    const nextSound = this.sound.add('next')
    nextSound.play()

    // hide from display
    // and disable from physics world
    this.bombs.killAndHide(bomb)
    this.physics.world.disableBody(bomb.body)

    // increment score by 1
    this.scoreData.current++
    if (this.scoreData.current > this.scoreData.high) {
      this.scoreData.high = this.scoreData.current
    }

    // create new text value and set it
    this.scoreText.text = `SCORE: ${this.scoreData.current}`
    this.highScoreText.text = `HIGH-SCORE: ${this.scoreData.high}`

    console.log(`${this.CLASS_NAME}#${FUNC_NAME} [FINISHED]`)
  }
}
