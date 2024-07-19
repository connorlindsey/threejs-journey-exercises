import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/Addons.js"
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js"
import GUI from "lil-gui"

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
  rotate: true,
}
gui.add(dbg, "rotate").name("Rotate")
// gui.hide()
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

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

const doorColorTxt = textureLoader.load("../../static/textures/door/color.jpg")
doorColorTxt.colorSpace = THREE.SRGBColorSpace
const doorAlphaTxt = textureLoader.load("../../static/textures/door/alpha.jpg")
const doorOcclusionTxt = textureLoader.load("../../static/textures/door/ambientOcclusion.jpg")
const doorHeightTxt = textureLoader.load("../../static/textures/door/height.jpg")
const doorMetalTxt = textureLoader.load("../../static/textures/door/metalness.jpg")
const doorRoughTxt = textureLoader.load("../../static/textures/door/roughness.jpg")
const doorNormalTxt = textureLoader.load("../../static/textures/door/normal.jpg")
const matcapTxt = textureLoader.load("../../static/textures/matcaps/8.png")
matcapTxt.colorSpace = THREE.SRGBColorSpace
const gradientTxt = textureLoader.load("../../static/textures/gradients/3.jpg")

/**
 * Environment map
 */
const rgbeLoader = new RGBELoader()
rgbeLoader.load("../../static/textures/environmentMap/2k.hdr", (environmentMap) => {
  environmentMap.mapping = THREE.EquirectangularReflectionMapping

  scene.background = environmentMap
  scene.environment = environmentMap
})

/**
 * ! Meshes
 */
const sphere = new THREE.SphereGeometry(1, 64, 64)
const plane = new THREE.PlaneGeometry(2, 2, 100, 100)
const torus = new THREE.TorusGeometry(1, 0.25, 64, 128)

/**
 * ! Materials
 */
// Basic material
// let material = new THREE.MeshBasicMaterial({ map: doorColorTxt })

// Normal
// let material = new THREE.MeshNormalMaterial({ map: doorColorTxt })

// Maptcap
// let material = new THREE.MeshMatcapMaterial({ matcap: matcapTxt })

// Lambert
// let material = new THREE.MeshLambertMaterial({ map: doorColorTxt })

// Phong
// let material = new THREE.MeshPhongMaterial({ map: doorColorTxt, shininess: 100, specular: 0x0fffff })

// Toon
// let material = new THREE.MeshToonMaterial()
// gradientTxt.generateMipmaps = false
// gradientTxt.magFilter = THREE.NearestFilter
// material.gradientMap = gradientTxt

// Standard
let material = new THREE.MeshStandardMaterial()
material.metalness = 0.45
gui.add(material, "metalness").min(0).max(1).step(0.01)
material.roughness = 0.65
gui.add(material, "roughness").min(0).max(1).step(0.01)
material.map = doorColorTxt

// Ambient occlusion
material.aoMap = doorOcclusionTxt
material.aoMapIntensity = 1
gui.add(material, "aoMapIntensity").min(0).max(5).step(0.001)

// Height map
material.displacementMap = doorHeightTxt
material.displacementScale = 0.05
gui.add(material, "displacementScale").min(0).max(1).step(0.001)

material.metalnessMap = doorMetalTxt
material.roughnessMap = doorRoughTxt

material.normalMap = doorNormalTxt

material.side = THREE.DoubleSide
const sphereMesh = new THREE.Mesh(sphere, material)
sphereMesh.position.x = -3
const planeMesh = new THREE.Mesh(plane, material)
const torusMesh = new THREE.Mesh(torus, material)
torusMesh.position.x = 3
scene.add(sphereMesh, planeMesh, torusMesh)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 1)
scene.add(ambientLight)

const pointLight = new THREE.PointLight(0xffffff, 30)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)
/**
 * Camera
 */
// Sizes
let sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

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

// Camera
const fov = 45
const aspectRatio = sizes.width / sizes.height
const near = 0.1
const far = 100
const camera = new THREE.PerspectiveCamera(fov, aspectRatio, near, far)
camera.position.set(1, 4, 8)
scene.add(camera)

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)

// Clock
const clock = new THREE.Clock()

const tick = () => {
  const delta = clock.getDelta()

  if (dbg.rotate) {
    sphereMesh.rotation.x -= 0.33 * delta
    sphereMesh.rotation.y += 0.33 * delta
    planeMesh.rotation.x -= 0.33 * delta
    planeMesh.rotation.y += 0.33 * delta
    torusMesh.rotation.x -= 0.33 * delta
    torusMesh.rotation.y += 0.33 * delta
  }

  controls.update()

  // Render
  renderer.render(scene, camera)

  window.requestAnimationFrame(tick)
}
tick()
