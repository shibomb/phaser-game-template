import AbstractScene from './AbstractScene.js'

const PREFIX = 'GameOverScene'

export default class GameOverScene extends AbstractScene {
  /**
   *
   */
  constructor() {
    const FUNC_NAME = 'constructor'
    console.log(`${PREFIX}#${FUNC_NAME} [START]`)

    super('game-over')

    console.log(`${this.CLASS_NAME}#${FUNC_NAME} [FINISHED]`)
  }

  /**
   *
   */
  create(data) {
    const FUNC_NAME = 'create'
    console.log(`${this.CLASS_NAME}#${FUNC_NAME} [START]`)

    // --------------------
    const nextSound = this.sound.add('next')

    // --------------------

    // back
    const backOption = {
      hitKey: 'keydown-ESC',
      clickable: true,
      callback: () => {
        this.sceneTo('title')
      },
    }
    this.addText('left', 1, '<<[ESC]', {}, backOption)

    // game over
    this.addText('center-center', 0, 'GAME OVER', {
      fontSize: 32,
    })

    // restart
    const restartOption = {
      hitKey: 'keydown-SPACE',
      clickable: true,
      callback: () => {
        nextSound.play()
        this.sceneTo('game')
      },
    }
    this.addText(
      'center-center',
      4,
      'PRESS [SPACE] TO RESTART',
      {},
      restartOption
    )

    this.sceneIn()
    console.log(`${this.CLASS_NAME}#${FUNC_NAME} [FINISHED]`)
  }
}
