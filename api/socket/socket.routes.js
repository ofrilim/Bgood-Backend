module.exports = connectSockets;

function connectSockets(io) {
    io.on('connection', socket => {
        // console.log('BACKEND CONNECTED TO *** SOCKET ***')
        socket.on('newMsg', msg => {
            console.log('BE: massage arrived: ', msg)

            io.emit('BEMsg', 'Someone is interested in your item!')
        }),
        socket.on('approveMsg', msg => {
            console.log('BE: massage arrived: ', msg)

            io.emit('BEMsgApprove', 'ITEM SOLD!')
        })
    })
}