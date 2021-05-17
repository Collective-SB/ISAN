const WB = require('./winnatives/ssc_wrapper');
const {load, paste} = require('./loader');

const jp = require('path').join

const IN_SSC = false

//load chips to paste (go see code/directive_example/example.yolol for how directives look)
load(jp("code","coproc_new","coproc_new.yolol"));


let mainInterval = setInterval(()=>{
    let ok = WB.handleEvent();
    if(!ok) throw "failed to handle event!";
}, 2);

WB.onShift('P', ()=>{
    WB.backspace();
    paste(line=>{
        if(IN_SSC) WB.selectLine(true);
        WB.sendString(line);
        WB.nextLine(IN_SSC);
    });
});

WB.onShift('\x1B', ()=>{    //shift+esc
    clearInterval(mainInterval);
});

