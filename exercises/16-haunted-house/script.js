import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/Addons.js"
import { Timer } from "three/addons/misc/Timer.js"
import GUI from "lil-gui"
import Stats from "stats.js"
import { Sky } from "three/addons/objects/Sky.js"

const stats = new Stats()
stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom)

/**
 * Setup
 */
// Debug
const gui = new GUI({
  width: 300,
  title: "Debug",
  closeFolders: true,
})
const dbg = {
  statsPanel: 0,
}
// Toggle stats UI
gui
  .add(
    {
      show: () => {
        let val = dbg.statsPanel === 0 ? 4 : 0
        stats.showPanel(val)
        dbg.statsPanel = val
      },
    },
    "show",
  )
  .name("Toggle stats")

window.addEventListener("keydown", (event) => {
  if (event.key === "h") {
    gui.show(gui._hidden)
  }
})

// Canvas
const canvas = document.querySelector("canvas.webgl")

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x000000)

// Camera
let sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

const fov = 45
const aspectRatio = sizes.width / sizes.height
const near = 0.1
const far = 100
const camera = new THREE.PerspectiveCamera(fov, aspectRatio, near, far)
camera.position.set(-2, 4, 8)
scene.add(camera)

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.maxPolarAngle = Math.PI / 2 - 0.1
controls.minDistance = 4
controls.maxDistance = 18

