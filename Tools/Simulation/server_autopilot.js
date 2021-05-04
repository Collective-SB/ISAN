const fs = require('fs');
const path = require('path');
const Yazur = require('./Yazur/yazur');

const express = require('express');
var app = express();
const srv = require('http').Server(app);
const io = require('socket.io')(srv);

app.use('/',express.static(path.join(__dirname,"web_public")));

app.get('/',(req,res)=>{
    res.redirect('/index_auto.html');
});



function getCode(path){return fs.readFileSync(path).toString().split("\r\n")}

function loadNavSystem(net, sys){
    var info=require(path.join(__dirname,"Navigation systems",sys,"info.json"));
    console.log(`\tLoading ${info.desc}`);

    console.log("\t\tAdding yolol chips:");
    var ychips=[]
    info.chips.forEach(chipCode=>{
        console.log(`\t\t\tfrom ${chipCode}`);
        ychips.push(new Yazur.yChip(
            getCode(path.join(__dirname,"Navigation systems",sys,chipCode)),
            "root",
            net
        ));
    });

    for(var i=0; i<info.position.length; i++) info.position[i] = info.position[i].toLowerCase();
    for(var i=0; i<info.fields.length; i++) info.fields[i] = info.fields[i].toLowerCase();

    var allFields=info.position.concat(info.fields);
    
    var memchip = new Yazur.mChip(
        allFields,
        "root",
        net
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
            net
        ));
        console.log(`\t\t\tadded with: [${recvrFields}]`);
    });

    return {receivers,memchip,ychips};
}

function setAllPos(pos, recvs){
    if(recvs[0]) recvs[0].setPosition(pos.x, pos.y, pos.z);
    if(recvs[1]) recvs[1].setPosition(pos.x, pos.y+0.96, pos.z);
    if(recvs[2]) recvs[2].setPosition(pos.x, pos.y, pos.z+1.08);
    if(recvs[3]) recvs[3].setPosition(pos.x, pos.y+0.96, pos.z+1.08);
}

