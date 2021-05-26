const WB = require('./winnatives/ssc_wrapper');
const codeLoader = require('./loader');

const jp = require('path').join

const IN_SSC = true

//load chips to paste (go see code/directive_example/example.yolol for how directives look)
//codeLoader.load(jp("code","coproc_new","coproc_new_fields.yolol"));

//codeLoader.setChip(0);Nothing to paste.

let kInt = setInterval(()=>{
    WB.checkKeys();
}, 20);

let pInt = setInterval(()=>{
    let ok = WB.handleEvent();
    if(!ok) throw "failed to handle event!";
}, 30);

let positions = [];

WB.onShift('L', ()=>{       //save cursor pos
    WB.backspace();
    positions.push(WB.getCursorPos())
    console.log("saved pos", positions[positions.length-1])
});

WB.onShift('K', ()=>{       //recall cursor positions
    WB.backspace();
    positions.forEach(WB.schedule_move)
});


WB.onShift('P', ()=>{       //paste chip
    WB.backspace();
    codeLoader.paste(line=>{
        if(IN_SSC) WB.selectLine(true);
        WB.sendString(line);
        WB.nextLine(IN_SSC);
    });
});

WB.onShift('I', ()=>{       //Paste fields
    codeLoader.pasteFields(
        (name, value)=>{
            WB.selectLine(true);
            WB.sendString(name);
            WB.nextCell();
            WB.selectLine(true);
            WB.sendString(value);
            WB.nextCell();
        },
        ()=>{
            WB.click();
            WB.nextCell();
        }
    )
})

WB.onShift('O', ()=>{       //go back a chip
    WB.backspace();
    codeLoader.backup();
});

WB.onShift('\x1B', ()=>{    //shift+esc
    clearInterval(kInt);
    clearInterval(pInt);
});