// Handle resizing
window.addEventListener("resize", () => {
  sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  }

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  // Adjust pixel ratio for higher res displays, cap at 2x
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// Double click to toggle fullscreen
window.addEventListener("dblclick", () => {
  const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement

  if (!fullscreenElement) {
    if (canvas.requestFullscreen) {
      canvas.requestFullscreen()
    } else if (canvas.webkitRequestFullscreen) {
      canvas.webkitRequestFullscreen()
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen()
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen()
    }
  }
})

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

// Floor
const floorAlphaTexture = textureLoader.load("/textures/16-haunted-house/floor/alpha.webp")

const floorColorTexture = textureLoader.load(
  "/textures/16-haunted-house/floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_diff_1k.webp",
)
floorColorTexture.repeat.set(8, 8)
floorColorTexture.wrapS = THREE.RepeatWrapping
floorColorTexture.wrapT = THREE.RepeatWrapping
floorColorTexture.colorSpace = THREE.SRGBColorSpace

const floorARMTexture = textureLoader.load(
  "/textures/16-haunted-house/floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_arm_1k.webp",
)
floorARMTexture.wrapS = THREE.RepeatWrapping
floorARMTexture.wrapT = THREE.RepeatWrapping

const floorNormalTexture = textureLoader.load(
  "/textures/16-haunted-house/floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_nor_gl_1k.webp",
)
floorNormalTexture.wrapS = THREE.RepeatWrapping
floorNormalTexture.wrapT = THREE.RepeatWrapping

const floorDisplacementTexture = textureLoader.load(
  "/textures/16-haunted-house/floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_disp_1k.webp",
)
floorDisplacementTexture.wrapS = THREE.RepeatWrapping
floorDisplacementTexture.wrapT = THREE.RepeatWrapping

// Walls
const wallColorTexture = textureLoader.load(
  "/textures/16-haunted-house/wall/castle_brick_broken_06_1k/castle_brick_broken_06_diff_1k.webp",
)
wallColorTexture.colorSpace = THREE.SRGBColorSpace

const wallARMTexture = textureLoader.load(
  "/textures/16-haunted-house/wall/castle_brick_broken_06_1k/castle_brick_broken_06_arm_1k.webp",
)

const wallNormalTexture = textureLoader.load(
  "/textures/16-haunted-house/wall/castle_brick_broken_06_1k/castle_brick_broken_06_nor_gl_1k.webp",
)

// Roof
const roofColorTexture = textureLoader.load(
  "/textures/16-haunted-house/roof/roof_slates_02_1k/roof_slates_02_diff_1k.webp",
)
roofColorTexture.repeat.set(3, 1)
roofColorTexture.wrapS = THREE.RepeatWrapping
roofColorTexture.colorSpace = THREE.SRGBColorSpace

const roofARMTexture = textureLoader.load(
  "/textures/16-haunted-house/roof/roof_slates_02_1k/roof_slates_02_arm_1k.webp",
)
roofARMTexture.repeat.set(3, 1)
roofARMTexture.wrapS = THREE.RepeatWrapping

const roofNormalTexture = textureLoader.load(
  "/textures/16-haunted-house/roof/roof_slates_02_1k/roof_slates_02_nor_gl_1k.webp",
)
roofNormalTexture.repeat.set(3, 1)
roofNormalTexture.wrapS = THREE.RepeatWrapping

// Bushs
const bushColorTexture = textureLoader.load(
  "/textures/16-haunted-house/bush/leaves_forest_ground_1k/leaves_forest_ground_diff_1k.webp",
)
bushColorTexture.colorSpace = THREE.SRGBColorSpace

const bushARMTexture = textureLoader.load(
  "/textures/16-haunted-house/bush/leaves_forest_ground_1k/leaves_forest_ground_arm_1k.webp",
)

const bushNormalTexture = textureLoader.load(
  "/textures/16-haunted-house/bush/leaves_forest_ground_1k/leaves_forest_ground_nor_gl_1k.webp",
)

// Graves
const graveColorTexture = textureLoader.load(
  "/textures/16-haunted-house/grave/plastered_stone_wall_1k/plastered_stone_wall_diff_1k.webp",
)
graveColorTexture.colorSpace = THREE.SRGBColorSpace

const graveARMTexture = textureLoader.load(
  "/textures/16-haunted-house/grave/plastered_stone_wall_1k/plastered_stone_wall_arm_1k.webp",
)

const graveNormalTexture = textureLoader.load(
  "/textures/16-haunted-house/wall/plastered_stone_wall_1k/plastered_stone_wall_nor_gl_1k.webp",
)

// Door

const doorColorTexture = textureLoader.load("/textures/door/color.jpg")
doorColorTexture.colorSpace = THREE.SRGBColorSpace
const doorAlphaTexture = textureLoader.load("/textures/door/alpha.jpg")
const doorAmbientOcclusionTexture = textureLoader.load("/textures/door/ambientOcclusion.jpg")
const doorHeightTexture = textureLoader.load("/textures/door/height.jpg")
const doorMetalTexture = textureLoader.load("/textures/door/metalness.jpg")
const doorRoughTexture = textureLoader.load("/textures/door/roughness.jpg")
const doorNormalTexture = textureLoader.load("/textures/door/normal.jpg")

/**
 * ! House
 */
const house = new THREE.Group()
scene.add(house)

// Walls
const walls = new THREE.Mesh(
  new THREE.BoxGeometry(4, 2.5, 4),
  new THREE.MeshStandardMaterial({
    map: wallColorTexture,
    aoMap: wallARMTexture,
    roughnessMap: wallARMTexture,
    metalnessMap: wallARMTexture,
    normalMap: wallNormalTexture,
  }),
)
walls.position.y = 2.5 / 2
house.add(walls)

// Roof
const roof = new THREE.Mesh(
  new THREE.ConeGeometry(3.5, 1.5, 4),
  new THREE.MeshStandardMaterial({
    map: roofColorTexture,
    aoMap: roofARMTexture,
    roughnessMap: roofARMTexture,
    metalnessMap: roofARMTexture,
    normalMap: roofNormalTexture,
  }),
)
roof.position.y = 2.5 + 1.5 / 2
roof.rotation.y = Math.PI * 0.25
house.add(roof)

// Door
const door = new THREE.Mesh(
  new THREE.PlaneGeometry(2.2, 2.2, 100, 100),
  new THREE.MeshStandardMaterial({
    map: doorColorTexture,
    alphaMap: doorAlphaTexture,
    transparent: true,
    aoMap: doorAmbientOcclusionTexture,
    displacementMap: doorHeightTexture,
    metalnessMap: doorMetalTexture,
    roughnessMap: doorRoughTexture,
    normalMap: doorNormalTexture,
    displacementScale: 0.15,
    displacementBias: -0.04,
  }),
)
door.position.set(0, 1, 2.01)
house.add(door)

// Bushes
const bushGeometry = new THREE.SphereGeometry(1, 16, 16)
const bushMaterial = new THREE.MeshStandardMaterial({
  color: "#ccffcc",
  map: bushColorTexture,
  aoMap: bushARMTexture,
  roughnessMap: bushARMTexture,
  metalnessMap: bushARMTexture,
  normalMap: bushNormalTexture,
})

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial)
bush1.scale.setScalar(0.5)
bush1.position.set(1, 0.2, 2.2)
house.add(bush1)
bush1.rotation.x = -0.75

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial)
bush2.scale.setScalar(0.25)
bush2.position.set(1.6, 0.1, 2.1)
house.add(bush2)
bush2.rotation.x = -0.75

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial)
bush3.scale.setScalar(0.4)
bush3.position.set(-1, 0.1, 2.2)
house.add(bush3)
bush3.rotation.x = -0.75

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial)
bush4.scale.setScalar(0.25)
bush4.position.set(-1.2, 0.05, 2.6)
house.add(bush4)
bush4.rotation.x = -0.75

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20, 100, 100),
  new THREE.MeshStandardMaterial({
    alphaMap: floorAlphaTexture,
    transparent: true,
    map: floorColorTexture,
    aoMap: floorARMTexture,
    roughnessMap: floorARMTexture,
    metalnessMap: floorARMTexture,
    normalMap: floorNormalTexture,
    displacementMap: floorDisplacementTexture,
    displacementScale: 0.3,
    displacementBias: -0.2,
  }),
)
gui.add(floor.material, "displacementScale").min(0).max(1).step(0.001).name("Displacement scale")
gui.add(floor.material, "displacementBias").min(-1).max(1).step(0.001).name("Displacement bias")
floor.rotation.x = -Math.PI * 0.5
scene.add(floor)

