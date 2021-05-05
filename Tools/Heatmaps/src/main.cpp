//Generate transmitter locations (using real space coords)
//Put transmitters in "cells"

//Select ROI
//Select resolution

//NB: worker threads (round robin frames)
//For each frame
//  For each sample in ROI
//      Get transmitters in cells in range
//      For each transmitter in cell range
//          Check real range
//      Assign colour based on number in range

#include <vector>
#include <cmath>
#include <iostream>
#include <string>

#include "gif.h"

#include "ISAN.h"



void setHeatmapValue(std::vector<uint8_t> &img, int cpx, double value){

    if(value<0){
        img[cpx*4] = 0;
        img[cpx*4+1] = 0;
        img[cpx*4+2] = 0;
        return;
    }

    /*
        errMAX
        ISANv1 : 1.886711
            ISANv1x : 0.049000
            ISANv1y : 0.028000
            ISANv1z : 1.181000
        ISANv2 : 155.901325     (original transmitter set)
            ISANv2x : 2.077000
            ISANv2y : 0.972000
            ISANv2z : 156.117000
    */


    double vmin = 0;
    double vmax = 1; 

    double fractional = (value*10- vmin)/vmax;
    if(fractional>1) fractional = 1;

    double rmin = 0;
    double gmin = 162;
    double bmin = 232;

    double rmax = 255;
    double gmax = 128;
    double bmax = 64;

    // 0 1 2
    // 
    fractional *= 3;
    fractional = (int) fractional;
    fractional /= 3;

    double r = (rmax-rmin)*fractional + rmin;
    double g = (gmax-gmin)*fractional + gmin;
    double b = (bmax-bmin)*fractional + bmin;

    img[cpx*4] = r;
    img[cpx*4+1] = g;
    img[cpx*4+2] = b;

    //img[cpx*4] = 255-fractional*255;
    //img[cpx*4+1] = 255-fractional*255;
    //img[cpx*4+2] = 255-fractional*255;
}

void setHeatmapValueL(std::vector<uint8_t> &img, int xc, int yc, double value, int width, int height){
    setHeatmapValue(img, xc + yc*width*2, value);
}
void setHeatmapValueR(std::vector<uint8_t> &img, int xc, int yc, double value, int width, int height){
    setHeatmapValue(img, xc + width + yc*width*2, value);
}

double runExp(int a, int b, int c, int d){
    
    struct V2Magic v2m;

    //for(int i =0; i<4; i++) v2m.T[i] = i;   //Select original 4 transmitters
    v2m.T[0] = a;
    v2m.T[1] = b;
    v2m.T[2] = c;
    v2m.T[3] = d;   // Further away than previous Z transmitter

    /*
    std::string fileName = "out/ISANv2_(";
    for(int i =0; i<4; i++) fileName.append(std::to_string(v2m.T[i]));
    fileName.append(")_err.gif");
    */

    std::string fileName = "out/ISANv2 new col.gif";


    calculateV2Magics(&v2m);

    int ROI = 1000000;

    int xmax = ROI;
    int xmin = -ROI;
    
    int ymax = ROI;
    int ymin = -ROI;

    int zmax = ROI;
    int zmin = -ROI;
    
    //Output pixels (sample size)
    int width=500;      //X
    int height=500;     //Y
    int frames= 100;     //Z

    int delay = 10;

    //config done.

    double xstep = (xmax-xmin)/width;
    double ystep = (ymax-ymin)/height;
    double zstep = (zmax-zmin)/frames;

    //Gifsetup
    
	GifWriter g;
	GifBegin(&g, fileName.c_str(), width, height, delay);
    
    //frame buffer
    std::vector<uint8_t> img(width * height * 4 , 0);

    int framecounter=0;

    double maxError = 0;

    for(double cZ=xmin; cZ<xmax; cZ+=zstep){
        int pxCounter = 0;
        
        int yc = 0;
        int xc;
        std::cout << "frame " << framecounter++ << " of " << frames << "\n";
        for(double cY=ymin; cY<ymax; cY+=ystep){
            xc = 0;
            for(double cX=xmin; cX<xmax; cX+=xstep){
                
                //double errorv1 = ISAN1_displacement(cX,cY,cZ);
                //double errorv1 = ISAN1_displacement(cX,cY,cZ);
                double errorv1 = ISAN2_displacement_magic(cX,cY,cZ, &v2m);
                //double errorv1 = (double)pxCounter/(width*height)*0.1;
                if(errorv1>maxError) maxError = errorv1;

                
                setHeatmapValue(img, pxCounter, errorv1);
                //setHeatmapValueL(img, xc,yc, errorv1, width, height);
                //setHeatmapValueR(img, xc,yc, errorv2, width, height);
                pxCounter++;
                xc++;
            }
            yc++;
        }
        //std::cout << xc << ", " << yc << "\n";

        //add overlay



        GifWriteFrame(&g, img.data(), width, height, delay);
    }

    std::cout << "Render complete.\nMaximum error was: " << std::to_string(maxError) <<"\n";
    GifEnd(&g);
    return maxError;
}


int main(){

    /*
    double minMaxError = 10000;
    int ma, mb, mc ,md;

    int ctr = 0;
    for(int a = 0; a<8; a++){
        for(int b=a+1; b<8; b++){
            for(int c=b+1; c<8; c++){
                for(int d=c+1; d<8; d++){
                    int maxErr = runExp(a,b,c,d);
                    if(maxErr<minMaxError){
                        minMaxError = maxErr;
                        std::cout << "-------------------=================NEW MINIMUM ERROR\n";
                        ma = a;
                        mb = b;
                        mc = c;
                        md = d;
                    }
                    std::cout << "Done ("<<a<<b<<c<<d<<")," << ctr++ << " of 70 combinations\n";
                }
            }
        }
    }
    
    std::cout << "\n\n Sim complete.\n Smallest max error was: " << minMaxError << " from combination ("<<ma<<mb<<mc<<md<<")\n\n";
    return 0;
    */

    //Sim 1 said combination 0257 was best
    runExp(0,2,5,7);
    return 0;
}   