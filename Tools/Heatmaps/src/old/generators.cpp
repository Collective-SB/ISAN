#include "generators.h"

//ARGS std::vector<struct lighthouse>* l, int* size, double* scale, int* groups
void generator_CubicLattice(ARGS){
    *size=2;
    *scale=894.4272;
	for(int i=-*size; i<=*size; i++){
		for(int j=-*size; j<=*size; j++){
			for(int k=-*size; k<=*size; k++){
				struct lighthouse nlh{i,j,k};
				l->push_back(nlh);
			}
		}
	}
}

void generator_CheckerLattice(ARGS){
    
}

void generator_LumiLattice(ARGS){
    *size = 3;
	*scale = 489.898;
	int counter = 0;
	int groupIds = 0;
	for(int i=-*size; i<=*size; i++){
		for(int j=-*size; j<=*size; j++){
			for(int k=-*size; k<=*size; k++){
				counter++;
                if(counter%2==0){
					//Centerpoint
					struct lighthouse nlh{i,j,k, groupIds};
					l->push_back(nlh);

                    //Diagonal ups
					struct lighthouse nlh2{i+0.5,j,k+0.5, groupIds};
					l->push_back(nlh2);
					struct lighthouse nlh3{i,j+0.5,k+0.5, groupIds};
					l->push_back(nlh3);

                    //Diagonal out, on plane
					struct lighthouse nlh4{i+0.5,j+0.5,k, groupIds};
					l->push_back(nlh4);

					groupIds++;
				}
			}
		}
	}
    *groups = groupIds;
}

void generator_CubicClosePackedLattice(ARGS){
    *size = 3;
    *scale = 707.106;
    int counter = 0;
    for(int i=-*size; i<*size; i++){
        for(int j=-*size; j<=*size; j++){
            for(double k=-*size; k<*size; k+=sqrt(3)/2){
                counter++;
                if(counter%2==0){
                    struct lighthouse nlh{i,j,k};
                    l->push_back(nlh);
                }
            }
        }
    }
}

	/*/Populate with Checker Lattice
	int size = 4;
	double lhsScale = 894.4272;
	int counter = 0;
	for(int i=-size; i<size; i++){
		for(int j=-size; j<size; j++){
			for(int k=-size; k<size; k++){
				counter++;
                if(counter%2==0){
					struct lighthouse nlh{i,j,k};
					lhs.push_back(nlh);
				}
			}
		}
	}*/

	/*/Populate with Lumi Lattice
	int size = 3;
	double lhsScale = 489.898;
	int counter = 0;
	int groupIds = 0;
	for(int i=-size; i<=size; i++){
		for(int j=-size; j<=size; j++){
			for(int k=-size; k<=size; k++){
				counter++;
                if(counter%2==0){
					//Centerpoint
					struct lighthouse nlh{i,j,k, groupIds};
					lhs.push_back(nlh);

                    //Diagonal ups
					struct lighthouse nlh2{i+0.5,j,k+0.5, groupIds};
					lhs.push_back(nlh2);
					struct lighthouse nlh3{i,j+0.5,k+0.5, groupIds};
					lhs.push_back(nlh3);

                    //Diagonal out, on plane
					struct lighthouse nlh4{i+0.5,j+0.5,k, groupIds};
					lhs.push_back(nlh4);

					groupIds++;
				}
			}
		}
	}//*/

    /*/Populate with Cubic Close-Packed Lattice
    int size = 4;
    int counter = 0;
	double lhsScale = 1000;
    for(double i=-size; i<=size; i++){
        for(double j=-size; j<=size; j++){
            for(double k=-size; k<=size; k+=sqrt(3)/2){
                counter++;
                if(counter%2==0){
                    struct lighthouse nlh{i,j,k};
                    lhs.push_back(nlh);
                }
            }
        }
    }//*/