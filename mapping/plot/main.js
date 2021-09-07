
/*
A=1000 n=1000 pr=0 sp=0 div=(9.6+2.4*pr)*n so=1-sp o=160000 e=8*o c=""
z="origin_" mr=z+"north" br=z+"south" cr=z+"east" z+="west" sm="\nS: " 
u=e*3/13 l=2*o mm=l*13/19 k=e*3/19 sl="\nsignal lost" x/=so sm=c s=c 
rr="ISAN2 :_\n     " xm="\nX: " ym="\nY: " zm="\nZ: " nn=l*13/3 
ej=16*sp h="Q" pj=14-pr b=0.5 p=1000000 :at=mr :bt=br :ct=cr :dt=z x=0 
t=p-:a t*=t i=p-:b i*=i g=p-:c g*=g f=p-:d f*=f x/=:a*:b*:c*:d goto14 
h="M" t=p-:a t*=t er=(t-el)/4 el=t x/=:a :at=br x=8 gotopj//   ISAN 
i=p-:a i*=i fr=(i-fl)/4 fl=i x/=:a :at=cr x=9 gotopj// From Collective
g=p-:a g*=g gr=(g-gl)/4 gl=g x/=:a :at=z x=10 gotopj// v2.5.2  300821
f=p-:a f*=f hr=(f-hl)/4 hl=f x/=:a :at=mr x=7 gotopj
st=:_!=c :_=rr+"\n\n   "+(:at-"origin_")+sl goto 11*(:a==0)*st
st=:_!=c :_=rr+"\n\n can't see\n receivers" goto 12*st
t+=er i+=fr g+=gr f+=hr //ISAN doc: isan.to/doc   -   Starmap: isan.to
x+=(6-x)*(x<7) xx=(t+i)/e+g/u-f/k yy=i/l-t/mm+(g+f)/nn zz=(g+f-t-i)/o
st=:_==c :_=rr+h+xm+xx/n*A+ym+yy/n*A+zm+zz/n*A+sm+s gotoej+x*so+p*st
w+=xx uu+=yy vv+=zz r=w-tu j=uu-uv v=vv-vt ej+=(ii++%3)>1 gotox
m=(r*r+j*j+v*v)^b s=m/div*A tu=w uv=uu vt=vv w=0 uu=0 vv=0 ej=16 gotox
st=:_!=c :_=rr+"\nSpeed can't run on basic chip. set sp=0" goto 18*st
//                      Alignment coming soon! Currently in beta test.
st=:_!=c :_=rr+"\n\n   ISAN2\n  OFFLINE" goto 20*st
*/

function getPoint(datastring){

    let m = datastring.split(" ");
    m = m.map(m=>parseFloat(m));

    //isan consts
    p=1000000
    o=160000; e=8*o;
    u=e*3/13; l=2*o; mm=l*13/19; k=e*3/19;
    nn=l*13/3;

    t=m[0]; t*=t;
    i=m[1]; i*=i;
    g=m[2]; g*=g;
    f=m[3]; f*=f;

    xx=(t+i)/e+g/u-f/k;
    yy=i/l-t/mm+(g+f)/nn;
    zz=(g+f-t-i)/o;

    return {xx,yy,zz}

}

function addPT(trace, pt, name){
    [..."xyz"].forEach(a=>trace[a].push(pt[`${a}${a}`]));
    if(name) trace.text.push(name);
}


function _newTrace(name){
    traces.push(traceTemplate_markers(name));
}

function _addPT(pt, name){
    [..."xyz"].forEach(a=>traces[traces.length-1][a].push(getPoint(pt)[`${a}${a}`]));
    if(name) traces[traces.length-1].text.push(name);
}

var traces = [];

var origins = [];

window.addEventListener('load',()=>{

    var trace_ssc = traceTemplate_markers("Cpjet's SSC");
    var trace_ezb = traceTemplate_markers("Cpjet's EZB");
    var trace_mkt = traceTemplate_markers("Cpjet's MKT");
    var trace_O20 = traceTemplate_markers("O20");

    DATA.forEach((origin, i)=>{ 
        if(origin.SSC=="") return;

        let pt = getPoint(origin.SSC);
        origins[i] = {name:origin.name, ssc:pt};
        addPT(trace_ssc, pt, origin.name);
        if(origin.name == "Origin 20") addPT(trace_O20, pt, "SSC");

        pt = getPoint(origin.EZB);
        origins[i].ezb = pt;
        addPT(trace_ezb, pt, origin.name);
        if(origin.name == "Origin 20") addPT(trace_O20, pt, "EZB");

        pt = getPoint(origin.Market);
        origins[i].mkt = pt;
        addPT(trace_mkt, pt, origin.name);
        if(origin.name == "Origin 20") addPT(trace_O20, pt, "MKT");

    });

    traces.push(trace_ssc);
    traces.push(trace_ezb);
    traces.push(trace_mkt);

    _newTrace("Transmit Stations");
    _addPT("97082.063 104162.813 0.75 120933.125", "origin_east");  //Yellow
    _addPT("130862.625 0.688 104163.813 97082.063", "origin_south");  //blue
    _addPT("91924.5 97082.625 120934.563 0.75", "origin_west");  //purple
    _addPT("0.75 130861.938 97082.5 91923.375", "origin_north");  //red
    _addPT("67450.813 72788.813 63234.125 61196.875", "origin_gate");

    _newTrace("EOS Gate");
    _addPT("67562.188 74581.688 61923.25 61425.188 2719.313", "Entry");
    _addPT("67673.688 74348.125 62604.625 60767.813 2498.563", "Active");

    _newTrace("Markka");
    _addPT("373118 302175 380910.438 367400.125", "Markka")

    _newTrace("Ghost");
    _addPT("192221.688 74518.063 169734.25 160978", "Relicta");
    _addPT("296498.813 196665.688 283164.875 276016.625", "Nox");


    var trace_0=traceTemplate_markers("ISAN Origin");
    [..."xyz"].forEach(a=>trace_0[a].push(0));
    traces.push(trace_0);

    traces.push(trace_O20);


    traces.forEach(trace=>{
        tmp=trace.x;    
        trace.x=trace.z;       //x=z
        tmp2=trace.y
        trace.y=tmp;           //y=x
        trace.z=tmp2           //z=y
    })

    var layout = {
        margin: {
            l: 0,
            r: 0,
            b: 0,
            t: 0
        },
        scene:{
            xaxis: {
                title: "Z"
            },
            yaxis: {
                title: "X"
            },
            zaxis: {
                title: "Y"
            }
        }
    };

    Plotly.newPlot('chart', traces, layout,{editable: false});


    function sub(a,b){
        return {xx:a.xx-b.xx, yy:a.yy-b.yy, zz:a.zz-b.zz};
    }

    function mag(a){
        return Math.sqrt(Math.pow(a.xx,2)+Math.pow(a.yy,2)+Math.pow(a.zz,2));
    }

    function vstr(a){
        return `(${Math.round(a.xx)}, ${Math.round(a.yy)}, ${Math.round(a.zz)})[${Math.round(mag(a))}]`
    }

    origins.forEach((origin, i)=>{
        
        //ezb -> ssc
        let ezbTssc = sub(origin.ssc, origin.ezb);
        //ezb -> mkt
        let ezbTmkt = sub(origin.mkt, origin.ezb);

        console.log(`${origin.name}: ezb -> ssc: ${vstr(ezbTssc)} ezb -> mkt: ${vstr(ezbTmkt)}`)

    })


});

function traceTemplate_markers(name){
    return {
        x: [], 
        y: [], 
        z: [],
        text:[],
        mode: 'markers',
        name,
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

