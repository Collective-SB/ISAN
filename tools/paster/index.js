const WB = require('./winnatives/ssc_wrapper');
const codeLoader = require('./loader');


const jp = require('path').join

const IN_SSC = false

//load chips to paste (go see code/directive_example/example.yolol for how directives look)
codeLoader.load(jp("code","coproc_new","coproc_new.yolol"));

codeLoader.setChip(0);

let kInt = setInterval(()=>{
    WB.checkKeys();
}, 20);

let pInt = setInterval(()=>{
    let ok = WB.handleEvent();
    if(!ok) throw "failed to handle event!";
}, 30);



WB.onShift('P', ()=>{       //paste chip
    WB.backspace();
    codeLoader.paste(line=>{
        if(IN_SSC) WB.selectLine(true);
        WB.sendString(line);
        WB.nextLine(IN_SSC);
    });
});

WB.onShift('O', ()=>{       //go back a chip
    WB.backspace();
    codeLoader.backup();
});

WB.onShift('\x1B', ()=>{    //shift+esc
    clearInterval(kInt);
    clearInterval(pInt);
});

