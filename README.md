# ampyjs
ampy for js

# ampy的js版本，你可以通过该工具实现串口调试，操作micropython环境的开发板。例如ESP32系列板子。
‘’‘
  使用方法见index.js里面的说明，可以通过 >node index.js 进行调试
’‘’

运行前需要安装串口连接库 serialport
依赖库：npm install serialport

本项目相当于通过串口调试，对开发板中的文件系统进行管理

file.ls() // 查看板子上的文件列表
file.put('main.py','xxx')//对板子进行烧录程序操作
...

欢迎各位大神对本库进行优化

注：本库为ampy的js版串口烧录工具，调用结构也基本和ampy一致。



