#include "ISAN.h"


double ISAN2_displacement_magic(double realX, double realY, double realZ, struct V2Magic* v2m){

    ynum A = getTransmitterSignal(v2m->T[0], realX, realY, realZ);
    ynum B = getTransmitterSignal(v2m->T[1], realX, realY, realZ);
    ynum C = getTransmitterSignal(v2m->T[2], realX, realY, realZ);
    ynum D = getTransmitterSignal(v2m->T[3], realX, realY, realZ);

    if(A.asd()<0 || B.asd()<0 || C.asd()<0 || D.asd()<0){   //A transmitter is out of range
        return -1;
    }

    ynum y=999999, dA=y-A, dB=y-B, dC=y-C, dD=y-D;
    dA*=dA; dB*=dB; dC*=dC; dD*=dD;

    //ynum X= dA/:XA + dB/:XB + dC/:XC + dD/:XD - :XE
    ynum X= dA/v2m->X[0] + dB/v2m->X[1]  + dC/v2m->X[2]  + dD/v2m->X[3]  - v2m->X[4];
    
    //:Y=dA/:YA+dB/:YB+dC/:YC+dD/:YD-:YE
    //:Z=dA/:ZA+dB/:ZB+dC/:ZC+dD/:ZD-:ZE
    ynum Y= dA/v2m->Y[0] + dB/v2m->Y[1]  + dC/v2m->Y[2]  + dD/v2m->Y[3]  - v2m->Y[4];
    ynum Z= dA/v2m->Z[0] + dB/v2m->Z[1]  + dC/v2m->Z[2]  + dD/v2m->Z[3]  - v2m->Z[4];

    double deviation = sqrt(
        pow(realX-X.asd(),2)+
        pow(realY-Y.asd(),2)+
        pow(realZ-Z.asd(),2)
    );
    return deviation;

}

