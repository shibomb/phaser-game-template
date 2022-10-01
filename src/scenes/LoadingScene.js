import WebFontFile from '../files/WebFontFile.js'
import AbstractScene from './AbstractScene.js'

const PREFIX = 'LoadingScene'

export default class LoadingScene extends AbstractScene {
  /**
   *
   */
  constructor() {
    const FUNC_NAME = 'constructor'
    console.log(`${PREFIX}#${FUNC_NAME} [START]`)

    super('loading')

    console.log(`${this.CLASS_NAME}#${FUNC_NAME} [FINISHED]`)
  }

  onPreloadPrepare() {
    const FUNC_NAME = 'onPreloadPrepare'
    console.log(`${this.CLASS_NAME}#${FUNC_NAME} [START]`)

    // back
    this.addText('right-bottom', 1, '...')

    // --------------------
    // load fonts
    // --------------------
    // fontFamily: '"Press Start 2P"' . It must enclose with DOUBLE QUOTATION because includes WHITE SPACE in Font name.
    this.load.addFile(new WebFontFile(this.load, 'Press Start 2P'))
    // fontFamily: 'DotGothic16'
    this.load.addFile(new WebFontFile(this.load, 'DotGothic16'))

    // --------------------
    // load common images
    // --------------------
    let path = '../../assets/img'
    this.load.image('title', `${path}/title.png`)

    // --------------------
    // load common audios
    // --------------------
    path = '../../assets/sfx/kenney_interfacesounds/Audio'
    this.load.audio('next', `${path}/confirmation_002.ogg`)

    console.log(`${this.CLASS_NAME}#${FUNC_NAME} [FINISHED]`)
  }

  /**
   *
   */
  create(data) {
    const FUNC_NAME = 'create'
    console.log(`${this.CLASS_NAME}#${FUNC_NAME} [START]`, data)

    this.sceneTo('title')

    console.log(`${this.CLASS_NAME}#${FUNC_NAME} [FINISHED]`)
  }
}
