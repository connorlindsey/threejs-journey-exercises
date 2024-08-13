import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import GUI from "lil-gui"

import testVertexShader from "./shaders/vertex.glsl"
import testFragmentShader from "./shaders/fragment.glsl"

/**
 * Base
 */
// Debug
const gui = new GUI()
const debugObject = {}

// Canvas
const canvas = document.querySelector("canvas.webgl")

// Scene
const scene = new THREE.Scene()

/**
 * Test mesh
 */
// Geometry
const geometry = new THREE.PlaneGeometry(1, 1, 512, 512)

// Color
debugObject.depthColor = "#020822"
debugObject.surfaceColor = "#043f53"

const cGU = gui.addFolder("Color")
cGU
  .addColor(debugObject, "depthColor")
  .name("Depth Color")
  .onChange(() => {
    material.uniforms.uDepthColor.value.set(debugObject.depthColor)
  })
cGU
  .addColor(debugObject, "surfaceColor")
  .name("Surface Color")
  .onChange(() => {
    material.uniforms.uSurfaceColor.value.set(debugObject.surfaceColor)
  })

// Material
const material = new THREE.ShaderMaterial({
  vertexShader: testVertexShader,
  fragmentShader: testFragmentShader,
  side: THREE.DoubleSide,
  uniforms: {
    uTime: { value: 0 },

    uBigWavesElevation: { value: 0.12 },
    uBigWavesFrequency: { value: new THREE.Vector2(8, 3) },
    uBigWavesSpeed: { value: 0.75 },

    uDepthColor: { value: new THREE.Color(debugObject.depthColor) },
    uSurfaceColor: { value: new THREE.Color(debugObject.surfaceColor) },
    uColorOffset: { value: 0.15 },
    uColorMultiplier: { value: 2.55 },

    uSmallWavesElevation: { value: 0.075 },
    uSmallWavesFrequency: { value: 4 },
    uSmallWavesSpeed: { value: 0.05 },
    uSmallIterations: { value: 5 },
  },
})

// Debug
const bGU = gui.addFolder("Big Waves")
bGU.add(material.uniforms.uBigWavesElevation, "value").min(0).max(0.5).step(0.001).name("uBigWavesElevation")
bGU.add(material.uniforms.uBigWavesFrequency.value, "x").min(0).max(10).step(0.01).name("uBigWavesFrequencyX")
bGU.add(material.uniforms.uBigWavesFrequency.value, "y").min(0).max(10).step(0.01).name("uBigWavesFrequencyY")
bGU.add(material.uniforms.uBigWavesSpeed, "value").min(0).max(2).step(0.01).name("uBigWavesSpeed")

cGU.add(material.uniforms.uColorOffset, "value").min(0).max(1).step(0.001).name("uColorOffset")
cGU.add(material.uniforms.uColorMultiplier, "value").min(0).max(10).step(0.001).name("uColorMultiplier")

const sGU = gui.addFolder("Small Waves")
sGU
  .add(material.uniforms.uSmallWavesElevation, "value")
  .min(0)
  .max(1)
  .step(0.001)
  .name("uSmallWavesElevation")
sGU
  .add(material.uniforms.uSmallWavesFrequency, "value")
  .min(0)
  .max(30)
  .step(0.001)
  .name("uSmallWavesFrequency")
sGU.add(material.uniforms.uSmallWavesSpeed, "value").min(0).max(4).step(0.001).name("uSmallWavesSpeed")
sGU.add(material.uniforms.uSmallIterations, "value").min(0).max(5).step(1).name("uSmallIterations")

// Mesh
const mesh = new THREE.Mesh(geometry, material)
mesh.rotation.x = Math.PI * 0.5

scene.add(mesh)

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0.25, 0.75, 0.75)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  // Update material
  material.uniforms.uTime.value = elapsedTime

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()
