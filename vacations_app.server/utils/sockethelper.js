var socketHelper={
    io:null, 
    startSockets:(ioFromApp)=>
    {
        this.io= ioFromApp;
        ioFromApp.on('connection', function (socket) {
            console.log('connected'); 
            socket.on("disconnect", () => console.log("Client disconnected"));
        });
    }, 
    updateClient:(data)=>
    {
        this.io.emit('FromAPI', data);
    } 
}

module.exports= socketHelper;