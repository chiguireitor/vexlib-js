const fs = require('fs')

let curBuild = parseInt(fs.readFileSync('.build').toString('utf8'))
curBuild += 1
console.log(curBuild)
fs.writeFileSync('.build', `${curBuild}`)
