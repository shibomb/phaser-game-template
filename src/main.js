import Phaser from './lib/phaser.js'

import GameConfig from './config/GameConfig.js'

import LoadingScene from './scenes/LoadingScene.js'
import TitleScene from './scenes/TitleScene.js'
import CreditScene from './scenes/CreditScene.js'
import GameScene from './scenes/GameScene.js'
import GameOverScene from './scenes/GameOverScene.js'

const config = {
  type: Phaser.AUTO,
  width: GameConfig.width,
  height: GameConfig.height,
  parent: 'app',
  scale: {
    autoCenter: Phaser.Scale.CENTER_BOTH,
    mode: Phaser.Scale.FIT,
  },
  pixelArt: false,
  scene: [LoadingScene, TitleScene, GameScene, GameOverScene, CreditScene],
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {
        y: 0,
      },
      debug: true,
    },
  },
}

export default new Phaser.Game(config)
