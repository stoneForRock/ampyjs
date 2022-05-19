import { SerialPort, ReadlineParser, InterByteTimeoutParser, ReadyParser} from 'serialport';

class Serial {
    constructor(path, baudRate=115200) {

        var that = this
        process.on('SIGINT', function() {
            console.log('Got SIGINT. Press Control-D/Control-C to exit.');
            // console.log(this)
            that.close()
            this.exit()
        });

        this.messageListeners = new Map();

        this.serialPort = new SerialPort({path: path, baudRate: baudRate});
        const readline = new ReadlineParser({delimiter: '>'})
        const parser = this.serialPort.pipe(readline)
        parser.on('data',chunk => {
            // 执行结果的回调
            console.log("------" , chunk.toString())
            this.notifyMessage(chunk.toString());
        })
    }

    addMessageListener(id, listener) {
        if (!this.messageListeners.has(id)) {
          this.messageListeners.set(id, listener);
        }
    }

    notifyMessage(message) {
        this.messageListeners.forEach((listener) => {
            listener.call(listener, message);
        });
    }

    removeMessageListenerById(id) {
        if (this.messageListeners.has(id)) {
            this.messageListeners.delete(id);
        }
    }

    static serialPortList() {
        SerialPort.list()
        .then((ports) => {
            ports.forEach( (port)=> {
                console.log("path：", port.path);
                console.log("vid：", port.vendorId);
                console.log("pid：", port.productId);
                console.log("manufacturer： ", port.manufacturer);
            });
        })
        .catch((err)=>{
            console.log(err);
        });
    }

    close() {
        this.serialPort.close()
    }

    sendMsg(messgae) {
        return new Promise((resolve, reject) => {
            const id = Date.now();
            this.addMessageListener(id, (result) => {
                this.removeMessageListenerById(id);
                resolve(result);
            });
            this.serialPort.write(Buffer.from(messgae))
        })
    }


}

export default Serial;
