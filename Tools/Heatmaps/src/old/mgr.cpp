#include <vector>
#include <cmath>
#include <iostream>

#include <thread>

#include "gif.h"
#include "generators.h"

int main(){
	//Lighthouse vector
	std::vector<struct lighthouse> lhs;
	int size=1;
	int groupIds=0;
	double lhsScale=1;
	//ARGS std::vector<struct lighthouse>* l, int* size, double* scale, int* groups
	generator_CubicClosePackedLattice(&lhs, &size, &lhsScale, &groupIds);
	//generator_LumiLattice(&lhs, &size, &lhsScale, &groupIds);


	std::cout << "generated " << lhs.size() <<" lattice points.\n";

	int range = 1000;	//Units in KM

	int width = 100;
	int height = 100;

	int frames = 50;
	int delay = 10;

	bool doGroups=true;

	//In order to fit all transmitters into picture, width == (size*2*lhsScale)+2*range
	// so scale = width/((size*2*lhsScale)+(2*range));
	int endStop = (size*2*lhsScale)+(2*range) + 1000;

	double scale =(endStop*1.0)/width; //Scales KM -> px
	std::cout << "end: " << endStop << "\n scale: " << scale << "\n";

	//std::vector<uint8_t> img(width * height * 4, 0);

	double x0=-size*lhsScale-range-500;
	double y0=-size*lhsScale-range-500;
	double z0=-size*lhsScale-range-500;
	double frameScale=(endStop*1.0)/frames;

	auto fileName = "out/heatmap.gif";
	GifWriter g;
	GifBegin(&g, fileName, width, height, delay);

	for(int frameCount = 0; frameCount<frames; frameCount+=4){
        worker();
    }
}