
window.addEventListener('load',()=>{
    var traces = [];
    loadJSON('./simdata.json',data=>{
        data.simsInfo.forEach(info=>{

            var trace=traceTemplate_line();
            trace.name = info.desc;
            data.simdata.forEach(dp=>{
                var output=dp.outputs[info.id];
                trace.x.push(dp.tick);
                trace.y.push(Math.sqrt(
                    Math.pow(dp.craft.x-output[0],2)+
                    Math.pow(dp.craft.y-output[1],2)+
                    Math.pow(dp.craft.z-output[2],2)
                ));
            });
            traces.push(trace);

        });

        var trace=traceTemplate_line();
        trace.name = "craft vel";
        data.simdata.forEach(dp=>{
            trace.x.push(dp.tick);
            trace.y.push(Math.sqrt(
                Math.pow(dp.craft.vx,2)+
                Math.pow(dp.craft.vy,2)+
                Math.pow(dp.craft.vz,2)
            ));
        });
        traces.push(trace);

        var layout = {
            title:"STARBASE navigation systems, error while in motion",
            xaxis:{title:"Ticks"},
            yaxis:{title:"Error",range:[0,1000]},
            shapes: [],
            annotations:[]
        };

        console.log(data.craftInfo);

        data.craftInfo.states.forEach((craft,i)=>{
            if(i==0) return;
            layout.shapes.push({
                type: 'line',
                x0: data.craftInfo.updates[i],
                y0: 0,
                x1: data.craftInfo.updates[i],
                yref: 'paper',
                y1: 1,
                line: {
                  color: 'grey',
                  width: 1.5,
                  dash: 'dot'
                },
              });
            layout.annotations.push(
                {
                    x: data.craftInfo.updates[i],
                    y: 600,
                    xref: 'x',
                    yref: 'y',
                    text: JSON.stringify(craft).replaceAll('"',''),
                    showarrow: true,
                    arrowhead: 3,
                    ax: -70,
                    ay: -70
                }
            );
        });

        console.log(layout.annotations);

        Plotly.newPlot('chart', traces, layout,{editable: false});
    });
});


function traceTemplate_line(){
    return {
        x: [], 
        y: [], 
        marker: {
            size: 10,
            line: {
                color: 'rgba(217, 217, 217, 0.14)',
                width: 0.5
            },
            opacity: 0.8
        },
        type: 'lines'
    }
}


function traceTemplate_markers(){
    return {
        x: [], 
        y: [], 
        z: [],
        mode: 'lines',
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

function loadJSON(path, success, error)
{
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function()
    {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                if (success)
                    success(JSON.parse(xhr.responseText));
            } else {
                if (error)
                    error(xhr);
            }
        }
    };
    xhr.open("GET", path, true);
    xhr.send();
}