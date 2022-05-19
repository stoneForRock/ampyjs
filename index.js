/**
 * js版的串口烧录调试工具
 * 1.单次只能执行一次操作，如果需要连续操作，需要在上次命令执行完毕的时候再次执行命令（单线程操作...）
 * 2.切换不同的操作目前只能通过解注释代码使用
 * 
 */

import Serial from "./serial.js";
import Files from "./files.js";
import JSboard from "./jsboard.js";

/** 获取当前连接电脑上的所有串口信息，包括pid，vid，path 
 * 为创建串口对象获取相关参数
*/
Serial.serialPortList();

/** 创建板子和文件操作对象 */

// 如果需要在ucode插件中使用，可将该对象替换为ucode的device对象
// 该路径需要修改为你本地串口的地址，可以通过上面的接口获取，第二个参数为串口比特率
const serialPort = new Serial("/dev/tty.usbmodem143101", 1000000)

const board = new JSboard(serialPort)
const file = new Files(board)

/**
 * 往指定文件中写入数据,如果文件不存在，会创建文件并写入,以未来板写入main.py为实例(代码烧录)
 *  */
// const code = `from future import *;
// screen.fill((57,23,120));
// screen.refresh();`;
// file.put('main.py', code)

/** 获取文件内容数据 */
// file.get("b.text").then((result) => {
//     console.log("读取文件内容为：\r\n", result)
// })

/** 创建文件夹 */
// file.mkdir("test")

/**
 * 获取文件列表 
 * ls(directory, long_format=true, recursive=false)
 * directory： 目标目录，如果是根文件目录就是 ""
 * long_format: 是否显示为有文件大小的格式
 * recursive： 是否需要递归子文件目录
 *  */ 

file.ls("", true, true).then((result) => {
    console.log("获取板子内的文件列表\r\n", result)
})

/** 删除文件 */
// file.rm("a.py")

/** 删除文件目录 */
// file.rmdir("test")


