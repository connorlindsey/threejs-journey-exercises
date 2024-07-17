import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/Addons.js"
import GUI from "lil-gui"
import gsap from "gsap"

// Debug
const gui = new GUI({
  width: 300,
  title: "Debug",
  closeFolders: true,
})
// gui.hide()
window.addEventListener("keydown", (event) => {
  if (event.key === "h") {
    gui.show(gui._hidden)
  }
})

// Textures
// ! Manual texture loading
// const image = new Image()
// const texture = new THREE.Texture(image) // Creat texture
// texture.colorSpace = THREE.SRGBColorSpace
// image.onload = () => {
//   texture.needsUpdate = true // Update texture after loaded
// }
// image.src = "../../static/textures/door/color.jpg"

// ! Texture loader
const textureLoader = new THREE.TextureLoader()
const texture = textureLoader.load(
  "../../static/textures/door/color.jpg",
  () => {
    console.log("Loading complete")
  },
  () => {
    console.log("Progress")
  },
  () => {
    console.log("Error")
  },
)
texture.colorSpace = THREE.SRGBColorSpace

// ! Loading manager

// Canvas
const canvas = document.querySelector("canvas.webgl")

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color(0xffffff)

// Sphere
const geometry = new THREE.BoxGeometry(3, 3, 3)

console.log(geometry.attributes)

// Material
let material = new THREE.MeshBasicMaterial({ map: texture })
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
