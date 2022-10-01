import Phaser from '../lib/phaser.js'

const PREFIX = 'KeyboardController'

export default class KeyboardController {
  // ----------------------------------------
  // instance
  // ----------------------------------------

  /** @type {Phaser.Types.Input.Keyboard.CursorKeys} */
  #cursors

  /** @type {any} */
  #keys

  /**
   * @param {Phaser.Scene} scene
   * @param {string} additionalKeys ''
   */
  constructor(scene, additionalKeys) {
    const FUNC_NAME = 'constructor'
    console.log(`${PREFIX}#${FUNC_NAME} [START]`)

    this.init(scene, additionalKeys)

    console.log(`${this.CLASS_NAME}#${FUNC_NAME} [FINISHED]`)
  }

  init(scene, additionalKeys) {
    const FUNC_NAME = 'init'
    console.log(`${this.CLASS_NAME}#${FUNC_NAME} [START]`)

    // controller setup
    this.#cursors = scene.input.keyboard.createCursorKeys()
    this.#keys = scene.input.keyboard.addKeys(
      'W,S,A,D,CTRL' + ',' + additionalKeys
    )

    console.log(`${this.CLASS_NAME}#${FUNC_NAME} [FINISHED]`)
  }

  /**
   * must be called in update() lifetime.
   * @return -1:left, 0:neutral, 1:right
   */
  horizontal() {
    const isLeft = this.#keys.A.isDown || this.#cursors.left.isDown
    const isRight = this.#keys.D.isDown || this.#cursors.right.isDown

    if ((isLeft && isRight) || (!isLeft && !isRight)) {
      return 0
    } else if (isLeft) {
      return -1
    } else if (isRight) {
      return 1
    }

    return 0
  }

  /**
   * must be called in update() lifetime.
   * @return -1:up, 0:neutral, 1:down
   */
  vertical() {
    const isUp = this.#keys.W.isDown || this.#cursors.up.isDown
    const isDown = this.#keys.S.isDown || this.#cursors.down.isDown

    if ((isUp && isDown) || (!isUp && !isDown)) {
      return 0
    } else if (isUp) {
      return -1
    } else if (isDown) {
      return 1
    }

    return 0
  }

  /**
   * must be called in update() lifetime.
   * @return {x: -1:left, 0:neutral, 1:right, y: -1:up, 0:neutral, 1:down}
   */
  direction() {
    return { x: this.horizontal(), y: this.vertical() }
  }

  /**
   * must be called in update() lifetime.
   * @return boolean space is Down
   */
  space() {
    return this.#cursors.space.isDown
  }

  /**
   * must be called in update() lifetime.
   * @return boolean shift is Down
   */
  shift() {
    return this.#cursors.shift.isDown
  }

  /**
   * must be called in update() lifetime.
   * @return boolean space is Down
   */
  ctrl() {
    return this.#keys.CTRL.isDown
  }

  /**
   * must be called in update() lifetime.
   * @return boolean Key is Down
   */
  isDown(key) {
    return this.#keys[key].isDown
  }
}
