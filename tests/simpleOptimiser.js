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
    let avail_1 = [..."abcdefghijklmnopqrstuvwxyz"];
    let avail_2 = [];
    for(let i=0; i<avail_1.length; i++){
        for(let j=0; j<avail_1.length; j++){
            avail_2.push(`${avail_1[i]}${avail_1[j]}`);
        }
    }

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
                    avail_1=avail_1.reduce((acc, cur)=>{
                        if(cur!==token.value) acc.push(cur);
                        return acc;
                    },[]);
                }

                if(token.value.length>2){
                    avail_2=avail_2.reduce((acc, cur)=>{
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
    let i;
    for(i=0; i<avail_1.length; i++){
        if(i>=localCounters_arr.length) break;

        rnmap.push(`//  ${localCounters_arr[i][0].value} -> ${avail_1[i]}`);

        localCounters_arr[i].forEach(token=>{
            token.value = avail_1[i];
        });
    }

    for(let j=0; j<avail_2.length; j++){
        if(i+j>=localCounters_arr.length) break;

        rnmap.push(`//  ${localCounters_arr[i+j][0].value} -> ${avail_2[j]}`);

        localCounters_arr[i+j].forEach(token=>{
            token.value = avail_2[j];
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