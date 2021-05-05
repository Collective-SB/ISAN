var IO;

function update(num=1){
    IO.emit('update',num);
}

var template3d=(name,scene=1)=>({
    x:[],
    y:[],
    z:[],
    mode: "lines",
    type: "scatter3d", 
    name, 
    scene:`scene${scene}`,
});

window.addEventListener('load',()=>{
    IO=io();
    //TODO initiate graphs
    var m3d=document.getElementById('real3d');
    var sovs3d=document.getElementById('vspace3d')

    var craftPos = template3d("Real craft position");
    var isanPos = template3d("Isan pos");

    var ornDest={
        x:[], y:[], type:"scatter", mode:"lines+markers", name:"dest [orn]", marker:{
            color:[]
        }
    };
    //Plotly.newPlot(m3d,[craftPos, isanPos], {title: 'Realspace 3D'});

    //add update listener
    IO.on('update',(data)=>{
        //console.log(data);
        console.log("Got updated sim");

        var apyc = data.states[data.states.length-1].apyc;
        var v=(s)=>(apyc.vars[s].value);
        console.log(`latest move: lp:${v('lp')}, ly:${v('ly')}`);
        //console.log(`dv(x): ${v('dv')}, dw(y): ${v('dw')}`);                            //direction(u), left(v), up(w)
        //console.log(`r:${apyc.global[':r'].value}, dr:${v('dr')}, atan2:${v('err')}`);

        data.states.forEach(state=>{
            //console.log(state);
            [..."xyz"].forEach(axis=>{
                craftPos[axis].push(state.craft[axis])
                isanPos[axis].push(state.memchip[`:${axis}`].value);
            });
        })

        var dest=template3d("destination");
        dest.mode="markers";
        [..."xyz"].forEach(axis=>{dest[axis][0] = data.dest[axis]});
        
        //Plotly.newPlot(m3d,[craftPos, isanPos, dest], {title: 'Real space'});

        

        console.log(apyc, `lp:${v("lp")}, ly:${v("ly")}`);
        //console.log("Better targets: (pitch, yaw)",v("wt"), v("vt"));

        var dirVect = template3d('dir',2);
        var destVect = template3d('dest',2);
        var upVect = template3d('up',2);
        var destSOVect = template3d('dest [SO]',2);

        var constructedLeft = template3d('constr left',2);

        var vects = [dirVect, destVect, upVect, destSOVect, constructedLeft];

        [..."xyz"].forEach(axis=>{
            vects.forEach(vect=>vect[axis].push(0));
        });

        

        dirVect.x.push(v("x"));
        dirVect.y.push(v("y"));
        dirVect.z.push(v("z"));

        destVect.x.push(v("m"));
        destVect.y.push(v("n"));
        destVect.z.push(v("o"));

        upVect.x.push(v("a"));
        upVect.y.push(v("b"));
        upVect.z.push(v("c"));

        destSOVect.x.push(v("u"));
        destSOVect.y.push(v("v"));
        destSOVect.z.push(v("w"));


        constructedLeft.x.push(v("b")*v("z") - v("c")*v("y"));
        constructedLeft.y.push(v("c")*v("x") - v("z")*v("a"));
        constructedLeft.z.push(v("y")*v("a") - v("x")*v("b"));

        
        
        ornDest.x.push(v("v"));
        ornDest.y.push(v("w"));
        ornDest.marker.color.push(v("u")>0);
        Plotly.newPlot(sovs3d, [ornDest], {title:"test"});


        var data = [craftPos, isanPos, dest, ...vects];

        //console.log(data);

     

        Plotly.react(m3d,data, {
            height:500,
            scene1: {
                domain: {
                    x: [0.0, 0.5],
                    y: [0.0, 5.0]
                },
            },
            scene2: {
                domain: {
                    x: [0.5, 1.0],
                    y: [0.0, 5.0]
                }
            },
            scene3: {
                x: [0.0, 0.5],
                y: [0.5, 1.0]
            }
        });
        //Plotly.newPlot(sovs3d, vects, {title:'vspace'})

    });

    //ask for first update
    IO.emit('update');

    //add a button listener (on button, do tick (or a full auto loop, idk))
});