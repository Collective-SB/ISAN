#include "transmitters.h"
/*
m="station_"
:M1=m+"hq_imperial_a"      :X1=-9938.401 :Y1=  4904.714 :Z1=0
:M2=m+"hq_kingdom_a"       :X2= 9894.287 :Y2=  4904.714 :Z2=0
:M3=m+"proving_grounds"    :X3=19218.818 :Y3=-45540.987 :Z3=0
:M4=m+"capital_imperial_a" :X4= -465.876 :Y4=     0.236 :Z4=-801.149
*/

void getTransmitterCoords(int transmitter, double &tX, double &tY, double &tZ){
    switch(transmitter){
        case 0: //station_hq_imperial_a
            //tX=-9938;
            tX=-9938.401;
            //tY=4905;
            tY=4904.714;
            tZ=0;
            break;
        case 1: //station_hq_kingdom_a
            //tX=9894;
            tX=9894.287;
            //tY=4904;
            tY=4904.714;
            tZ=0;
            break;
        case 2: //station_proving_grounds
            //tX=19219;
            tX=19218.818;
            //tY=-45541;
            tY=-45540.987;
            tZ=0;
            break;
        case 3: //station_capital_imperial_a
            //tX=-465;
            tX = -465.876;
            //tY=0;
            tY=0.236;
            //tZ=-800;
            tZ=-801.149;
            break;

        case 4: //station_kingdom_outpost_b	
            tX=39152;
            tY=	-46104;
            tZ=	-174;
            break;
        case 5: //station_imperial_outpost_a	
            tX=-90194;
            tY=6212;
            tZ=30225;
            break;
        case 6: //station_kingdom_outpost_a	
            tX=90445;
            tY=18244;
            tZ=-30137;
            break;
        case 7: //station_kingdom_outpost_b_2
            tX=100519;
            tY=12718;
            tZ=-10221;
    }
}

double getTransmitterSignal(int transmitter, double pX, double pY, double pZ){
    double tX, tY, tZ;
    
    getTransmitterCoords(transmitter, tX, tY, tZ);

    //dist = 999999 - sig
    // sig = 999999 - sig
    double dist = sqrt(
        pow(pX-tX/*+(transmitter==0?0.005:0)*/,2)+
        pow(pY-tY,2)+
        pow(pZ-tZ,2)
    );

    if(dist < 1000000){
        return 999999 - dist;
    } else {
        return -1;
    }
}