//----Simulation setup----
//------------------------------------------------------------------Modify from here

var totalTicks=200; //Total number of yolol ticks to run

//Craft state updates (all in meters(^2/3) per second)

var craft=[
    {x:0, y:0, z:0, vx:0, vy:0, vz:0, ax:0, ay:0, az:0},    //initial state
    {ax:20, ay:20, az:20},                                  //update acceleration to (20,20,20)
    {ax:0, ay:0, az:0}                                      //stop accelerating
]

//What ticks to update the ships state at
var switchAt=[0, 50, 70];                                   //Start accelerating at tick 50, stop at tick 70

//------------------------------------------------------------------Dont Modify from here

//Run simulation
console.log("ISAN TOOLS:: Simulation.");
console.log("This tool simulates all navigation implementations placed in /Tools/Simulation/Navigation systems");

const fs = require('fs');
const Yazur = require('./Yazur/yazur');

console.log("\nLoading Navigation systems:");
var navsystems=fs.readdirSync(`${__dirname}\\Navigation Systems`);

var sims = [];
var simsInfo = [];

function getCode(path){return fs.readFileSync(path).toString().split("\r\n")}
navsystems.forEach(sys=>{
    if(sys.startsWith("nosim_")){
        console.log(`\tSkipping ${sys}`);
        return;
    }
    var info=require(`${__dirname}\\Navigation Systems\\${sys}\\info.json`);
    console.log(`\tLoading ${info.desc}`);

    var network = new Yazur.netmgr();

    console.log("\t\tAdding yolol chips:");
    info.chips.forEach(chipCode=>{
        console.log(`\t\t\tfrom ${chipCode}`);
        new Yazur.yChip(
            getCode(`${__dirname}\\Navigation Systems\\${sys}\\${chipCode}`),
            "root",
            network
        )
    });

    for(var i=0; i<info.position.length; i++) info.position[i] = info.position[i].toLowerCase();
    for(var i=0; i<info.fields.length; i++) info.fields[i] = info.fields[i].toLowerCase();

    var allFields=info.position.concat(info.fields);
    
    var memchip = new Yazur.mChip(
        allFields,
        "root",
        network
    );
    console.log(`\t\tRegistered fields:\n\t\t\t${allFields}`);

    console.log("\t\tAdding Receivers:");
    var receivers = [];
    info.receivers.forEach(receiver=>{
        var recvrFields = [
            receiver.targetMessage,
            receiver.signalStrength,
            receiver.message,
            receiver.initialTarget
        ];
        for(var i=0; i<recvrFields.length; i++) recvrFields[i] = recvrFields[i].toLowerCase();
        receivers.push(new Yazur.recvr(
            recvrFields,
            info.transmitterSet,
            "root",
            network
        ));
        console.log(`\t\t\tadded with: [${recvrFields}]`);
    });

    sims.push({
        id:info.id,
        network,
        memchip,
        receivers,
        output: info.position,
        offsets: info.offsets
    });
    simsInfo.push(info);
    console.log(`\t\tOutput fields:\n\t\t\t${info.position}`);
});

var curcraft=craft[0];
var cstate=0;
var simdata=[];

console.log(`\nStarting Simulation of ${sims.length} systems for ${totalTicks} yolol ticks`);
for(var tick=0; tick<totalTicks; tick++){
    //console.log(`\ttick ${tick} of ${totalTicks}`);
    //check if craft state to change
    if(switchAt[cstate+1] && switchAt[cstate+1]==tick){
        cstate++
        console.log(`state update at tick ${tick}`);
        Object.keys(craft[cstate]).forEach(key=>{
            curcraft[key] = craft[cstate][key];
        });
    }
    
    var datapoint={tick, craft:JSON.parse(JSON.stringify(curcraft)), outputs:{}}
    //update each simulation & add data to current datapoint
    sims.forEach(sim=>{

        //update receiver positions
        if(sim.receivers[0]) sim.receivers[0].setPosition(curcraft.x, curcraft.y, curcraft.z);
        if(sim.receivers[1]) sim.receivers[1].setPosition(curcraft.x, curcraft.y+0.96, curcraft.z);
        if(sim.receivers[2]) sim.receivers[2].setPosition(curcraft.x, curcraft.y, curcraft.z+1.08);
        if(sim.receivers[3]) sim.receivers[3].setPosition(curcraft.x, curcraft.y+0.96, curcraft.z+1.08);
        if(sim.receivers.length>4){
            for(var i=4; i<sim.receivers.length; i++){
                sim.receivers[i].setPosition(curcraft.x, curcraft.y, curcraft.z+1.08*i);
            }
        }

        //run yolol tick
        sim.network.queueTick_random();
        sim.network.doTick();

        //add output data to datapoint
        datapoint.outputs[sim.id]=[];
        sim.output.forEach((outfield,i)=>{
            datapoint.outputs[sim.id].push(
                sim.memchip.localEnv.global[`:${outfield}`].value-(sim.offsets[i]?sim.offsets[i]:0)
            );
        });
    });

    //actually push datapoint to list
    simdata.push(datapoint);

    //Update craft position & velocity
    [..."xyz"].forEach(axis=>{
        curcraft[axis]+=curcraft[`v${axis}`]*0.2;
        curcraft[`v${axis}`]+=curcraft[`a${axis}`]*0.2;
    });
}

//write sim data to file in web_public
console.log("Simulation complete, writing data to public file");
fs.writeFileSync(`${__dirname}\\web_public\\simdata.json`,JSON.stringify({simsInfo,simdata, craftInfo:{states:craft, updates:switchAt}}));

//Launch simple express server to serve web files in web_public
var express = require('express');
app = express();
app.use('/',express.static(`${__dirname}\\web_public`));
app.listen(80);

console.log("Listening at http://localhost");
console.log("Connect with your browser to see graphed results.");