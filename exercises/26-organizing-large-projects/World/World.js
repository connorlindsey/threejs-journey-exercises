import Experience from "../Experience"
import Floor from "./Floor"
import Environment from "./Environment"
import Fox from "./Fox"

export default class World {
  constructor() {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.resources = this.experience.resources

    this.resources.on("ready", () => {
      this.floor = new Floor()
      this.environment = new Environment()
      this.fox = new Fox()
    })
  }

  update() {
    if (this.fox) this.fox.update()
  }
}
