const fs = require('fs');

let pasteQueue = [];

function getCodeLines(file){
    let code = fs.readFileSync(file).toString();
    if (code.includes('\r')){
        return code.split('\r\n');
    } else {
        return code.split('\n');
    }
}

function evalInScope(js, contextAsScope) {
    return function() { with(this) { return eval(js); }; }.call(contextAsScope);
}

module.exports = {
    load: (file)=>{

        let lines = getCodeLines(file);
        let chipCode = [];
        let replacers = [];
        let chipCount = 1;

        let fields = [];
        let devCount = 1;

        lines.forEach((line,i)=>{
            if(line.startsWith("//#replacer ")){
                let split = line.substr(12, line.length).split(" --> ");
                replacers.push({
                    target: new RegExp(split[0].trim(), "g"),
                    code: split[1]
                });
            } else if(line.startsWith("//#numchips ")){
                chipCount = parseInt(line.split(" ")[1]);
            } else if(line.startsWith("//#numdevs ")){
                chipCount = 0;
                devCount = parseInt(line.split(" ")[1]);
            } else if(line.startsWith("//#field ")){
                let split = line.substr(9, line.length).split(" --> ");
                fields.push({
                    name: split[0].trim(),
                    value: split[1].trim(),
                    skip: 0
                });
            } else if(line.startsWith("//#skippage")){
                fields.push({ skip: 1 });
            } else if (i<20){
                chipCode.push(line.substr(0,70).trim());
            }
        });

        pasteQueue.push({
            chipCode,
            replacers,
            scope: {
                chip:0,
                dev:0,
                alpha:(number, id)=>{
                    //debugger;
                    const chars = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"];
                    let str = "";
                    let val = id;
                    for(let i=0; i<number; i++){
                        let div = Math.pow(chars.length, i+1);
                        let curChar = val%div;
                        val = Math.floor(val/div);
                        str = chars[curChar] + str;
                    }
                    return str;
                },
                floor: Math.floor
            },
            chipCount,
            devCount,
            fields
        });
    },
    paste: (handler)=>{
        if(pasteQueue.length==0){
            handler("Nothing to paste.");
            return;
        }

        let cur = pasteQueue[0];
        let lines = JSON.parse(JSON.stringify(cur.chipCode));   //create a completely disconnected copy

        cur.chipCount--;
        cur.scope.chip++;
        
        cur.replacers.forEach(replacer=>{

            let replacement = evalInScope(replacer.code, cur.scope)

            for(let i=0; i<lines.length; i++){
                lines[i] = lines[i].replace(replacer.target, replacement);
            }
        });

        lines.forEach(handler);

        if(cur.chipCount<=0) pasteQueue.shift();
    },
    pasteFields:(field, nextDev)=>{
        if(pasteQueue.length==0){
            console.log("No fields to paste")
            return;
        } 

        console.log("Pasting fields");

        let f = pasteQueue.shift();

        for(let i=0; i<f.devCount; i++){
            
            for(let j=0; j<f.fields.length; j++){
                if(f.fields[j].skip == 1) {
                    nextDev();
                } else {
                    field(
                        evalInScope(f.fields[j].name, f.scope),
                        evalInScope(f.fields[j].value, f.scope)
                    )
                }
            }

            f.scope.dev++;
            nextDev();
        }

    },
    backup:()=>{
        if(pasteQueue[0]?.scope.chip > 0){
            pasteQueue[0].scope.chip--;
        }
    },
    setChip:(i)=>{
        if(pasteQueue[0]?.scope){
            pasteQueue[0].scope.chip = i;
        }
    }
}

