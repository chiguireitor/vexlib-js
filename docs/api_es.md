# API de Vex (español)

Estos son los llamados HTTP REST para el API. todos son relativos al root del
exchange.

## POST /vexapi/user

Endpoint registro usuario

### Headers:

Content-type: application/json

### Request:

```js
{
  "userid": sha256(correo),                                                     // puede ser cualquier ID, se sugiere el sha256 del correo
  "email": correo,                                                              // No se almacena en el sistema público
  "cryptdata": aes256(semilla, sha256(password)),
  "address": base58(derivacionHD("m/0'/0/0", semilla).pubKey, bitcoin.testnet),
  "signature": firmaECDSA(derivacionHD("m/0'/0/0", semilla).privKey, challenge) // opcional, sólo para reemplazar la data del usuario
}
```

## GET /vexapi/usrconfirm/:userAddress

Enpoint para confirmar el registro de un usuario (utilizado principalmente para
confirmar el correo del usuario).

### Respuesta:

Un redirect a la página

## GET /vexapi/sesskey/:userAddress

Obtienes un challenge para subir datos del usuario

### Respuesta:

```js
{
  "key": string
}
```


## POST /vexapi/userdocs/:userAddress

Sube los documentos del usuario a la base de datos privada.

Este endpoint pronto requerirá encripción usando OpenPGP.

### Headers:

Content-type: application/json

### Request:

```js
{
  "data": aes256({

  }, sesskey),
  "extraData": dataNoEncriptada
}
```
