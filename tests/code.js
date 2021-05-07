const fs = require('fs');
const joinPath = require('path').join;
const { execSync } = require('child_process');

const optimiser = require('./simpleOptimiser');
const { split } = require('./utils');

function getCode(path){
    if(path[path.length-1].endsWith(".yasm")){

        assembleYasm(path);
        runOptimiser(path);

        return split(fs.readFileSync(joinPath("..","src", ...path) + ".opt.yolol").toString());
    } else {
        return split(fs.readFileSync(joinPath("..","src", ...path)).toString());
    }
}


function assembleYasm(path){
    let outPath = joinPath(...path) + ".yolol";

    console.log("      Assembling yasm");
    let yasmOutput = execSync(
        `${joinPath("..","tests","yasm","YololAssembler")} -i ${joinPath(...path)} -o ${outPath}`,
        {
            cwd:joinPath("..","src")
        }    
    ).toString();

    let yasmString = ["\n//yasm assmbler output:\n"];
    //Write yasm output to end of file as comments
    split(yasmOutput).forEach(yasmLine=>{
        yasmString.push(`//  >${yasmLine}\n`);
    });

    fs.appendFileSync(joinPath("..","src",outPath), yasmString.join(''));
}

function runOptimiser(path){
    console.log("      Running optimiser");
    optimiser(joinPath(...path) + ".yolol", joinPath("..","src", ...path) + ".opt.yolol")
}

module.exports.getCode = getCode;

//If module is run standalone, watch all yasm files.
if (require.main === module) {

    console.log("Watching for changes in yasm...");

    //walk src dir & add watcher to each yasm file
    function walk(dir, walked){
        fs.readdir(dir, (err, files)=>{
            if(err) throw err;
            
            files.forEach(file=>{
                var path = joinPath(dir, file)
                fs.stat(path, (err, stat)=>{
                    if(err) throw err;
                    if (stat.isDirectory()) {
                        walk(path, [...walked, file]);
                    } else if(file.endsWith(".yasm")){
                        fs.watchFile(path, (curr, prev)=>{
                            
                            let codePath = [...walked, file];
                            console.log(`Recompiling ${joinPath(...codePath)}`);
                            assembleYasm(codePath);
                            runOptimiser(codePath);
                        });
                    }
                });
            });

        });
    };

    walk(joinPath("..","src"), []);
    
}
