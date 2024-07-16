import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/Addons.js"

// Canvas
const canvas = document.querySelector("canvas.webgl")

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x0a0a0a)

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshLambertMaterial()
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// Ambient light
const ambientLight = new THREE.AmbientLight(0x040404, 0.4)
scene.add(ambientLight)

// RGB directonal lights
const lights = []
lights[0] = new THREE.DirectionalLight(0xff0000, 4)
lights[1] = new THREE.DirectionalLight(0x00ff00, 4)
lights[2] = new THREE.DirectionalLight(0x0000ff, 4)

lights[0].position.set(200, 200, 200)
lights[1].position.set(200, -200, -200)
lights[2].position.set(-200, -200, 200)

scene.add(lights[0])
scene.add(lights[1])
scene.add(lights[2])

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
camera.position.z = 8
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

  // mesh.rotation.x += 0.5 * delta

  controls.update()

  // Render
  renderer.render(scene, camera)

  window.requestAnimationFrame(tick)
}
tick()
