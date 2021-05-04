#include <vector>
#include <cmath>
#include <iostream>

struct lighthouse {
	double x;
	double y;
	double z;
	int gid;
};

#define ARGS std::vector<struct lighthouse>* l, int* size, double* scale, int* groups

void generator_CubicLattice(ARGS);
void generator_CubicClosePackedLattice(ARGS);
void generator_LumiLattice(ARGS);

void generator_CheckerLattice(ARGS);
void generator_HexagonalLattice(ARGS);
