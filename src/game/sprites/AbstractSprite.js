import Phaser from '../../lib/phaser.js'

export default class AbstractSprite extends Phaser.Physics.Arcade.Sprite {
  get CLASS_NAME() {
    return this.constructor.name
  }

  /**
   * @param {*} scale
   */
  setScaleAgaintSceneWidth(scale) {
    const FUNC_NAME = 'setScaleAgaintSceneWidth'
    console.log(`${this.CLASS_NAME}#${FUNC_NAME} [START]`)

    this.setScale((this.scene.scale.width / this.displayWidth) * scale) //

    console.log(`${this.CLASS_NAME}#${FUNC_NAME} [FINISHED]`)
  }

  /**
   * @param {*} scale
   */
  setScaleAgaintSceneHeight(scale) {
    const FUNC_NAME = 'setScaleAgaintSceneHeight'
    console.log(`${this.CLASS_NAME}#${FUNC_NAME} [START]`)

    this.setScale((this.scene.scale.height / this.displayHeight) * scale) //

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
