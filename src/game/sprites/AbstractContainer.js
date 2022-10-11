import Phaser from '../../lib/phaser.js'

export default class AbstractContainer extends Phaser.GameObjects.Container {
  get CLASS_NAME() {
    return this.constructor.name
  }

  /** @type {Phaser.Arcade.Sprite} */
  main

  /** @type {boolean} */
  isDebug = true

  /** @type {Phaser.GameObjects.Text} */
  debugInfo

  /**
   *
   */
  createDebugInfo() {
    if (!this.isDebug) return

    const styleOption = {
      fontFamily: '"Press Start 2P"',
      fontSize: 9,
      color: '#0f0',
    }

    this.debugInfo = this.scene.add.text(
      this.main.displayWidth * this.main.originX,
      this.main.displayHeight * -this.main.originY,
      [this.CLASS_NAME],
      styleOption
    )

    this.add(this.debugInfo)
  }

  setDebugInfo(text) {
    if (!this.isDebug) return

    this.debugInfo.setText(text)
  }

  addDebugInfo(text) {
    if (!this.isDebug) return

    let original = this.debugInfo.text
    if (text instanceof Array) {
      text.unshift(original)
      this.debugInfo.setText(text)
    } else {
      this.debugInfo.setText([original, text])
    }
  }

  /**
   * 画面サイズとスプライトのサイズを比率で調整します。
   *
   * @param {*} scale
   */
  setScaleAgaintSceneWidth(scale) {
    const FUNC_NAME = 'setScaleAgaintSceneWidth'
    console.log(`${this.CLASS_NAME}#${FUNC_NAME} [START]`)

    this.setScale((this.scene.scale.width / this.displayWidth) * scale) //

    console.log(`${this.CLASS_NAME}#${FUNC_NAME} [FINISHED]`)
  }

  /**
   * 画面サイズとスプライトのサイズを比率で調整します。
   *
   * @param {*} scale
   */
  setScaleAgaintSceneHeight(scale) {
    const FUNC_NAME = 'setScaleAgaintSceneHeight'
    console.log(`${this.CLASS_NAME}#${FUNC_NAME} [START]`)

    this.setScale((this.scene.scale.height / displayHeight) * scale) //

    console.log(`${this.CLASS_NAME}#${FUNC_NAME} [FINISHED]`)
  }

  /**
   *
   */
  horizontalWrap() {
    const halfWidth = this.displayWidth * 0.5
    const gameWidth = this.scene.scale.width
    if (this.x < -halfWidth) {
      this.x = gameWidth + halfWidth
    } else if (this.x > gameWidth + halfWidth) {
      this.x = -halfWidth
    }
  }

  /**
   *
   */
  verticalWrap() {
    const halfHeight = this.displayHeight * 0.5
    const gameHeight = this.scene.scale.height
    if (this.y < -halfHeight) {
      this.y = gameHeight + halfHeight
    } else if (this.y > gameHeight + halfHeight) {
      this.y = -halfHeight
    }
  }
}
