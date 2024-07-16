import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/Addons.js"

// Canvas
const canvas = document.querySelector("canvas.webgl")

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color(0xffffff)

// ! Object

// Box
// const geometry = new THREE.BoxGeometry(1, 1, 1, 3, 3, 3)

// Sphere
const geometry = new THREE.SphereGeometry(1, 32, 32)

// Buffer triangle
// const geometry = new THREE.BufferGeometry()
// const positionsArray = new Float32Array([0, 0, 0, 0, 1, 0, 1, 0, 0])
// const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3)
// geometry.setAttribute("position", positionsAttribute)

// Material
const material = new THREE.MeshBasicMaterial({ color: 0xff00ff, wireframe: true })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

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

  mesh.rotation.x += 0.33 * delta
  mesh.rotation.y += 0.33 * delta

  controls.update()

  // Render
  renderer.render(scene, camera)

  window.requestAnimationFrame(tick)
}
tick()
