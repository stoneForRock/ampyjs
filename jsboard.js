import Until from "./unitl.js";

String.prototype.endWith=function(endStr){
    var d=this.length-endStr.length;
    return (d>=0&&this.lastIndexOf(endStr)==d);
}

class JSboard {
    constructor(device, rawdelay=0) {
        this.device = device;
        this.rawdelay = rawdelay;
    }

    close() {
        this.device.close()
    }

    enter_raw_repl() {
        return new Promise((resolve) => {
            // Brief delay before sending RAW MODE char if requests
            if (this.rawdelay > 0) {
                Until.sleep(this.rawdelay)
            }
            // ctrl-C twice: interrupt any running program
            this.enter_repl().then((msg) => {
                // flush input (without relying on serial.flushInput())
                setTimeout(() => {
                    this.device.sendMsg([0x01]);
                }, 1000);
                  setTimeout(() => {
                    this.device.sendMsg([0x01]).then((msg) => {
                        console.log('进入raw_repl模式成功:', msg)
                        resolve(msg);
                    });
                }, 2000);
            })
        });
    }

    // send control-c for initialize repl
    enter_repl() {
        return new Promise((resolve) => {
            setTimeout(() => {
              this.device.sendMsg([0x03]);
            }, 1000);
            setTimeout(() => {
              this.device.sendMsg([0x03]);
            }, 2000);
            setTimeout(() => {
              this.device.sendMsg([0x03]).then((msg) => {
                console.log('进入repl模式成功:', msg)
                resolve(msg);
              });
            }, 3000);
        });
    }

    // control-B 
    exit_raw_repl() {
        this.device.sendMsg('\r\x02').then((msg) => {
            setTimeout(() => {
                console.log("进程执行完毕!")
                process.exit()
            }, 1000);
        })
        this.device.sendMsg('\r\x04')
    }
    
    exec_(command) {
        return new Promise((resolve, reject) => {
            console.log('执行的命令\r\n', command)
            this.device.sendMsg(command).then((msg) => {
                console.log('执行命令的结果: ', msg)
                if (Until.confirmStart(msg, "OK")) {
                    msg = msg.substr(2, msg.length-2)
                    resolve(msg)
                } else {
                    reject(msg)
                }
            });
            this.device.sendMsg('\x04')
        })  
    }
}

export default JSboard;