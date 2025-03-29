const EventEmitter = require('events');
const eventEmitter = new EventEmitter();

eventEmitter.on('start', ()=> {
    console.log('Application Started!');
});

eventEmitter.on('data', (data)=> {
    console.log(`Data received: ${JSON.stringify(data)}`);
});

eventEmitter.emit('start');
eventEmitter.emit('data', 'name: Astrid Borja , age: 23'); 

eventEmitter.on('error' , (error)=> {
    console.log(`Error occurred: ${error}`);
});

eventEmitter.emit('error', 'This is an error. Please try again.');