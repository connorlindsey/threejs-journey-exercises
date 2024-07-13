import * as THREE from "three"
import gsap from "gsap"

// Canvas
const canvas = document.querySelector("canvas.webgl")

// Scene
const scene = new THREE.Scene()

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshLambertMaterial({ color: 0xfff000 })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

const light = new THREE.PointLight(0xff0000, 1, 100)
light.position.set(50, 50, 50)
scene.add(light)

// Sizes
const sizes = {
  width: 800,
  height: 600,
}

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)

// let time = Date.now()

// Clock
const clock = new THREE.Clock()

// GSAP already call requestAnimationFrame
gsap.to(mesh.position, { duration: 1, delay: 1, x: 2 })

const tick = () => {
  // Time
  //   const currentTime = Date.now()
  //   const delta = currentTime - time
  //   time = currentTime

  //   const delta = clock.getDelta()
  //   console.log(delta)

  // Update object
  //   mesh.rotation.y += 1.1 * delta
  //   mesh.position.y = Math.sin(clock.elapsedTime)

  // Render
  renderer.render(scene, camera)

  window.requestAnimationFrame(tick)
}
tick()
