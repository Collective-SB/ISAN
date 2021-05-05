function testTemplate(name, yolol_chip, receivers){
    return {
        name,

        yolol_chips: [
            yolol_chip//["src", "core", "mono.yolol"]
        ],

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
            max_error: 0
        },

        preTick: ()=>{},
        postTick: ()=>{},
        error: (test, net, memchip, receivers, craft, tick)=>{

            let real_pos = [craft.x, craft.y, craft.z];
            let calc_pos = [memchip.localEnv.global[":x"].value, memchip.localEnv.global[":y"].value, memchip.localEnv.global[":z"].value]

            let error = 0;
            for(let i=0; i<3; i++) error += Math.pow((real_pos[i] - calc_pos[i]),2);
            error = Math.sqrt(error);

            if(error > test.state.max_error){
                test.state.max_error = error;
            }

            //console.log(JSON.stringify(real_pos), JSON.stringify(calc_pos), error);

            //REM: ignore startup error
            //if(error>20 && tick>50) console.warn(`    Error over 20 @ tick ${tick} (${error})`);
            if(error>500 && tick>50) return `Excess error: ${error}`;
            return false;
        },
        end: ()=>{
            console.log(`    Max error was ${test.state.max_error}`);
        }
    }
}


module.exports = [
    testTemplate("mono", ["src", "core", "mono.yolol"],[
        {targetMessage: "t", signalStrength: "a", message: "m", initialTarget: ""}
    ]),
    testTemplate("quad", ["src", "core", "quad.yolol"],[
        {targetMessage: "at", signalStrength: "a", message: "am", initialTarget: ""},
        {targetMessage: "bt", signalStrength: "b", message: "bm", initialTarget: ""},
        {targetMessage: "ct", signalStrength: "c", message: "cm", initialTarget: ""},
        {targetMessage: "dt", signalStrength: "d", message: "dm", initialTarget: ""}
    ])
]