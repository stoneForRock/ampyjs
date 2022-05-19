import Until from "./unitl.js";

const BUFFER_SIZE = 32
class Files {
    constructor(jsboard) {
        this.jsboard = jsboard
    }

    get(fileName) {
        `Retrieve the contents of the specified file and return its contents
        as a byte string.
        `
        return new Promise((resolve, reject) => {
            const command = `
import sys
import ubinascii
with open('${fileName}', 'r') as infile:
    result = infile.read()
    sys.stdout.write(result)
        `
            this.jsboard.enter_raw_repl().then((msg) => {
                this.jsboard.exec_(command).then((result) => {
                    this.jsboard.exit_raw_repl()
                    resolve(result)
                }).catch((error) => {
                    reject(error)
                })
            })
        })
    }

    ls(directory, long_format=true, recursive=false) {
        return new Promise((resolve, reject) => {
                var command = `
import os\n
                `

            if (recursive) {
                command += `
def listdir(directory):
    result = set()
    def _listdir(dir_or_file):
        try:
            children = os.listdir(dir_or_file)
        except OSError:                        
            # probably a file. run stat() to confirm.
            os.stat(dir_or_file)
            result.add(dir_or_file) 
        else:
            # probably a directory, add to result if empty.
            if children:
                # queue the children to be dealt with in next iteration.
                for child in children:
                    # create the full path.
                    if dir_or_file == '/':
                        next = dir_or_file + child
                    else:
                        next = dir_or_file + '/' + child        
                    _listdir(next)
            else:
                result.add(dir_or_file)                     
    _listdir(directory)
    return sorted(result)\n`
            } else {
                command += `
def listdir(directory):
    if directory == '/':                
        return sorted([directory + f for f in os.listdir(directory)])
    else:
        return sorted([directory + '/' + f for f in os.listdir(directory)])\n`
            }

            // Execute os.listdir() command on the board.
            if (long_format){
                command += `
r = [];
for f in listdir('${directory}'):
    size = os.stat(f)[6]
    info = str(f) + " - " + str(size) + "bytes"                   
    r.append(info)
print(r)
    `
            } else {
                command += `
print(listdir('${directory}'))
                `
            }
            
            this.jsboard.enter_raw_repl().then((msg) => {
                this.jsboard.exec_(command).then((result) => {
                    this.jsboard.exit_raw_repl()
                    resolve(result)
                }).catch((error) => {
                    reject(error)
                })
            })
        });
        
        
    }

    mkdir(directory, exists_okay=false) {
        `Create the specified directory.  Note this cannot create a recursive
        hierarchy of directories, instead each one should be created separately.
        `
        const command = `
try:
    import os
except ImportError:
    import uos as os
      
os.mkdir('${directory}')
        `
        this.jsboard.enter_raw_repl().then((msg) => {
            this.jsboard.exec_(command)
            this.jsboard.exit_raw_repl()
        })
    }

    put(filename, data) {
        this.jsboard.enter_raw_repl().then((msg) => {
            const openFileCommand = `import ubinascii;\r\nimport os;\r\nf = open('${filename}', 'wb')`
            this.jsboard.exec_(openFileCommand)

            const bufferData = Buffer.from(data).toString("base64")
            const bufferArray = Until.splitString(bufferData, 256)
            for (let index = 0; index < bufferArray.length; index++) {
                const writeCode = bufferArray[index];
                this.jsboard.exec_(`f.write(ubinascii.a2b_base64(b'${writeCode}'));\r\n`)
            }
            this.jsboard.exec_("f.close()")
            this.jsboard.exit_raw_repl()
        });
    }

    rm(filename) {
        `Remove the specified file or directory.`
        const command = `
try:
    import os
except ImportError:
    import uos as os
os.remove('${filename}')
            `
        this.jsboard.enter_raw_repl().then((msg) => {
            this.jsboard.exec_(command)
            this.jsboard.exit_raw_repl()
        })
    }

    rmdir(directory, missing_okay=false) {
        `Forcefully remove the specified directory and all its children.`
        const command = `
try:
    import os
except ImportError:
    import uos as os

def rmdir(directory):
    os.chdir(directory)
    for f in os.listdir():
        try:
            os.remove(f)
        except OSError:
            pass
    for f in os.listdir():
        rmdir(f)
    os.chdir('..')
    os.rmdir(directory)
rmdir('${directory}')
        `;
        this.jsboard.enter_raw_repl().then((msg) => {
            this.jsboard.exec_(command)
            this.jsboard.exit_raw_repl()
        })
    }

}

export default Files;