io.on('connection', (soc) => {
    
    console.log('a user connected');

    //Sim setup
    var net = new Yazur.netmgr();
    var dev = loadNavSystem(net, "ISANv2 quad nopred");
    var dev2 = loadNavSystem(net, "ISANv2 quad nopred copy");

    var craft = {
        x:0, y:0, z:0,              //position
        vx:10, vy:0, vz:0,          //vel
        rux:0, ruy:0, ruz:1,        // real up
        rlx:0, rly:0, rlz:0         // real left
    }

    //get new left vector == up X vel   [a b c] X [d e f] = [bf-ce cd-af ae-bd]
    craft.rlx= craft.ruy*craft.vz - craft.ruz*craft.vy // craft.rux craft.ruy craft.ruz X craft.vx craft.vy craft.vz
    craft.rly= craft.ruz*craft.vx - craft.rux*craft.vz
    craft.rlz= craft.rux*craft.vy - craft.ruy*craft.vx

    //normalise new left vector
    var mag = Math.sqrt(Math.pow(craft.rlx,2)+Math.pow(craft.rly,2)+Math.pow(craft.rlz,2));
    craft.rlx/=mag; craft.rly/=mag; craft.rlz/=mag;

    console.log("craft init:", craft);

    var dest = {x:-100000, y:-100000, z:-100000}

    setAllPos(craft, dev.receivers);
    setAllPos({x:craft.x+craft.rlx*5,y:craft.y+craft.rly*5,z:craft.z+craft.rlz*5}, dev2.receivers);
    //setAllPos(craft, dev2.receivers);
    for(var i=0; i<100; i++){   //let ISAN stableise
        net.queueTick_random();
        net.doTick();
    }

    //add autopilot chips
    var apyc = new Yazur.yChip(
        getCode(path.join(__dirname,"Autopilot","AUTOv0.4 dc.yolol")),
        "root",
        net
    );

    var apmc = new Yazur.mChip(
        ["dx","dy","dz","r", "pitch", "yaw", "mpitch", "myaw"],
        "root",
        net
    );

    net.broadcast("root",":dx",{type: 3, subtype: 1, value:dest.x});
    net.broadcast("root",":dy",{type: 3, subtype: 1, value:dest.y});
    net.broadcast("root",":dz",{type: 3, subtype: 1, value:dest.z});
    //net.broadcast("root",":r",{type: 3, subtype: 1, value:10});
    
    soc.on('setpy', (data)=>{
        net.broadcast("root",":mpitch",{type: 3, subtype: 1, value:data.pitch});
        net.broadcast("root",":myaw",{type: 3, subtype: 1, value:data.yaw});
    });

    soc.on('update', (num=1)=>{

        var craftStates=[];
        var i=0;
        for(var upnum=0; upnum<num; upnum++){
            do{
                [..."xyz"].forEach(axis=>{craft[axis]+=craft[`v${axis}`];});

                setAllPos(craft, dev.receivers);
                setAllPos({x:craft.x+craft.rlx*5,y:craft.y+craft.rly*5,z:craft.z+craft.rlz*5}, dev2.receivers);

                net.queueTick_random();
                net.doTick();
                
                
                //TODO:: check :pitch & :yaw, then apply & zero

                var outGlobals={pitch:":pitch", yaw:":yaw"}

                var vel = Math.sqrt(Math.pow(craft.vx,2)+Math.pow(craft.vy,2)+Math.pow(craft.vz,2));
                var pitch = parseFloat(apyc.localEnv.global[outGlobals.pitch].value);
                var yaw = parseFloat(apyc.localEnv.global[outGlobals.yaw].value);

                if(pitch!=0){
                    //if pitch, add small component of up vector to vel && add same component to up vector but at 90deg
                    craft.vx+=pitch*craft.rux/10; 
                    craft.vy+=pitch*craft.ruy/10; 
                    craft.vz+=pitch*craft.ruz/10;

                    //Get new up vector == vel X left   [a b c] X [d e f] = [bf-ce cd-af ae-bd]
                    craft.rux = craft.vy*craft.rlz - craft.vz*craft.rly//craft.vx craft.vy craft.vz  X  craft.rlx craft.rly craft.rlz
                    craft.ruy = craft.vz*craft.rlx - craft.vx*craft.rlz
                    craft.ruz = craft.vx*craft.rly - craft.vy*craft.rlx

                    //normalise new up vector
                    var mag = Math.sqrt(Math.pow(craft.rux,2)+Math.pow(craft.ruy,2)+Math.pow(craft.ruz,2));
                    craft.rux/=mag; craft.ruy/=mag; craft.ruz/=mag;
                    //console.log("done pitch", craft, pitch);
                } else if(yaw!=0){
                    //if yaw, add small component of left vector to vel
                    craft.vx+=yaw*craft.rlx/10; 
                    craft.vy+=yaw*craft.rly/10; 
                    craft.vz+=yaw*craft.rlz/10;

                    //get new left vector == up X vel   [a b c] X [d e f] = [bf-ce cd-af ae-bd]
                    craft.rlx= craft.ruy*craft.vz - craft.ruz*craft.vy // craft.rux craft.ruy craft.ruz X craft.vx craft.vy craft.vz
                    craft.rly= craft.ruz*craft.vx - craft.rux*craft.vz
                    craft.rlz= craft.rux*craft.vy - craft.ruy*craft.vx

                    //normalise new left vector
                    var mag = Math.sqrt(Math.pow(craft.rlx,2)+Math.pow(craft.rly,2)+Math.pow(craft.rlz,2));
                    craft.rlx/=mag; craft.rly/=mag; craft.rlz/=mag;
                    //console.log("done yaw", craft, yaw);
                }

                //get craft back to same speed after direction change.
                var newvel = Math.sqrt(Math.pow(craft.vx,2)+Math.pow(craft.vy,2)+Math.pow(craft.vz,2));
                craft.vx/=newvel/vel;
                craft.vy/=newvel/vel;
                craft.vz/=newvel/vel;

                apyc.localEnv.global[outGlobals.pitch].value=0;
                apyc.localEnv.global[outGlobals.yaw].value=0;

                craftStates.push({
                    craft:JSON.parse(JSON.stringify(craft)),
                    memchip:JSON.parse(JSON.stringify(dev.memchip.localEnv.global)),
                    apyc:JSON.parse(JSON.stringify(apyc.localEnv))
                });

                i++;
            } while(apyc.localEnv.nextLine!=1);
        }
        
        soc.emit('update',{states:craftStates,dest});
    });

    //add update request listener

});

srv.listen(80);
console.log("Listening at http://localhost/index_auto.html");
console.log("Connect with your browser to see graphed results.");