void calculateV2Magics(struct V2Magic* v2m){


double X1, Y1, Z1;
double X2, Y2, Z2;
double X3, Y3, Z3;
double X4, Y4, Z4;

getTransmitterCoords(v2m->T[0],X1,Y1,Z1);
getTransmitterCoords(v2m->T[1],X2,Y2,Z2);
getTransmitterCoords(v2m->T[2],X3,Y3,Z3);
getTransmitterCoords(v2m->T[3],X4,Y4,Z4);

//goto 1+(:rst==1)
//A=:X1-:X2 z=:Y1-:Y2 u=:Z1-:Z2 r=:X1-:X3 e=:Y1-:Y3 t=:Z1-:Z3 h=:X1-:X4
double A=X1-X2, z=Y1-Y2, u=Z1-Z2, r=X1-X3, e=Y1-Y3, t=Z1-Z3, h=X1-X4;

//i=:Y1-:Y4 C=:Z1-:Z4 da=A*e*C-A*t*i-z*r*C+z*t*h+u*r*i-u*e*h n=-0.5
double i=Y1-Y4, C=Z1-Z4, da=A*e*C-A*t*i-z*r*C+z*t*h+u*r*i-u*e*h, n=-0.5;

//:XA=m  z=:Y2 u=:Z2 e=:Y3 t=:Z3 i=:Y4 C=:Z4 m=9223372036854775.807
z=Y2; u=Z2; e=Y3; t=Z3; i=Y4; C=Z4;

//:YA=m  A=n   r=n   h=n   :XA= da/(A*e*C-A*t*i-z*r*C+z*t*h+u*r*i-u*e*h)
A=n;   r=n;   h=n;
v2m->X[0]= da/(A*e*C-A*t*i-z*r*C+z*t*h+u*r*i-u*e*h);

//:ZA=m  z=:X2 e=:X3 i=:X4 :YA=-da/(A*e*C-A*t*i-z*r*C+z*t*h+u*r*i-u*e*h)
z=X2; e=X3; i=X4;
v2m->Y[0]=-da/(A*e*C-A*t*i-z*r*C+z*t*h+u*r*i-u*e*h);

//:ZB=m  u=:Y2 t=:Y3 C=:Y4 :ZA= da/(A*e*C-A*t*i-z*r*C+z*t*h+u*r*i-u*e*h)
u=Y2; t=Y3; C=Y4;
v2m->Z[0]= da/(A*e*C-A*t*i-z*r*C+z*t*h+u*r*i-u*e*h);

//:YB=m  z=:X1 u=:Y1       :ZB=-da/(A*e*C-A*t*i-z*r*C+z*t*h+u*r*i-u*e*h)
z=X1; u=Y1;     
v2m->Z[1]=-da/(A*e*C-A*t*i-z*r*C+z*t*h+u*r*i-u*e*h);

//:XB=m  u=:Z1 t=:Z3 C=:Z4 :YB= da/(A*e*C-A*t*i-z*r*C+z*t*h+u*r*i-u*e*h)
u=Z1; t=Z3; C=Z4;
v2m->Y[1]= da/(A*e*C-A*t*i-z*r*C+z*t*h+u*r*i-u*e*h);

//       z=:Y1 e=:Y3 i=:Y4 :XB=-da/(A*e*C-A*t*i-z*r*C+z*t*h+u*r*i-u*e*h)
z=Y1; e=Y3; i=Y4;
v2m->X[1]=-da/(A*e*C-A*t*i-z*r*C+z*t*h+u*r*i-u*e*h);

//:XC=m  e=:Y2 t=:Z2 //ISAN 2.0:InvEng_2.3b               THE COLLECTIVE
e=Y2; t=Z2;

//:YC=m  A=n   r=n   h=n   :XC= da/(A*e*C-A*t*i-z*r*C+z*t*h+u*r*i-u*e*h)
A=n;   r=n;   h=n;   
v2m->X[2]= da/(A*e*C-A*t*i-z*r*C+z*t*h+u*r*i-u*e*h);

//:ZC=m  z=:X1 e=:X2 i=:X4 :YC=-da/(A*e*C-A*t*i-z*r*C+z*t*h+u*r*i-u*e*h)
z=X1; e=X2; i=X4;
v2m->Y[2]=-da/(A*e*C-A*t*i-z*r*C+z*t*h+u*r*i-u*e*h);

//:ZD=m  u=:Y1 t=:Y2 C=:Y4 :ZC= da/(A*e*C-A*t*i-z*r*C+z*t*h+u*r*i-u*e*h)
u=Y1; t=Y2; C=Y4; 
v2m->Z[2]= da/(A*e*C-A*t*i-z*r*C+z*t*h+u*r*i-u*e*h);

//:YD=m  i=:X3 C=:Y3       :ZD=-da/(A*e*C-A*t*i-z*r*C+z*t*h+u*r*i-u*e*h)
i=X3; C=Y3;
v2m->Z[3]=-da/(A*e*C-A*t*i-z*r*C+z*t*h+u*r*i-u*e*h);

//:XD=m  u=:Z1 t=:Z2 C=:Z3 :YD= da/(A*e*C-A*t*i-z*r*C+z*t*h+u*r*i-u*e*h)
u=Z1; t=Z2; C=Z3;
v2m->Y[3]= da/(A*e*C-A*t*i-z*r*C+z*t*h+u*r*i-u*e*h);

//       z=:Y1 e=:Y2 i=:Y3 :XD=-da/(A*e*C-A*t*i-z*r*C+z*t*h+u*r*i-u*e*h)
z=Y1; e=Y2; i=Y3;
v2m->X[3]=-da/(A*e*C-A*t*i-z*r*C+z*t*h+u*r*i-u*e*h);

//P1=:X1^2+:Y1^2+:Z1^2 P2=:X2^2+:Y2^2+:Z2^2 P3=:X3^2+:Y3^2+:Z3^2
double P1=X1*X1+Y1*Y1+Z1*Z1, P2=X2*X2+Y2*Y2+Z2*Z2, P3=X3*X3+Y3*Y3+Z3*Z3;

//P4=:X4^2+:Y4^2+:Z4^2 :XE=P1/:XA+P2/:XB+P3/:XC+P4/:XD
double P4=X4*X4+Y4*Y4+Z4*Z4;
v2m->X[4]=P1/v2m->X[0]+P2/v2m->X[1]+P3/v2m->X[2]+P4/v2m->X[3];

//:YE=P1/:YA+P2/:YB+P3/:YC+P4/:YD :ZE=P1/:ZA+P2/:ZB+P3/:ZC+P4/:ZD :rst=0
v2m->Y[4]=P1/v2m->Y[0]+P2/v2m->Y[1]+P3/v2m->Y[2]+P4/v2m->Y[3];
v2m->Z[4]=P1/v2m->Z[0]+P2/v2m->Z[1]+P3/v2m->Z[2]+P4/v2m->Z[3];

}


double ISAN2_displacement(double realX, double realY, double realZ){

    //define "magic numbers"
    ynum t=999999, e=39665.376, f=-e, g=-t*t*t, h=g, i=22.057, j=214589.611,
    k=-68626.152, l=100891.412, m=g, n=23012.886, o=-2820.507, p=-4787.428,
    q=-16480.662, r=1602.298, s=-216741.039;
    
    ynum A = getTransmitterSignal(0, realX, realY, realZ);
    ynum B = getTransmitterSignal(1, realX, realY, realZ);
    ynum C = getTransmitterSignal(2, realX, realY, realZ);
    ynum D = getTransmitterSignal(3, realX, realY, realZ);

    if(A.asd()<0 || B.asd()<0 || C.asd()<0 || D.asd()<0){   //A transmitter is out of range
        return -1;
    }

    //a=t-:A b=t-:B c=t-:C d=t-:D a*=a b*=b c*=c d*=d
    ynum a=t-A, b=t-B, c=t-C, d=t-D; a*=a; b*=b; c*=c; d*=d;

    //X=a/e+b/f+c/g+d/h-i Y=a/j+b/k+c/l+d/m-n Z=a/o+b/p
    //:I=:X :J=:Y :K=:Z :X=X :Y=Y :Z=Z+c/q+d/r-s goto2/((a<t+b<t+c<t+d<t)>3)
    ynum X=a/e+b/f+c/g+d/h-i, Y=a/j+b/k+c/l+d/m-n, Z=a/o+b/p+c/q+d/r-s;

    //std::cout << "pos:" <<std::to_string(X.asd())<<", " <<std::to_string(Y.asd())<<", "<<std::to_string(Z.asd()) << "\n";

    
    double deviation = sqrt(
        pow(realX-X.asd(),2)+
        pow(realY-Y.asd(),2)+
        pow(realZ-Z.asd(),2)
    );
    return deviation;
}

