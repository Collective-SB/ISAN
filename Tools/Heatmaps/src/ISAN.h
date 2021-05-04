#ifndef ISAN
#define ISAN

#include "transmitters.h"
#include "ynum.h"


struct V2Magic {
    int    T[4];
    double X[5];
    double Y[5];
    double Z[5];
};

void calculateV2Magics(struct V2Magic* v2m);

double ISAN1_displacement(double realX, double realY, double realZ);
double ISAN2_displacement(double realX, double realY, double realZ);
double ISAN2_displacement_magic(double realX, double realY, double realZ, struct V2Magic* v2m);
double YSPOS_displacement(double realX, double realY, double realZ);

#endif