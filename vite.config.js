import { defineConfig } from "vite"

const fs = require("fs")
const path = require("path")

function pathToTitle(path) {
  const parts = path
    .split("/")
    .at(1)
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))

  // Add '-' at the first array index
  parts.splice(1, 0, "—")

  return parts.join(" ")
}

function generateIndex() {
  const basePath = "./exercises"
  const indexPath = "./index.html"

  const generateIndex = (dir, filelist = []) => {
    fs.readdirSync(dir).forEach((file) => {
      const filePath = path.join(dir, file)
      if (fs.statSync(filePath).isDirectory()) {
        generateIndex(filePath, filelist)
      } else if (file === "index.html") {
        filelist.push(filePath.replace("./", ""))
      }
    })
    return filelist
  }

  const htmlFiles = generateIndex(basePath)

  const indexContent = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Three.js Journey Exercises</title>
    <link rel="stylesheet" href="./styles.css" />
  </head>
  <body>
    <h1 class="text-3xl">Three.js Journey Exercises</h1>
    <p class="mt-2">By <a href="https://x.com/connor_lindsey">Connor Lindsey</a></p>
    <ul class="list-disc list-inside mt-3">
      ${htmlFiles.map((file) => `<li><a href="${file}">${pathToTitle(file)}</a></li>`).join("")}
    </ul>
  </body>
</html>
`
  if (fs.existsSync(indexPath)) {
    const currentContent = fs.readFileSync(indexPath, "utf-8")
    if (currentContent === indexContent) {
      return // Do not rewrite if content is the same
    }
  }

  fs.writeFileSync(indexPath, indexContent)
}

export default defineConfig({
  server: {
    open: true,
    fs: {
      strict: false,
    },
  },
  plugins: [
    {
      name: "watch-exercises",
      configureServer(server) {
        server.watcher.add("./exercises/**")
        server.watcher.on("add", generateIndex)
        server.watcher.on("unlink", generateIndex)
        server.watcher.on("change", generateIndex)
      },
    },
    {
      name: "generate-index",
      buildStart() {
        generateIndex()
      },
    },
  ],
})
