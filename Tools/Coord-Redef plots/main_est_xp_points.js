//Get magics
//GRAPHED IN ISAN SPACE (this version is edited to remove this)

//Still TODO
//  Min error transmitter positions
//  Best space transform
//    Just move newT0 -> curT0
//    Min error for all transmitters?
//    Min error for ISANv1 core transmitters?

//output from this:
/*
    [
        [1.197533992577079,9.433226500321023,-32.83637448358282,11.186132851150333],
        [207744.9537876754,-1550111.5341757017,486779.2917010114,-160699.3921157739],
        [230400.9082399713,-345153.59280138736,-41051.447758899216,43636.34392985353],
        [-140483.07030163254,103669.79684464238,799664.6982989184,-264673.5217169228]
    ]
    Xoff: -46194.76735159404
    Yoff:   1597.8966556627129
    Zoff:  -4851.161987776999
*/

var traces = [];
window.addEventListener('load',()=>{
    /*
    for(var i=0; i<8; i++){
        console.log(GDPTS[`xpT${i}`].pos);
    }*/

    var ntrace = traceTemplate_markers();
    ntrace.name = "cur acc";
    ntrace.text = [];

    for(var i=0; i<8; i++){
        ntrace.x.push(CUR.x[i]);
        ntrace.y.push(CUR.y[i]);
        ntrace.z.push(CUR.z[i]);
        ntrace.text.push(CUR.lbl[i]);
    }
    traces.push(ntrace);

    //ISAN SPACE OFFSETS (y = -y) (y = z / z = y)
    var offX = 0//CUR.x[0] - GDPTS["xpT0"].pos[0];
    var offY = 0//CUR.y[0] - GDPTS["xpT0"].pos[2];
    var offZ = 0//CUR.z[0] + GDPTS["xpT0"].pos[1];



    var ntrace = traceTemplate_markers();
    ntrace.name = "xp-space";// -> ISAN";
    //ntrace.mode = 'markers'
    ntrace.text = [];

    Object.keys(GDPTS).forEach(key=>{
        if(key.includes("xp")){
            var pos = GDPTS[key].pos;
            ntrace.x.push(pos[0] + offX);
            ntrace.y.push(pos[1] + offY);
            ntrace.z.push(pos[2] + offZ);
            ntrace.text.push(key);
        }
    });
    traces.push(ntrace);

    var choose = [1, 3, 4, 7];

    var ntrace = traceTemplate_markers();
    ntrace.name = "xp-space -> choosen";
    ntrace.text = [];

    var references = [];
    choose.forEach(tid=>{
        var pos = GDPTS[`xpT${tid}`].pos;
        console.log(CUR.lbl[tid], [pos[0],pos[1],pos[2]]);
        references.push({
            x: pos[0] + offX,
            y: pos[1] + offY,
            z: pos[2] + offZ,
            m: 0
        });
        ntrace.x.push(pos[0] + offX);
        ntrace.y.push(pos[1] + offY);
        ntrace.z.push(pos[2] + offZ);
        ntrace.text.push(CUR.lbl[tid]);
    });
    traces.push(ntrace);

    ISANv2(references);

    var layout = {margin: {
        l: 0,
        r: 0,
        b: 0,
        t: 0
    }};

    Plotly.newPlot('chart', traces, layout,{editable: false});
});

function traceTemplate_markers(){
    return {
        x: [], 
        y: [], 
        z: [],
        mode: 'markers',
        marker: {
            size: 10,
            line: {
                color: 'rgba(217, 217, 217, 0.14)',
                width: 0.5
            },
            opacity: 0.8
        },
        type: 'scatter3d'
    }
}

function ISANv2(references){
    var A = [];
    var B = [];

    var P = []; //Dist^2 of transmitters from origin

    //Build A&B from references
    references.forEach(r=>{
        A.push(
            [1, -2*r.x, -2*r.y, -2*r.z]
        );
        B.push(
            Math.pow(r.m,2) - Math.pow(r.x,2) - Math.pow(r.y,2) - Math.pow(r.z,2)
        );
        P.push(Math.pow(r.x,2) + Math.pow(r.y,2) + Math.pow(r.z,2));
    });

    //from cpp
    ////nieve solution   (for exactly 4 references)
    ////x = inv(A) . b
    ////cout<<"nieve x: \n";
    ////vector<double> pos = mult(inv(A),b);

    ////least squares solution
    ////x = inv(trans(A) . A) . trans(A) . b
    
    m = math.multiply;
    t = math.transpose;
    i = math.inv;

    var inverse = i(A);

    var m = [];

    inverse.forEach((r,i)=>{
        m[i]=[];
        r.forEach(l=>{
            m[i].push(1/l);
        })
    });
    console.log(JSON.stringify(m));

    console.log("Xoff: " + (
        P[0]/m[1][0] + P[1]/m[1][1] + P[2]/m[1][2] + P[3]/m[1][3]
    ));

    console.log("Yoff: " + (
        P[0]/m[2][0] + P[1]/m[2][1] + P[2]/m[2][2] + P[3]/m[2][3]
    ));

    console.log("Zoff: " + (
        P[0]/m[3][0] + P[1]/m[3][1] + P[2]/m[3][2] + P[3]/m[3][3]
    ));

    /*
    x  =  m(i(m(t(A),A)) , m(t(A),B));
    //console.log(x);
    return x;   //[agree, x, y, z]
    */
}