const ISAN = {
    preCalc:(refs)=>{   //refs=[{x:,y:,z:},...]
        var A=[];
        var B=[];
        for(var i=0; i<refs.length; i++){
            A[i]=[1, -2*refs[i].x, -2*refs[i].y, -2*refs[i].z];
            B[i]=Math.pow(refs[i].x,2) + Math.pow(refs[i].y,2) + Math.pow(refs[i].z,2);
        }
        var At;
        if(refs.length!=4){
            At = ISAN.math.trans(A);
            A = ISAN.math.mult(At, A);
        }
        A=ISAN.math.inv(A);
        if(refs.length!=4) A = ISAN.math.mult(A, At);
        return {A, B};
    },
    getPoint_preCalc:(precalc, distances)=>{    //distances=[{d:},...] || [d,...]
        if(distances.length != precalc.B.length) return 0;
        var S=[]
        if(typeof distances[0] === 'object'){
            for(var i=0; i<distances.length; i++){
                S[i]=[Math.pow(distances[i].d,2)-precalc.B[i]];
            }
        } else {
            for(var i=0; i<distances.length; i++){
                S[i]=[Math.pow(distances[i],2)-precalc.B[i]];
            }
        }
        
        var X = ISAN.math.mult(precalc.A, S);
        return {d:X[0][0], x:X[1][0], y:X[2][0], z:X[3][0]}
    },
    getPoint:(refs)=>{  //refs=[{x:,y:,z:,d:},...]
        return ISAN.getPoint_preCalc(ISAN.preCalc(refs), refs);
    },
    math:{
        inv:(M)=>{
            if(M.length != M[0].length){return 0;}
            var i=0, ii=0, j=0, dim=M.length, e=0, t=0;
            var I = [], C = [];
            for(i=0; i<dim; i++){
                I[i]=[]; C[i]=[];
                for(j=0; j<dim; j++){
                    I[i][j]=i==j?1:0;
                    C[i][j]=M[i][j];
                }
            }
            for(i=0; i<dim; i+=1){
                e = C[i][i];
                if(e==0){
                    for(ii=i+1; ii<dim; ii+=1){
                        if(C[ii][i] != 0){
                            for(j=0; j<dim; j++){
                                e=C[i][j]; C[i][j]=C[ii][j]; C[ii][j]=e;     
                                e=I[i][j]; I[i][j]=I[ii][j]; I[ii][j]=e;      
                            }
                            break;
                        }
                    }
                    e = C[i][i];
                    if(e==0){return 0;}
                }
                for(j=0; j<dim; j++){
                    C[i][j] = C[i][j]/e;
                    I[i][j] = I[i][j]/e;
                }
                for(ii=0; ii<dim; ii++){
                    if(ii==i){continue;}
                    e = C[ii][i];
                    for(j=0; j<dim; j++){
                        C[ii][j] -= e*C[i][j];
                        I[ii][j] -= e*I[i][j];
                    }
                }
            }
            return I;
        },
        mult:(A, B)=>{ //M x N   M x N
            if(A[0].length != B.length) return 0;
            var C=[];
            for(var i=0; i<A.length; i++){
                C[i]=[];
                for(var j=0; j<B[0].length; j++){
                    C[i][j]=0;
                    for(var k=0; k<B.length; k++){
                        C[i][j]+= A[i][k]*B[k][j];
                    }
                }
            }
            return C;
        },
        trans:(M)=>{
            if(!M || !M[0]) return 0;
            var C=[];
            for(var i=0; i<M[0].length; i++){
                C[i]=[];
                for(var j=0; j<M.length; j++){
                    C[i][j]=M[j][i];
                }
            }
            return C;
        },
        randomPT:(l=1000)=>({x:Math.random()*l, y:Math.random()*l, z:Math.random()*l}),
        mag:(v)=>(Math.sqrt(Math.pow(v.x,2)+Math.pow(v.y,2)+Math.pow(v.z,2))),
        ABvect:(A,B)=>({x:B.x-A.x, y:B.y-A.y, z:B.z-A.z}),
        dist:(A,B)=>(ISAN.math.mag(ISAN.math.ABvect(A,B)))
    },
    test:(dims=[4, 5, 6, 10, 20], testCount=3, doPrecalc=false)=>{
        const {performance}=require('perf_hooks');
        console.log("Running ISAN.js test!");
        dims.forEach(refN=>{
            console.log(`\t> ${refN} refs`);
            var refs=[]; var precalc=0;
            var TstartTime = performance.now();
            for(var test=0; test<testCount; test++){
                var target = ISAN.math.randomPT();

                if(!doPrecalc) refs=[];
                for(var i=0; i<refN; i++){
                    if(refs.length<refN) refs.push(ISAN.math.randomPT());
                    refs[i]["d"] = ISAN.math.dist(refs[i], target);
                }
                var result;
                var startTime = performance.now();
                if(doPrecalc){
                    if(precalc==0) precalc=ISAN.preCalc(refs);
                    result = ISAN.getPoint_preCalc(precalc,refs);
                } else {
                    result = ISAN.getPoint(refs);
                }
                var endTime = performance.now();

                var dist = ISAN.math.dist(result, target);
                var disagreement = Math.pow(ISAN.math.mag(result),2) - result.d;
                //console.log(`\t\t> target:${JSON.stringify(target)}, result: ${JSON.stringify(result)}`);
                console.log(`\t\t> took:${endTime-startTime}ms Error:${dist}, Disagree:${disagreement}`);
                if(dist>1){
                    console.log(`\t\t\t> FAILED: high error. May be _extremely_ unlucky case where all refs are coplanar? (or just broken code.)`);
                    console.log(`\t\t\t\t Target: ${JSON.stringify(target)}`);
                    console.log(`\t\t\t\t Result: ${JSON.stringify(result)}`);
                    console.log(`\t\t\t\t Refs:`);
                    refs.forEach(ref=>{
                        console.log(`\t\t\t\t\t ${JSON.stringify(ref)}`);
                    });
                    debugger;
                    return;
                }
            }
            var TendTime = performance.now();
            console.log(`\t\t> all took:${TendTime-TstartTime}ms`);
        })
    },
    logMagics:(precalc)=>{
        var magicRefs = [[],
            [..."efghi"],
            [..."jklmn"],
            [..."opqrs"]
        ]

        for(var i=1; i<4; i++){
            var str = "";
            for(var j=0; j<4; j++){
                str+= magicRefs[i][j]+"="+Math.round(1000/precalc.A[i][j])/1000 + " ";
            }
            var tot = 0;
            for(var j=0; j<4; j++){
                tot+=precalc.B[j]*precalc.A[i][j];
            }
            str+= magicRefs[i][4]+"="+Math.round(tot*1000)/1000;
            console.log(str);
        }
    }
}