// Graves
const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2)
const graveMaterial = new THREE.MeshStandardMaterial({
  map: graveColorTexture,
  aoMap: graveARMTexture,
  roughnessMap: graveARMTexture,
  metalnessMap: graveARMTexture,
  normalMap: graveNormalTexture,
})
const graves = new THREE.Group()
scene.add(graves)

for (let i = 0; i < 30; i++) {
  const grave = new THREE.Mesh(graveGeometry, graveMaterial)

  // place grave
  const angle = Math.random() * Math.PI * 2
  const distance = Math.random() * 7 + 3.5
  const x = Math.sin(angle) * distance
  const z = Math.cos(angle) * distance
  grave.position.set(x, Math.random() * 0.4, z)

  grave.rotation.x = (Math.random() - 0.5) * 0.4
  grave.rotation.y = (Math.random() - 0.5) * 0.4
  grave.rotation.z = (Math.random() - 0.5) * 0.4

  graves.add(grave)
}

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight("#86cdff", 0.275)
scene.add(ambientLight)

// Directional light
const directionalLight = new THREE.DirectionalLight("#86cdff", 1)
directionalLight.position.set(3, 2, -8)
scene.add(directionalLight)

// Door light
const doorLight = new THREE.PointLight("#ff7d46", 5)
doorLight.position.set(0, 2.2, 2.5)
scene.add(doorLight)

// Ghosts
const ghost1 = new THREE.PointLight("#8800ff", 6)
const ghost2 = new THREE.PointLight("#ff0088", 6)
const ghost3 = new THREE.PointLight("#ff0000", 6)
scene.add(ghost1, ghost2, ghost3)

// Shadows
directionalLight.castShadow = true
ghost1.castShadow = true
ghost2.castShadow = true
ghost3.castShadow = true
walls.castShadow = true
walls.receiveShadow = true
roof.castShadow = true
floor.receiveShadow = true
for (const grave of graves.children) {
  grave.castShadow = true
  grave.receiveShadow = true
}

// Mappings
directionalLight.shadow.mapSize.width = 256
directionalLight.shadow.mapSize.height = 256
directionalLight.shadow.camera.top = 8
directionalLight.shadow.camera.right = 8
directionalLight.shadow.camera.bottom = -8
directionalLight.shadow.camera.left = -8
directionalLight.shadow.camera.near = 1
directionalLight.shadow.camera.far = 20

ghost1.shadow.mapSize.width = 256
ghost1.shadow.mapSize.height = 256
ghost1.shadow.camera.far = 10

ghost2.shadow.mapSize.width = 256
ghost2.shadow.mapSize.height = 256
ghost2.shadow.camera.far = 10

ghost3.shadow.mapSize.width = 256
ghost3.shadow.mapSize.height = 256
ghost3.shadow.camera.far = 10

/**
 * Sky
 */
const sky = new Sky()
sky.scale.set(100, 100, 100)
sky.material.uniforms["turbidity"].value = 10
sky.material.uniforms["rayleigh"].value = 3
sky.material.uniforms["mieCoefficient"].value = 0.1
sky.material.uniforms["mieDirectionalG"].value = 0.95
sky.material.uniforms["sunPosition"].value.set(0.3, -0.038, -0.95)
scene.add(sky)

/**
 * Fog
 */
scene.fog = new THREE.Fog("#04343f", 1, 22)
// scene.fog = new THREE.FogExp2("#04343f", 0.05)

/**
 * Render
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

const timer = new Timer()

const tick = () => {
  stats.begin()

  // Timer
  timer.update()
  const elapsedTime = timer.getElapsed()

  controls.update()

  // Ghosts
  const ghost1Angle = elapsedTime * 0.5
  ghost1.position.x = Math.cos(ghost1Angle) * 4
  ghost1.position.z = Math.sin(ghost1Angle) * 4
  ghost1.position.y = Math.sin(ghost1Angle) * Math.sin(ghost1Angle * 2.34) * Math.sin(ghost1Angle * 3.45)

  const ghost2Angle = -elapsedTime * 0.38 + 8
  ghost2.position.x = Math.cos(ghost2Angle) * 5
  ghost2.position.z = Math.sin(ghost2Angle) * 5
  ghost2.position.y = Math.sin(ghost2Angle) * Math.sin(ghost2Angle * 2.34) * Math.sin(ghost2Angle * 3.45)

  const ghost3Angle = elapsedTime * 0.23 - 3
  ghost3.position.x = Math.cos(ghost3Angle) * 6
  ghost3.position.z = Math.sin(ghost3Angle) * 6
  ghost3.position.y = Math.sin(ghost3Angle) * Math.sin(ghost3Angle * 2.34) * Math.sin(ghost3Angle * 3.45)

  renderer.render(scene, camera)
  stats.end()
  window.requestAnimationFrame(tick)
}
tick()
