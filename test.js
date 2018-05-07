import VexLib from './index.js'

var vl = VexLib.singleton({})

vl.remoteLogin('johnvillar@contimita.com', '123', (err, data) => {
  if (err) {
    console.log('ERROR', err)
  } else {
    console.log('LOGGED IN')
    vl.generateTokenDepositAddress('BTCT', (err, data) => {
      if (err) {
        console.log('ERROR', err)
      } else {
        console.log(data)
      }
    })
  }
})
