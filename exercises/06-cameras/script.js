import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/Addons.js"

// Canvas
const canvas = document.querySelector("canvas.webgl")

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color(0xf5f5f5)

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshLambertMaterial()
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// Ambient light
const ambientLight = new THREE.AmbientLight(0x040404, 0.5)
scene.add(ambientLight)

const lights = []
lights[0] = new THREE.DirectionalLight(0xff0000, 8)
lights[1] = new THREE.DirectionalLight(0x00ff00, 8)
lights[2] = new THREE.DirectionalLight(0x0000ff, 8)

lights[0].position.set(200, 200, 200)
lights[1].position.set(200, -200, -200)
lights[2].position.set(-200, -200, 200)

scene.add(lights[0])
scene.add(lights[1])
scene.add(lights[2])

// Sizes
const sizes = {
  width: 800,
  height: 600,
}

// ! Camera
// 45 - 75 typically
const fov = 45
const aspectRatio = sizes.width / sizes.height
const near = 0.1
const far = 100
const camera = new THREE.PerspectiveCamera(fov, aspectRatio, near, far)
camera.position.z = 3
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
