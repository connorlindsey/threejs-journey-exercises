import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/Addons.js"
import GUI from "lil-gui"
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js"
import { TextGeometry } from "three/addons/geometries/TextGeometry.js"

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

const fov = 45
const aspectRatio = sizes.width / sizes.height
const near = 0.1
const far = 100
const camera = new THREE.PerspectiveCamera(fov, aspectRatio, near, far)
camera.position.set(2, -0.5, 5)
scene.add(camera)

const controls = new OrbitControls(camera, canvas)
controls.maxDistance = 20
controls.minDistance = 5
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
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

const matcap = textureLoader.load("/textures/matcaps/matcap_blue.jpg")
matcap.colorSpace = THREE.SRGBColorSpace

/**
 * Meshes
 */

const material = new THREE.MeshMatcapMaterial({ matcap: matcap })
const fontLoader = new FontLoader()
fontLoader.load("/fonts/Space Mono_Bold.json", (font) => {
  const textGeometry = new TextGeometry("Hello Three.js", {
    font: font,
    size: 0.5,
    depth: 0.2,
    curveSegments: 5,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 4,
  })

  textGeometry.center()

  const text = new THREE.Mesh(textGeometry, material)
  scene.add(text)
})

const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45)
const minDistance = 1
const maxDistance = 10
for (let i = 0; i < 500; i++) {
  const donut = new THREE.Mesh(donutGeometry, material)
  donut.position.x = Math.max(Math.random() * maxDistance, minDistance) * (Math.random() > 0.5 ? 1 : -1)
  donut.position.y = Math.max(Math.random() * maxDistance, minDistance) * (Math.random() > 0.5 ? 1 : -1)
  donut.position.z = Math.max(Math.random() * maxDistance, minDistance) * (Math.random() > 0.5 ? 1 : -1)
  donut.rotation.x = Math.random() * Math.PI
  donut.rotation.y = Math.random() * Math.PI
  const scale = Math.random()
  donut.scale.set(scale, scale, scale)
  scene.add(donut)
}

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
 * Render
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)

const tick = () => {
  controls.update()
  renderer.render(scene, camera)
  window.requestAnimationFrame(tick)
}
tick()