//cylon test
/*
e=455274.298 f=182188.885 g=-626597.518 h=-164220.701 i=-54729.984
j=304130.95 k=-215796.666 l=-208635.978 m=162893.729 n=-65910.885
o=-173560.932 p=251862.592 q=-383695.045 r=227402.822 s=-73056.663
a=:d0*:d0 b=:d1*:d1 c=:d2*:d2 d=:d3*:d3 zz=a/o+b/p+c/q+d/r
:x=a/e+b/f+c/g+d/h-i :y=a/j+b/k+c/l+d/m-n :z=zz-s :done=1 goto 4
*/

var refs = [
    {x:28315.983, y:14274.694, z:92145.269},
    {x:19522.454, y:53912.719, z:24633.070},
    {x:5817.744,  y:97945.275, z:82659.224},
    {x:82188.145, y:28074.805, z:33777.522}
]

var point = {x:74999.741, y:52471.069 , z:45148.905};

for(var i=0; i<4; i++){
    var dist = ISAN.math.dist(refs[i], point);
    console.log(`:d${i}=${dist}`);
    refs[i]["d"]=dist;
}

console.log()
console.log(ISAN.math.dist(ISAN.getPoint(refs), point));

ISAN.logMagics(ISAN.preCalc(refs));

console.log();
