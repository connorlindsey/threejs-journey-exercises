import * as THREE from "three"
import { Timer } from "three/addons/misc/Timer.js"
import GUI from "lil-gui"
import Stats from "stats.js"
import gsap from "gsap"

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
  statsPanel: 4,
}
// Toggle stats UI
const stats = new Stats()
stats.showPanel(dbg.statsPanel) // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom)
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

const parameters = {
  materialColor: "#4ebabc",
  lightColor: "#ffffff",
}

gui.addColor(parameters, "materialColor").onChange(() => {
  material.color.set(parameters.materialColor)
  particlesMaterial.color.set(parameters.materialColor)
})
gui.addColor(parameters, "lightColor").onChange(() => directionalLight.color.set(parameters.lightColor))

// Canvas
const canvas = document.querySelector("canvas.webgl")

// Scene
const scene = new THREE.Scene()

// Camera
let sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

const cameraGroup = new THREE.Group()
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 6
scene.add(cameraGroup)
cameraGroup.add(camera)

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

/**
 * Implementation!
 */
// Texture
const textureLoader = new THREE.TextureLoader()
const gradientMap = textureLoader.load("/textures/gradients/3.jpg")
gradientMap.magFilter = THREE.NearestFilter

// Objects
const material = new THREE.MeshToonMaterial({ color: parameters.materialColor, gradientMap })

const objectDistance = 4
const mesh1 = new THREE.Mesh(new THREE.TorusGeometry(1, 0.4, 16, 60), material)
const mesh2 = new THREE.Mesh(new THREE.ConeGeometry(1, 2, 32), material)
const mesh3 = new THREE.Mesh(new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16), material)

mesh1.position.y = -objectDistance * 0
mesh2.position.y = -objectDistance * 1
mesh3.position.y = -objectDistance * 2

mesh1.position.x = 2
mesh2.position.x = -2
mesh3.position.x = 2

const sectionMeshes = [mesh1, mesh2, mesh3]

scene.add(...sectionMeshes)

/**
 * Particles
 */
// Geometry
const particlesCount = 200
const positions = new Float32Array(particlesCount * 3)

for (let i = 0; i < particlesCount; i++) {
  positions[i * 3 + 0] = (Math.random() - 0.5) * 10
  positions[i * 3 + 1] = objectDistance * 0.5 - Math.random() * objectDistance * sectionMeshes.length
  positions[i * 3 + 2] = (Math.random() - 0.5) * 10
}

const particlesGeometry = new THREE.BufferGeometry()
particlesGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))

// Material
const particlesMaterial = new THREE.PointsMaterial({
  color: parameters.materialColor,
  sizeAttenuation: true,
  size: 0.03,
})

// Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)

// Light
const directionalLight = new THREE.DirectionalLight(0xffffff, 3)
directionalLight.position.set(1, 1, 0)
scene.add(directionalLight)

/**
 * Render
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Scroll
 */
let scrollY = window.scrollY
let currentSection = 0
window.addEventListener("scroll", () => {
  scrollY = window.scrollY
  const newSection = Math.round(scrollY / sizes.height)

  if (newSection != currentSection) {
    currentSection = newSection
    gsap.to(sectionMeshes[currentSection].rotation, {
      duration: 1.5,
      ease: "power2.inOut",
      x: "+=6",
      y: "+=3",
      z: "+=1.5",
    })
  }
})

/**
 * Cursor
 */
const cursor = { x: 0, y: 0 }
window.addEventListener("mousemove", (event) => {
  cursor.x = event.clientX / sizes.width - 0.5
  cursor.y = event.clientY / sizes.height - 0.5
  console.log(cursor)
})

const timer = new Timer()
let prevTime = 0

const tick = () => {
  stats.begin()

  // Timer
  timer.update()
  const elapsedTime = timer.getElapsed()
  const delta = elapsedTime - prevTime
  prevTime = elapsedTime

  // Move camera
  camera.position.y = (-scrollY / sizes.height) * objectDistance

  const parallaxX = cursor.x * 0.4
  const parallaxY = -cursor.y * 0.4
  cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 5 * delta
  cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 5 * delta

  // Animate meshes
  for (const mesh of sectionMeshes) {
    mesh.rotation.y += delta * 0.1
    mesh.rotation.x += delta * 0.08
  }

  renderer.render(scene, camera)

  stats.end()

  window.requestAnimationFrame(tick)
}
tick()
