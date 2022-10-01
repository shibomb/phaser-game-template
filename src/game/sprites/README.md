# SAMPLE: preload(scene) and preloadFinished(scene) functions will be called on scene's preload method.

If you use `load.image` in preload, Animation frame array must be created with `{key: [image_filename]} array`.  
If you use `loadTextureAtlas` in scene, Animation frame array must be created with `{key: [texrures_name], frame: [image_filename]}`.  
See this sample.

```javascript
const PREFIX = 'Player'

export function preload(scene) {
  const FUNC_NAME = 'preload'
  console.log(`${PREFIX}#${FUNC_NAME} [START]`)

  // load files
  const path = '../../assets/img/kenney_simplifiedplatformer/PNG/Characters'
  scene.load.image(`${PREFIX}_idle1`, `${path}/platformChar_idle.png`)
  scene.load.image(`${PREFIX}_idle2`, `${path}/platformChar_happy.png`)
  scene.load.image(`${PREFIX}_move1`, `${path}/platformChar_walk1.png`)
  scene.load.image(`${PREFIX}_move2`, `${path}/platformChar_walk2.png`)
  scene.load.image(`${PREFIX}_jump1`, `${path}/platformChar_jump.png`)

  // or

  // load texture atlas at Scene
  let path = '../../assets/img/jumperpack_kenney/Spritesheets'
  this.load.atlasXML(
    'spritesheet_jumper',
    `${path}/spritesheet_jumper.png`,
    `${path}/spritesheet_jumper.xml`
  )

  console.log(`${PREFIX}#${FUNC_NAME} [FINISHED]`)
}

export function preloadFinished(scene) {
  const FUNC_NAME = 'preloadFinished'
  console.log(`Player#${FUNC_NAME} [START]`)

  scene.anims.create({
    key: `${PREFIX}_idle`,
    // for loaded file
    frames: [{ key: `${PREFIX}_idle1` }, { key: `${PREFIX}_idle2` }],
    // for texture atlas
    frames: [
      { key: 'spritesheet_jumper', frame: 'bunny1_ready.png' },
      { key: 'spritesheet_jumper', frame: 'bunny1_stand.png' },
    ],
    frameRate: 2,
    repeat: -1,
  })

  scene.anims.create({
    key: `${PREFIX}_move`,
    // for loaded file
    frames: [{ key: `${PREFIX}_move1` }, { key: `${PREFIX}_move2` }],
    // for texture atlas
    frames: scene.anims.generateFrameNames('spritesheet_jumper', {
      prefix: 'bunny1_walk',
      suffix: '.png',
      start: 1,
      end: 2,
      zeroPad: 1,
    }),
    frameRate: 8,
    repeat: -1,
  })

  scene.anims.create({
    key: `${PREFIX}_jump`,
    // for loaded file
    frames: [{ key: `${PREFIX}_jump1` }],
    // for texture atlas
    frames: [{ key: 'spritesheet_jumper', frame: 'bunny1_jump.png' }],
    frameRate: 1,
    repeat: -1,
  })

  console.log(`Player#${FUNC_NAME} [FINISHED]`)
}
```
