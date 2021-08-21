const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

let cwd = process.cwd();

const yasm = path.join(cwd,"tools", "YASM", "YololAssembler");

let bundle_dirs=fs.readdirSync(path.join("bundles"));

bundle_dirs.forEach(name=>{
    let bundle_files = fs.readdirSync(path.join(cwd,"bundles", name));
    console.log(bundle_files);
    bundle_files.forEach(file=>{
        if(file.endsWith(".yasm")){

            runUpdate(name, file);

            fs.watchFile(path.join(cwd,"bundles", name, file), {interval: 500}, (curr, prev)=>{
                runUpdate(name, file);
            });

        }
    })
});

function runUpdate(name, file){
    let yasmProc = spawn(yasm, [`-i${file}`, `-o${file.replace(".yasm", ".yolol")}`], {cwd:path.join(cwd,"bundles", name)})

    yasmProc.stdout.on('data', (data) => {
        console.log(`[${name}][${file}]: ${data}`);
    });

    yasmProc.stderr.on('data', (data) => {
        console.error(`[${name}][${file}]STDERR: ${data}`);
    });

    console.log(`Spawned [${name}][${file}]`)
}