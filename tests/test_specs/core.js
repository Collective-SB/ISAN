function testTemplate(name, yolol_chip, receivers){
    return {
        name,

        yolol_chips: [{
            src: yolol_chip,
        }],

        fields: [
            "X", "Y", "Z"
        ],

        receivers,

        transmitters: require('../transmitter sets/V2'),

        simulation: {
            craft_states: [
                {x:0, y:0, z:0, vx:0, vy:0, vz:0, ax:0, ay:0, az:0},    //initial state
                {ax:20, ay:20, az:20},                                  //update acceleration to (20,20,20)
                {ax:0, ay:0, az:0},                                     //stop accelerating
                {ax:-20, ay:-20, az:-20},
                {ax:0, ay:0, az:0},

                {vx:10, vy:0, vz:0}
            ],
            timing: [0, 50, 75, 320, 345, 1000],
            ticks: 10000
        },

        state: {
            max_error: 0,
            failed: false
        },

        start: ()=>{

        },
        preTick: ({receivers, craft})=>{
            receivers[0].setPosition(craft.x, craft.y, craft.z);
            if(receivers[1]) receivers[1].setPosition(craft.x, craft.y+0.96, craft.z);
            if(receivers[2]) receivers[2].setPosition(craft.x, craft.y, craft.z+1.08);
            if(receivers[3]) receivers[3].setPosition(craft.x, craft.y+0.96, craft.z+1.08);
            return false;
        },
        postTick: ({test, memchip, craft, tick})=>{

            let real_pos = [craft.x, craft.y, craft.z];
            let calc_pos = [memchip.localEnv.global[":x"].value, memchip.localEnv.global[":y"].value, memchip.localEnv.global[":z"].value]

            let error = 0;
            for(let i=0; i<3; i++) error += Math.pow((real_pos[i] - calc_pos[i]),2);
            error = Math.sqrt(error);

            if(error > test.state.max_error && tick>50){
                test.state.max_error = error;
            }

            //console.log(JSON.stringify(real_pos), JSON.stringify(calc_pos), error);

            //REM: ignore startup error
            //if(error>20 && tick>50) console.warn(`    Error over 20 @ tick ${tick} (${error})`);
            if(error>500 && tick>50){
                test.state.failed = true;
                return `Excess error: ${error}`;
            }
            return false;
        },
        end: ({test})=>{
            console.log(`Max error was ${test.state.max_error}`);
            return test.state.failed;
        }
    }
}


module.exports = [
    testTemplate("mono", ["core", "mono.yasm"],[
        {targetMessage: "at", signalStrength: "a", message: "am", initialTarget: ""}
    ]),
    testTemplate("quad", ["core", "quad.yasm"],[
        {targetMessage: "at", signalStrength: "a", message: "am", initialTarget: ""},
        {targetMessage: "bt", signalStrength: "b", message: "bm", initialTarget: ""},
        {targetMessage: "ct", signalStrength: "c", message: "cm", initialTarget: ""},
        {targetMessage: "dt", signalStrength: "d", message: "dm", initialTarget: ""}
    ])
]