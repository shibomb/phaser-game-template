import WebFontFile from '../files/WebFontFile.js'

export default class AbstractScene extends Phaser.Scene {
  get CLASS_NAME() {
    return this.constructor.name
  }

  // ----------------------------------------
  // life cycle events
  // ----------------------------------------

  /**
   *
   */
  init(data) {
    const FUNC_NAME = 'init'
    console.log(`${this.CLASS_NAME}#${FUNC_NAME} [START]`)

    // nothing

    console.log(`${this.CLASS_NAME}#${FUNC_NAME} [FINISHED]`)
  }

  /**
   *
   */
  preload() {
    const FUNC_NAME = 'preload'
    console.log(`${this.CLASS_NAME}#${FUNC_NAME} [START]`)

    // --------------------
    // load events
    // --------------------
    this.load.on('progress', this.onPreloadProgress, this)

    this.load.on('fileprogress', this.onPreloadFileprogress, this)

    this.load.on('complete', this.onPreloadFinished, this)

    // --------------------
    // preload
    // --------------------
    this.onPreloadPrepare()

    console.log(`${this.CLASS_NAME}#${FUNC_NAME} [FINISHED]`)
  }

  /**
   *
   */
  onPreloadPrepare() {
    const FUNC_NAME = 'onPreloadPrepare'
    console.log(`${this.CLASS_NAME}#${FUNC_NAME} [START]`)

    // nothing

    console.log(`${this.CLASS_NAME}#${FUNC_NAME} [FINISHED]`)
  }

  /**
   *
   */
  onPreloadProgress(value) {
    const FUNC_NAME = 'onPreloadProgress'
    console.log(`${this.CLASS_NAME}#${FUNC_NAME} [START]`, value)

    // nothing

    console.log(`${this.CLASS_NAME}#${FUNC_NAME} [FINISHED]`)
  }

  /**
   *
   */
  onPreloadFileprogress(file) {
    const FUNC_NAME = 'onPreloadFileprogress'
    console.log(`${this.CLASS_NAME}#${FUNC_NAME} [START]`, file)

    // nothing

    console.log(`${this.CLASS_NAME}#${FUNC_NAME} [FINISHED]`)
  }

  /**
   *
   */
  onPreloadFinished() {
    const FUNC_NAME = 'onPreloadFinished'
    console.log(`${this.CLASS_NAME}#${FUNC_NAME} [START]`)

    // nothing

    console.log(`${this.CLASS_NAME}#${FUNC_NAME} [FINISHED]`)
  }

  /**
   *
   */
  create(data) {
    const FUNC_NAME = 'create'
    console.log(`${this.CLASS_NAME}#${FUNC_NAME} [START]`, data)

    // nothing

    console.log(`${this.CLASS_NAME}#${FUNC_NAME} [FINISHED]`)
  }

  /**
   *
   */
  update(time, delta) {
    // const FUNC_NAME = 'update'
    // console.log(`${this.CLASS_NAME}#${FUNC_NAME} start`)
    // nothing
    // console.log(`${this.CLASS_NAME}#${FUNC_NAME} [FINISHED]`)
  }

  // ----------------------------------------
  // scene transition
  // ----------------------------------------

  sceneIn() {
    // fade-in
    this.cameras.main.fadeIn(500, 0, 0, 0)
  }

  /**
   *
   * @param {*} sceneName
   */
  sceneTo(sceneName, data = null) {
    // fade-out
    this.cameras.main.fadeOut(500, 0, 0, 0)
    this.cameras.main.once(
      Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,
      (cam, effect) => {
        this.scene.start(sceneName, data)
      }
    )
  }

  // ----------------------------------------
  // methods
  // ----------------------------------------

  /**
   *
   * @param {String} align 'left','center', 'right'
   * @param {Number} row row 1-24
   * @param {String} text text
   * @param {Number} fontSize default:12
   * @param {String} color default: '#fff'
   */
  addText(
    align,
    row,
    text,
    style = {},
    option = { hitKey: null, clickable: false, callback: null }
  ) {
    // const FUNC_NAME = 'addText'
    // console.log(`${this.CLASS_NAME}#${FUNC_NAME} [START]`)

    const width = this.scale.width
    const height = this.scale.height

    let posX = width * 0.5
    let posY = height * (row / (height / 25))
    let originX = 0.5

    // x pos (default center)
    if (align.includes('center-left')) {
      posX -= width * 0.02
      originX = 1
    } else if (align.includes('center-right')) {
      posX += width * 0.02
      originX = 0
    } else if (align.includes('left')) {
      posX = width * 0.02
      originX = 0
    } else if (align.includes('right')) {
      posX = width - width * 0.02
      originX = 1
    }

    // y pos (default top)
    if (align.includes('-center')) {
      posY = height * 0.5 + height * (row / (height / 25))
    } else if (align.includes('-bottom')) {
      posY = height - height * (row / (height / 25))
    }

    // merge style
    const styleOption = Object.assign(
      {
        fontFamily: '"Press Start 2P"',
        fontSize: 12,
        color: '#fff',
      },
      style
    )

    // console.log(`${this.CLASS_NAME}#${FUNC_NAME} [FINISHED]`)

    // addText
    const obj = this.add
      .text(posX, posY, text, styleOption)
      .setOrigin(originX, 0.5)

    // interactive
    if (option.hitKey) {
      this.input.keyboard.once(option.hitKey, option.callback)
    }
    if (option.clickable) {
      obj.setInteractive().on('pointerdown', option.callback)
    }

    return obj
  }
}
