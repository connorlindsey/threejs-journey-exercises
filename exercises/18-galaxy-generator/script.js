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

/**
 * Galaxy
 */
const params = {}
params.count = 100_000
params.size = 0.01
params.radius = 5
params.branches = 3
params.spin = 1
params.randomness = 0.2
params.randomnessPower = 3
params.insideColor = "#ff6030"
params.outsideColor = "#1b3984"

let geometry = undefined
let material = undefined
let particles = undefined
const generateGalaxy = () => {
  /**
   * Clean up
   */
  if (geometry !== undefined) geometry.dispose()
  if (material !== undefined) material.dispose()
  if (particles !== undefined) scene.remove(particles)

  /**
   * Geometry
   */
  geometry = new THREE.BufferGeometry()

  const positions = new Float32Array(params.count * 3)
  const colors = new Float32Array(params.count * 3)
  for (let i = 0; i < params.count; i++) {
    const i3 = i * 3

    // Random in a box
    // positions[i3 + 0] = (Math.random() - 0.5) * 3
    // positions[i3 + 1] = (Math.random() - 0.5) * 3
    // positions[i3 + 2] = (Math.random() - 0.5) * 3

    // Spiral

    const radius = Math.random() * params.radius
    const spinAngle = radius * params.spin
    const branchAngle = ((i % params.branches) / params.branches) * Math.PI * 2

    const randX =
      Math.pow(Math.random(), params.randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1) *
      params.randomness *
      radius
    const randY =
      Math.pow(Math.random(), params.randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1) *
      params.randomness *
      radius
    const randZ =
      Math.pow(Math.random(), params.randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1) *
      params.randomness *
      radius

    positions[i3 + 0] = Math.cos(branchAngle + spinAngle) * radius + randX
    positions[i3 + 1] = randY
    positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randZ

    // Set colors
    const colorInside = new THREE.Color(params.insideColor)
    const colorOutside = new THREE.Color(params.outsideColor)

    const mixedColor = colorInside.clone()
    mixedColor.lerp(colorOutside, radius / params.radius)
    colors[i3 + 0] = mixedColor.r
    colors[i3 + 1] = mixedColor.g
    colors[i3 + 2] = mixedColor.b
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3))

  /**
   * Material
   */
  material = new THREE.PointsMaterial({
    size: params.size,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
  })

  /**
   * Mesh
   */
  particles = new THREE.Points(geometry, material)
  scene.add(particles)
}
generateGalaxy()

gui.add(params, "count").min(100).max(100000).step(100).onFinishChange(generateGalaxy)
gui.add(params, "size").min(0.001).max(0.1).step(0.001).onFinishChange(generateGalaxy)
gui.add(params, "radius").min(0.01).max(20).step(0.01).onFinishChange(generateGalaxy)
gui.add(params, "branches").min(2).max(20).step(1).onFinishChange(generateGalaxy)
gui.add(params, "spin").min(-5).max(5).step(0.001).onFinishChange(generateGalaxy)
gui.add(params, "randomness").min(0).max(2).step(0.001).onFinishChange(generateGalaxy)
gui.add(params, "randomnessPower").min(1).max(10).step(0.001).onFinishChange(generateGalaxy)
gui.addColor(params, "insideColor").onFinishChange(generateGalaxy)
gui.addColor(params, "outsideColor").onFinishChange(generateGalaxy)

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

  // Update controls
  controls.update()

  renderer.render(scene, camera)

  stats.end()

  window.requestAnimationFrame(tick)
}
tick()
