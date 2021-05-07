const fs = require('fs');
const path_module = require('path');
const joinPath = path_module.join;

const Y = require('./Yazur/yazur');
const { getCode } = require('./code');

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

    test.start({test, net, memchip, receivers, craft:craft_state});

    for(let tick=0; tick<totalTicks; tick++){

        //check for craft_state updates
        if(test.simulation.timing[cstate+1] && test.simulation.timing[cstate+1]==tick){
            cstate++
            console.log(`    > state update at tick ${tick}`);
            Object.keys(test.simulation.craft_states[cstate]).forEach(key=>{
                craft_state[key] = test.simulation.craft_states[cstate][key];
            });
        }

        //run yolol tick
        let preTickTest = test.preTick({test, net, memchip, receivers, craft:craft_state, tick});
        if(preTickTest) throw preTickTest;

        net.queueTick_random();
        net.doTick();

        let postTickTest = test.postTick({test, net, memchip, receivers, craft:craft_state, tick});
        if(postTickTest) throw postTickTest;

        //update state
        [..."xyz"].forEach(axis=>{
            craft_state[axis]+=craft_state[`v${axis}`]*0.2;
            craft_state[`v${axis}`]+=craft_state[`a${axis}`]*0.2;
        });
        
    }

    let simEndTest = test.end({test, net, memchip, receivers, craft:craft_state});

    if(simEndTest){
        console.error("  Simulation failed.");
        throw "Failed";
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
                let src = joinPath('..', ...chip.src);

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

runTests();

setTimeout(()=>{console.log("done")}, 5000); //hacky node bs