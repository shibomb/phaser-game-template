import GameConfig from '../config/GameConfig.js'
import AbstractScene from './AbstractScene.js'

const PREFIX = 'TitleScene'

export default class TitleScene extends AbstractScene {
  /**
   *
   */
  constructor() {
    const FUNC_NAME = 'constructor'
    console.log(`${PREFIX}#${FUNC_NAME} [START]`)

    super('title')

    console.log(`${this.CLASS_NAME}#${FUNC_NAME} [FINISHED]`)
  }

  onPreloadPrepare() {
    const FUNC_NAME = 'onPreloadPrepare'
    console.log(`${this.CLASS_NAME}#${FUNC_NAME} [START]`)

    console.log(`${this.CLASS_NAME}#${FUNC_NAME} [FINISHED]`)
  }

  /**
   *
   */
  create(data) {
    const FUNC_NAME = 'create'
    console.log(`${this.CLASS_NAME}#${FUNC_NAME} [START]`, data)

    // --------------------
    const nextSound = this.sound.add('next')

    // --------------------
    const width = this.scale.width
    const height = this.scale.height

    // this.addText('center', 8, GameConfig.title, {
    //   fontSize: 32,
    // })
    const titleImg = this.add.image(width * (1 / 2), height * (4 / 12), 'title')
    titleImg.setScale((width / titleImg.width) * (9 / 12))

    // start
    const startOption = {
      hitKey: 'keydown-SPACE',
      clickable: true,
      callback: () => {
        nextSound.play()
        this.sceneTo('game')
      },
    }
    this.addText('center-center', 4, 'PRESS [SPACE] TO START', {}, startOption)

    // credit
    const creditOption = {
      hitKey: 'keydown-C',
      clickable: true,
      callback: () => {
        nextSound.play()
        this.sceneTo('credit')
      },
    }
    this.addText('center-bottom', 2, 'PRESS [C] TO CREDITS', {}, creditOption)

    // copyright
    this.addText('center-bottom', 1, GameConfig.copyright)

    this.sceneIn()
    console.log(`${this.CLASS_NAME}#${FUNC_NAME} [FINISHED]`)
  }
}