double ISAN1_displacement(double realX, double realY, double realZ){
    //a=19832.688 b=29157.219 c=-50445.701 d=9472.525 e=-4904.478 f=-801.149
    ynum a=19832.688, b=29157.219, c=-50445.701, d=9472.525, e=-4904.478, f=-801.149;
    //:M1="station_hq_imperial_a" :M2="station_hq_kingdom_a"
    //:M3="station_proving_grounds" :M4="station_capital_imperial_a"
    //er="\nX:Loss\nY:of\nZ:Signal" ax="\nX:" ay="\nY:" az="\nZ:" o=10^6-1
    //ox=-9938.401 oy=4904.714 oz=0
    ynum ox=-9938.401, oy=4904.714, oz=0, o=999999;

    ynum R1 = getTransmitterSignal(0, realX, realY, realZ);
    ynum R2 = getTransmitterSignal(1, realX, realY, realZ);
    ynum R3 = getTransmitterSignal(2, realX, realY, realZ);
    ynum R4 = getTransmitterSignal(3, realX, realY, realZ);

    if(R1.asd()<0 || R2.asd()<0 || R3.asd()<0 || R4.asd()<0){   //A transmitter is out of range
        return -1;
    }

    //:CL=0 g=o-:R1 h=o-:R2 i=o-:R3 j=o-:R4 :SD=(g<o)+(h<o)+(i<o)+(j<o)
    ynum g=o-R1, h=o-R2, i=o-R3, j=o-R4;

    //x=(g^2-h^2+a^2)/2/a y=(g^2-i^2+b^2+c^2-2*b*x)/2/c
    ////ynum x=(g.sq()-h.sq()+a.sq())/2/a, y=(g.sq()-i.sq()+b.sq()+c.sq()-b*2*x)/2/c;
    ynum x=(g*g-h*h+a*a)/2/a, y=(g*g-i*i+b*b+c*c-b*2*x)/2/c;

    //:XX=x+ox :YY=y+oy :ZZ=(g^2-j^2+d^2+e^2+f^2-2*d*x-2*e*y)/2/f+oz
    ////ynum XX=x+ox, YY=y+oy, ZZ=((g.sq()-j.sq()+d.sq()+e.sq()+f.sq()-d*2*x-e*2*y)/2/f)+oz;
    ynum XX=x+ox, YY=y+oy, ZZ=((g*g-j*j+d*d+e*e+f*f-d*2*x-e*2*y)/2/f)+oz;

    //:CL=1 :Pos=ax+:XX+ay+:YY+az+:ZZ if :SD<4 then :Pos=er end goto6
    
    //std::cout << "pos:" <<std::to_string(XX.asd())<<", " <<std::to_string(YY.asd())<<", "<<std::to_string(ZZ.asd()) << "\n";

    double deviation = sqrt(
        pow(realX-XX.asd(),2)+
        pow(realY-YY.asd(),2)+
        pow(realZ-ZZ.asd(),2)
    );
    return deviation;
}

double YSPOS_displacement(double realX, double realY, double realZ){

    ynum R1 = getTransmitterSignal(0, realX, realY, realZ);
    ynum R2 = getTransmitterSignal(3, realX, realY, realZ);
    ynum R3 = getTransmitterSignal(1, realX, realY, realZ);
    ynum R4 = getTransmitterSignal(2, realX, realY, realZ);

    if(R1.asd()<0 || R2.asd()<0 || R3.asd()<0 || R4.asd()<0){   //A transmitter is out of range
        return -1;
    }

    ynum h=1000000, k=393347889, l=39666, m=100890,
     n=3395*(double)1000000, o=58319, p=114430000, q=18945, r=9809.3, s=1599,
        ox=-9940, oy=4900, oz=0;
    
    ynum a=h-R1, b=h-R2, c=h-R3, d=h-R4;
    
    ynum x=(a*a+k-c*c)/l, y=-(a*a+n-o*x-d*d)/m, z=-(a*a+p-q*x-r*-y-b*b)/s;
    x=x+ox; y=y+oy; z=z+oz;

    double deviation = sqrt(
        pow(realX-x.asd(),2)+
        pow(realY-y.asd(),2)+
        pow(realZ-z.asd(),2)
    );
    return deviation;
}