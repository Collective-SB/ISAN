const fs = require('fs');
const jp = require('path').join;

let loaded, chips={};
function paste(eachLine){
    let lines = chips[loaded.state.chip];
        
    for(let i = 0; i<lines.length; i++){
        lines[i] = lines[i].substring(0, 70).trim();
    }

    lines = lines.join("\n");

    //do replacements
    for(let i=0; i<loaded.replaceables.length; i++){
        lines = lines.replace(new RegExp(loaded.replaceables[i], 'g'), loaded.state.replacements[i]);
    }

    lines.split("\n").forEach(eachLine);

    loaded.state.counter++;
    loaded.state = loaded.next(loaded.state, loaded.replaceables);
}

function loadPastable(name){
    loaded = require(`./code/${name}/conf.js`);

    loaded.state.replacements = [...loaded.replaceables];

    loaded.chips.forEach(chip=>{
        chips[chip] = getCodeLines(name, chip);
    });
}

function getCodeLines(name, chip){
    let code = fs.readFileSync(jp(__dirname, 'code', name, chip)).toString();
    if (code.includes('\r')){
        return code.split('\r\n');
    } else {
        return code.split('\n');
    }
}

module.exports = {loadPastable, paste};