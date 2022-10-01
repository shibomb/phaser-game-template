import GameConfig from '../config/GameConfig.js'
import AbstractScene from './AbstractScene.js'

const PREFIX = 'CreditScene'

export default class CreditScene extends AbstractScene {
  /**
   *
   */
  constructor() {
    const FUNC_NAME = 'constructor'
    console.log(`${PREFIX}#${FUNC_NAME} [START]`)

    super('credit')

    console.log(`${this.CLASS_NAME}#${FUNC_NAME} [FINISHED]`)
  }

  /**
   *
   */
  create(data) {
    const FUNC_NAME = 'create'
    console.log(`${this.CLASS_NAME}#${FUNC_NAME} [START]`, data)

    let row = 1

    // back
    const backOption = {
      hitKey: 'keydown-ESC',
      clickable: true,
      callback: () => {
        this.sceneTo('title')
      },
    }
    this.addText('left', row++, '<<[ESC]', {}, backOption)

    // credits
    row = 5
    const credits = [
      { title: 'PRODUCER', list: ['shibomb'] },
      { title: 'DIRECTOR', list: ['shibomb'] },
      { title: 'PLANNER', list: ['shibomb'] },
      { title: 'SCENARIO', list: ['shibomb'] },
      { title: 'GRAPHIC DESIGN', list: ['shibomb'] },
      { title: 'MUSIC COMPOSE', list: ['shibomb'] },
      { title: 'PROGRAM', list: ['shibomb', 'shibomb', 'shibomb'] },
      { title: '', list: [''] },
      { title: 'SPECIAL THANKS', list: ['MY FRIENDS', 'MY FAMILY'] },
      { title: '', list: [''] },
      { title: 'POWERED BY', list: ['PHASER.IO', 'KENNY.NL'] },
    ]

    for (let i = 0; i < credits.length; i++) {
      const part = credits[i]
      this.addText('center-left', row, part.title, { color: '#666' })

      for (let j = 0; j < part.list.length; j++) {
        const name = part.list[j]
        this.addText('center-right', row++, name)
      }
    }
    row += 2

    // copyright
    this.addText('center-bottom', 2, GameConfig.copyright)
    this.addText('center-bottom', 1, 'ALL RIGHTS RESERVED.')

    this.sceneIn()
    console.log(`${this.CLASS_NAME}#${FUNC_NAME} [FINISHED]`)
  }
}
