const fs = require('fs');
const path_module = require('path');
const joinPath = path_module.join;
const { execSync } = require('child_process');

const Y = require('./Yazur/yazur');
const optimiser = require('./simpleOptimiser');
const { split } = require('./utils');

function getCode(path){
    if(path[path.length-1].endsWith(".yasm")){


        let outPath = joinPath(...path) + ".yolol";

        console.log("      Assembling yasm");
        let yasmOutput = execSync(
            `${joinPath("..","tests","yasm","YololAssembler")} -i ${joinPath(...path)} -o ${outPath}`,
            {
                cwd:joinPath("..","src")
            }    
        ).toString();

        //TODO check this output!
        split(yasmOutput).forEach(line=>{
            if(line.trim().length>0) console.log(`        >${line}`);
        });

        //run optimiser
        console.log("      Running optimiser");
        optimiser(outPath, joinPath("..","src", ...path) + ".opt.yolol")

        return split(fs.readFileSync(joinPath("..","src", ...path) + ".opt.yolol").toString());
    } else {
        return split(fs.readFileSync(joinPath("..","src", ...path)).toString());
    }
}

function updateReceivers(receivers, craft){
    if(receivers[0]) receivers[0].setPosition(craft.x, craft.y, craft.z);
    if(receivers[1]) receivers[1].setPosition(craft.x, craft.y+0.96, craft.z);
    if(receivers[2]) receivers[2].setPosition(craft.x, craft.y, craft.z+1.08);
    if(receivers[3]) receivers[3].setPosition(craft.x, craft.y+0.96, craft.z+1.08);
    if(receivers.length>4){
        for(var i=4; i<receivers.length; i++){
            receivers[i].setPosition(craft.x, craft.y, craft.z+1.08*i);
        }
    }
}

function runSimulation(test, net, memchip, receivers){
    let totalTicks = test.simulation.ticks;

    let craft_state = test.simulation.craft_states[0];
    let cstate = 0;

    let sim_fail = false;

    for(let tick=0; tick<totalTicks; tick++){

        //check for craft_state updates
        if(test.simulation.timing[cstate+1] && test.simulation.timing[cstate+1]==tick){
            cstate++
            console.log(`    > state update at tick ${tick}`);
            Object.keys(test.simulation.craft_states[cstate]).forEach(key=>{
                craft_state[key] = test.simulation.craft_states[cstate][key];
            });
        }

        //update receivers
        updateReceivers(receivers, craft_state);

        //run yolol tick
        test.preTick(test, net, memchip, receivers, craft_state, tick);

        net.queueTick_random();
        net.doTick();

        test.postTick(test, net, memchip, receivers, craft_state, tick);

        //verify
        let error = test.error(test, net, memchip, receivers, craft_state, tick);
        if(error){
            console.error(error);
            sim_fail = true;
            break;
        }
        //update state
        [..."xyz"].forEach(axis=>{
            craft_state[axis]+=craft_state[`v${axis}`]*0.2;
            craft_state[`v${axis}`]+=craft_state[`a${axis}`]*0.2;
        });
    }

    if(sim_fail){
        console.error("  Simulation failed.");
    } else {
        console.log("  Test passed.");
    }
}

function runTests(){
    let specs = fs.readdirSync('test_specs');
    for(let spec_i=0; spec_i<specs.length; spec_i++){
        let name = specs[spec_i];

        let tests = require(`./test_specs/${name}`);
        
        for(let test_i=0; test_i<tests.length; test_i++){
            let test = tests[test_i];

            console.log(`Test: ${name} -> ${test.name}\n`);

            let net = new Y.netmgr();

            console.log(`  Adding yolol chips:`);
            test.yolol_chips.forEach(chip=>{
                let src = joinPath('..', ...chip);

                console.log(`    ${src}`);
                new Y.yChip(
                    getCode(chip),
                    "root",
                    net
                );

            });

            for(let i=0; i<test.fields.length; i++) test.fields[i] = test.fields[i].toLowerCase();

            let memchip = new Y.mChip(
                test.fields,
                "root",
                net
            );
            console.log(`  Registered fields:\n    ${test.fields.join(", ")}`);
            
            console.log(`  Adding receivers:`)
            let receivers=[];
            test.receivers.forEach(receiver=>{
                let recvrFields = [
                    receiver.targetMessage,
                    receiver.signalStrength,
                    receiver.message,
                    receiver.initialTarget
                ];
                for(let i=0; i<recvrFields.length; i++) recvrFields[i] = recvrFields[i].toLowerCase();
                receivers.push(new Y.recvr(
                    recvrFields,
                    test.transmitters,
                    "root",
                    net
                ));
                console.log(`    ${JSON.stringify(receiver)}`);
            });

            console.log("  Using transmitters:");
            Object.keys(test.transmitters).forEach(transmitter=>{
                console.log(`    ${transmitter}: ${JSON.stringify(test.transmitters[transmitter])}`);
            });

            console.log("\n  Test Starting.")

            runSimulation(test, net, memchip, receivers);

            console.log("\n\n");
        }

    }
}


let compileDirExists = fs.existsSync("compiled");
if(!compileDirExists) fs.mkdirSync("compiled");

runTests();

setTimeout(()=>{console.log("done")}, 5000); //hacky node bs