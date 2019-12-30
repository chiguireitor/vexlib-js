El parámetro "cb" se refiere a un callback estilo nodejs con firma (err, response).
Todos estos son métodos de la clase VexLib definida en index.js

-- Usuarios
createUser(email, password, uiLang, signature, cb)
sendRegisterPkg(userAddress, pkg, cb)
userEnabled(cb)
remoteLogin(email, password, externalToken, cb)
remoteLogout(cb)

-- Tokens
getTokenDepositAddress(token, cb)
generateTokenDepositAddress(token, cb)
getDeposits(addr, cb)
getWithdraws(addr, cb)
getBalances(cb)
getTokens(cb)
generateTransfer(token, amount, destination, memo, twofa, cb)
generateWithdrawal(token, amount, address, info, cb)
reportFiatDeposit(getToken, getAmount, depositId, bankName, files, cb)

-- Ordenes
createOrder(giveAsset, giveAmount, getAsset, getAmount, cb)
cancelOrder(txid, cb)
getTradeHistory(give, get, cb)
getMyRecentOrders(give, get, addr, cb)
getGlobalRecentOrders(give, get, cb)
getOrderBook(give, get, isBid, cb)

-- Misc
getFees(give, get, cb)
