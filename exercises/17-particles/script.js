import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/Addons.js"
import { Timer } from "three/addons/misc/Timer.js"
import GUI from "lil-gui"
import Stats from "stats.js"

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

const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.1, 100)
camera.position.set(-2, 4, 8)
scene.add(camera)

const controls = new OrbitControls(camera, canvas)
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
const particleTexture = textureLoader.load("/textures/particles/8.png")

/**
 * Particles
 */
// Geometry
const particlesGeometry = new THREE.BufferGeometry()

// Create 500 sets of random xyz coordinates for the particles
const count = 5_000
const positions = new Float32Array(count * 3)
const colors = new Float32Array(count * 3)
for (let i = 0; i < count * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 100
  colors[i] = Math.random()
}
particlesGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
particlesGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3))

// Material
const particlesMaterial = new THREE.PointsMaterial()
particlesMaterial.size = 1
// particlesMaterial.sizeAttenuation = true
particlesMaterial.transparent = true
particlesMaterial.alphaMap = particleTexture
particlesMaterial.map = particleTexture
// particlesMaterial.alphaTest = 0.001
// particlesMaterial.depthTest = false
particlesMaterial.depthWrite = false
// particlesMaterial.blending = THREE.AdditiveBlending

// Allow colors
particlesMaterial.vertexColors = true

// Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)

/**
 * Render
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

const timer = new Timer()

const tick = () => {
  stats.begin()

  // Timer
  timer.update()
  const elapsedTime = timer.getElapsed()

  // Update particles
  // Rotate all particles
  // particles.position.y = elapsedTime * 0.1

  // Move individual particles
  for (let i = 0; i < count; i++) {
    let i3 = i * 3

    const x = particlesGeometry.attributes.position.array[i3]
    particlesGeometry.attributes.position.array[i3 + 1] = Math.sin(elapsedTime + x * 2) * 5
  }
  particlesGeometry.attributes.position.needsUpdate = true

  // Update controls
  controls.update()

  renderer.render(scene, camera)

  stats.end()

  window.requestAnimationFrame(tick)
}
tick()
