import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/Addons.js"
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
  rotate: true,
}
gui.add(dbg, "rotate").name("Rotate?")

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

const material = new THREE.MeshStandardMaterial()
material.roughness = 0.4
gui.add(material, "roughness").min(0).max(1).step(0.01).name("Roughness")

const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 64, 64), material)
sphere.castShadow = true
sphere.position.x = -2
const box = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material)
box.castShadow = true
const torus = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.25, 64, 128), material)
torus.castShadow = true
torus.position.x = 2
const plane = new THREE.Mesh(new THREE.PlaneGeometry(10, 10, 100, 100), material)
plane.receiveShadow = true
plane.rotation.x = -Math.PI * 0.5
plane.position.y = -1
scene.add(sphere, box, plane, torus)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)

const directionalLight = new THREE.DirectionalLight(0xffffff, 2)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.width = 1024 * 2
directionalLight.shadow.mapSize.height = 1024 * 2
directionalLight.shadow.camera.near = 1
directionalLight.shadow.camera.far = 8
directionalLight.shadow.camera.left = -2
directionalLight.shadow.camera.right = 2
directionalLight.shadow.camera.top = 2
directionalLight.shadow.camera.bottom = -2
directionalLight.position.set(2, 2, -1)

const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
scene.add(directionalLightCameraHelper)

scene.add(ambientLight, directionalLight)

const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.2)
scene.add(directionalLightHelper)

/**
 * Render
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)

const tick = () => {
  stats.begin()
  controls.update()

  // Rotate each object
  if (dbg.rotate) {
    ;[sphere, box, torus].forEach((obj) => {
      obj.rotation.y += 0.01
      obj.rotation.z += 0.01
    })
  }
  renderer.render(scene, camera)
  stats.end()
  window.requestAnimationFrame(tick)
}
tick()
