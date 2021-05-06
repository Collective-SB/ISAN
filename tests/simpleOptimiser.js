const fs = require('fs');
const path_module = require('path');
const joinPath = path_module.join;

const lexer = require('./Yazur/modules/yolol/lex');
const { split } = require('./utils');


module.exports=(path_in, path_out)=>{
    let code = fs.readFileSync(joinPath("..","src",path_in)).toString();

    //get rid of spaces around operators
    code = code.replace(/ ([\+-\/\*><\^=%!]=?) /g, (match, g1)=>(g1));

    //Lex code
    let opt = [];
    split(code).forEach((line,i)=>{
        opt.push(lexer(line,i))
    });

    //count local var references
    let localCounters = {};
    let avail = [..."abcdefghijklmnopqrstuvwxyz"];
    opt.forEach(lexedLine=>{
        lexedLine.forEach(token=>{
            if(token.type == 3 && token.subtype == 2 && !token.value.startsWith(":")){
                if(token.value.length>1){
                    if(!localCounters[token.value]){
                        localCounters[token.value]=[token];
                    } else {
                        localCounters[token.value].push(token);
                    }
                } else {
                    avail=avail.reduce((acc, cur)=>{
                        if(cur!==token.value) acc.push(cur);
                        return acc;
                    },[]);
                }
            }
        });
    });

    //find most common longest variables
    let localCounters_arr = [];
    Object.keys(localCounters).forEach(varname=>{
        localCounters_arr.push(localCounters[varname]);
    });
    localCounters_arr.sort((a,b)=>(b.length*b[0].value.length - a.length*a[0].value.length));

    //rename longest vars using available single chars
    let rnmap = ["//Rename map:"];
    for(var i=0; i<avail.length; i++){
        if(i>=localCounters_arr.length) break;

        rnmap.push(`//  ${localCounters_arr[i][0].value} -> ${avail[i]}`);

        localCounters_arr[i].forEach(token=>{
            token.value = avail[i];
        });
        
    }

    //rebuild code
    let builder = [];
    opt.forEach((lexedLine,i)=>{
        builder[i] = [];
        lexedLine.forEach((token,j)=>{
            if(token.type == -1 && j != lexedLine.length-1){
                builder[i].push(" ");
            } else if(token.type == 3 && token.subtype==0){
                builder[i].push(`"${token.value}"`);
            }else{
                builder[i].push(token.value);
            }
            
        });
        builder[i] = builder[i].join("");
    });

    builder.forEach((builtLine, i)=>{
        if(builtLine.length > 70) {
            console.warn(`        Line ${i+1} still over 70 chars after optimising!`)
        }
    });

    //add rename map to end of code
    builder.push(rnmap.join("\n"));

    fs.writeFileSync(joinPath("..","src",path_out), builder.join("\n"));
}