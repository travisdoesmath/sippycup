class Dispatch {
    constructor() {
        this.queue = []
        this.channels = []
    }

    openChannel() {
        const channel = new MessageChannel();

        channel.port1.onmessage = messageHandler;

        messageHandler = e => {
            console.log('handled message, e:', e)   
        }
    }
}