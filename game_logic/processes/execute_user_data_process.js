const io = require('socket.io')(3000);
const redisAdapter = require('socket.io-redis');
io.adapter(redisAdapter({ host: 'localhost', port: 6379 }));

const Game = require('../game.js')
const { Player } = require('../entity.js')



const process_helper = {
    loop_going: true,
    players: {}
}

process.on('message', async (data) => {
    switch(data.cmd) {
        case Game.game_process_child_commands.START_GAME:
            Loop()
            break;
        case Game.game_process_child_commands.USER_POSITION:
            process_helper.players[data.id].row = data.row
            process_helper.players[data.id].col = data.col
            process_helper.players[data.id].playerState = data.playerState
            break;
        case Game.game_process_child_commands.USER_ADDED:
            process_helper.players[data.id] = {
                row:data.row,
                col:data.col,
                playerState:data.playerState
            }
            break;
        case Game.game_process_child_commands.USER_REMOVED:
            delete process_helper.players[data.id]
            break;
    }
});

async function Loop() {
    let second = 1000
    let tickRate = second/40
    while(process_helper.loop_going) {
        if(Object.keys(process_helper.players).length != 0) {
            // io.emit('update-board-state', {players: process_helper.players})
        }
        await sleep(tickRate)
    }
}

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

