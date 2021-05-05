#include <vector>
#include <cmath>
#include <iostream>

#include "gif.h"
#include "generators.h"

int main(){
	//Lighthouse vector
	std::vector<struct lighthouse> lhs;
	int size=1;
	int groupIds=0;
	double lhsScale=1;
	//ARGS std::vector<struct lighthouse>* l, int* size, double* scale, int* groups
	//generator_CubicLattice(&lhs, &size, &lhsScale, &groupIds);
	generator_CubicClosePackedLattice(&lhs, &size, &lhsScale, &groupIds);


	std::cout << "generated " << lhs.size() <<" lattice points.\n";

	int range = 1000;	//Units in KM

	int width = 500;
	int height = 500;

	int frames = 100;
	int delay = 20;

	bool doGroups=false;

	//In order to fit all transmitters into picture, width == (size*2*lhsScale)+2*range
	// so scale = width/((size*2*lhsScale)+(2*range));
	int endStop = (size*2*lhsScale)+(2*range) + 1000;

	double scale =(endStop*1.0)/width; //Scales KM -> px
	std::cout << "end: " << endStop << "\n scale: " << scale << "\n";

	std::vector<uint8_t> img(width * height * 4, 0); //Frame buffer

	double x0=-size*lhsScale-range-500;
	double y0=-size*lhsScale-range-500;
	double z0=-size*lhsScale-range-500;
	double frameScale=(endStop*1.0)/frames;

	auto fileName = "out/heatmap.gif";
	GifWriter g;
	GifBegin(&g, fileName, width, height, delay);

	for(int frameCount = 0; frameCount<frames; frameCount++){
		double pZ = z0 + frameCount*frameScale;
		std::cout << "frame " << frameCount << " of " << frames <<"\n";


		//render frame
		for(int i=0; i<width; i++){
			double pX = x0 + i*scale;
			
			for(int j=0; j<height; j++){
				
				double pY = y0 + j*scale;

				//std::vector<int> groupCounters(groupIds,0);

				int inRange = 0;
				for(auto &i : lhs){
					double dx = i.x*lhsScale - pX;
					double dy = i.y*lhsScale - pY;
					double dz = i.z*lhsScale - pZ;
					if(dx>range || dy>range ||dz>range) continue;
					if(-dx>range || -dy>range ||-dz>range) continue;
					if(sqrt(pow(dx, 2) + pow(dy,2)+ pow(dz,2))<=range){
						//groupCounters[i.gid]++;
						inRange++;
					}
				}
				
				/*
				if(doGroups){
					inRange = 0;
					for(int gidi = 0; gidi<groupIds; gidi++){
						if(groupCounters[gidi]>3) inRange++;
					}
				}*/
				

				uint8_t r, b, g;
				switch(inRange){
					case 0: r=255; g=255; b=255; break;
					case 1: r=237; g=0; b=0; break;
					case 2: r=237; g=130; b=0; break;
					case 3: r=237; g=213; b=0; break;
					case 4: r=91; g=237; b=0; break;
					case 5: r=0; g=237; b=174; break;
					case 6: r=0; g=229; b=237; break;
					case 7: r=0; g=174; b=237; break;
					case 8: r=0; g=99; b=237; break;

					/*case 9: r=255; g=255; b=255; break;
					case 10: r=237; g=0; b=0; break;
					case 11: r=237; g=130; b=0; break;
					case 12: r=237; g=213; b=0; break;
					case 13: r=91; g=237; b=0; break;
					case 14: r=0; g=237; b=174; break;
					case 15: r=0; g=229; b=237; break;
					case 16: r=0; g=174; b=237; break;
					case 17: r=0; g=99; b=237; break;*/
					default:r=237; g=0; b=237; break;
				}
				img[(i+j*width)*4] = r;
				img[(i+j*width)*4+1] = g;
				img[(i+j*width)*4+2] = b;
			}
		}
		GifWriteFrame(&g, img.data(), width, height, delay);
	}

	
	std::cout << "Render complete." << "\n\n";
	//GifWriteFrame(&g, black2.data(), width, height, delay);
	GifEnd(&g);

	return 0;
}