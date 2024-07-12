import * as THREE from "three"

console.log(THREE)

// Canvas
const canvas = document.querySelector("canvas.webgl")

// Scene
const scene = new THREE.Scene()

// Grouped object
const group = new THREE.Group()
scene.add(group)

const cube1 = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ color: 0xff0000 }))
cube1.position.x = -2
group.add(cube1)

const cube2 = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ color: 0x00ff00 }))
group.add(cube2)

const cube3 = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ color: 0x0000ff }))
cube3.position.x = 2
group.add(cube3)

group.rotateY(Math.PI / 2)

// Axes helper
const axesHelper = new THREE.AxesHelper()
scene.add(axesHelper)

// Sizes
const sizes = {
  width: 800,
  height: 600,
}

// Camera
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height)
camera.position.z = 6
camera.position.x = 3
camera.position.y = 2
camera.lookAt(group.position)
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
})
renderer.setSize(sizes.width, sizes.height)

renderer.render(scene, camera)
