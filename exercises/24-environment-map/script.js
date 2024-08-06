import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/Addons.js"
import GUI from "lil-gui"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js"

/**
 * Loaders
 */
const gltfLoader = new GLTFLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()
const rgbeLoader = new RGBELoader()

/**
 * Setup
 */
// Debug
const gui = new GUI({
  width: 300,
  title: "Debug",
  closeFolders: true,
})
const dbg = {}

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

const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100)
camera.position.set(4, 13, 15)
scene.add(camera)

const controls = new OrbitControls(camera, canvas)
controls.target.set(0, 0.75, 0)
controls.enableDamping = true

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
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 2.4)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.8)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = -7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = -7
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

const torusKnot = new THREE.Mesh(
  new THREE.TorusKnotGeometry(1, 0.4, 100, 16),
  new THREE.MeshStandardMaterial({
    roughness: 0.3,
    metalness: 1,
    color: 0xaaaaaa,
  }),
)
torusKnot.position.x = -4
torusKnot.position.y = 4
scene.add(torusKnot)

/**
 * Models
 */
gltfLoader.load("/models/FlightHelmet/glTF/FlightHelmet.gltf", (gltf) => {
  gltf.scene.scale.set(10, 10, 10)
  scene.add(gltf.scene)
})

/**
 * Environment map
 */
//  LDR Cube texture
// const environmentMap = cubeTextureLoader.load([
//   "/textures/environmentMaps/1/px.png",
//   "/textures/environmentMaps/1/nx.png",
//   "/textures/environmentMaps/1/py.png",
//   "/textures/environmentMaps/1/ny.png",
//   "/textures/environmentMaps/1/pz.png",
//   "/textures/environmentMaps/1/nz.png",
// ])
// scene.environment = environmentMap
// scene.background = environmentMap

// HDR
rgbeLoader.load("/textures/environmentMaps/blender-2k.hdr", (texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping
  scene.environment = texture
  // scene.background = texture

  // const skybox = new GroundedSkybox(environmentMap, 15, 70)
  // scene.add(skybox)
})

scene.environmentIntensity = 1
gui.add(scene, "environmentIntensity").min(0).max(10).step(0.001)

scene.backgroundBlurriness = 0
gui.add(scene, "backgroundBlurriness").min(0).max(1).step(0.001)

scene.backgroundIntensity = 1
gui.add(scene, "backgroundIntensity").min(0).max(10).step(0.001)

gui
  .add(scene.backgroundRotation, "y")
  .min(0)
  .max(Math.PI * 2)
  .step(0.001)
  .name("backgroundRotationY")
gui
  .add(scene.environmentRotation, "y")
  .min(0)
  .max(Math.PI * 2)
  .step(0.001)
  .name("environmentRotationY")

scene.environmentRotation.x = 1

/**
 * Render
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () => {
  const elapsedTime = clock.getElapsedTime()
  const deltaTime = elapsedTime - previousTime
  previousTime = elapsedTime

  // Update controls
  controls.update()

  renderer.render(scene, camera)

  window.requestAnimationFrame(tick)
}
tick()
