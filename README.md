vexlib-js:
====

En el shell:
```
yarn add ssh://git@192.168.3.6:10022/vex/vexlib-js.git
```

En el código:
```
import VexLib from 'vexlib-js'

const vl = VexLib.singleton({
  baseUrl: 'localhost', // Default: 'vex.xcp.host'
  lang: 'ES' // Default: 'EN'
  })
```
