#include <iostream>
#include <vector>
#include <cmath>

#include <random>

using namespace std;

//REVERSE ISAN

struct receiver {
    double x;
    double y;
    double z;
    double s;
};

vector<struct receiver> receivers;



void print(vector<double> mat){
    cout<<"\n";
    for (auto row = mat.begin(); row != mat.end(); ++row){
        cout<<"[ "<<to_string(*row)<<"]\n";
    }
    cout<<"\n";
}
void print(vector<vector<double>> mat){
    cout<<"\n";
    for (auto row = mat.begin(); row != mat.end(); ++row){
        cout<<"[ ";
        for (auto val = row->begin(); val != row->end(); ++val){
            cout<<to_string(*val)<<"\t";
        }
        cout<<"]\n";
    }
    cout<<"\n";
}

vector<vector<double>> trans(vector<vector<double>> mat){
    vector<vector<double>> transpose(mat[0].size(), vector<double>(mat.size()));
    for (int i = 0; i<(int)mat.size(); i++){
        for (int j = 0; j<(int)mat[0].size(); j++){
            transpose[j][i] = mat[i][j]; 
        }
    }
    return transpose;
}

vector<vector<double>> submat(vector<vector<double>> mat, int i, int j){
    vector<vector<double>> submatrix(mat.size()-1, vector<double>(mat[0].size()-1));

    for(int row=0; row<(int)mat.size(); row++){
        if(row!=i){
            for(int col=0; col<(int)mat[0].size(); col++){
                if(col!=j){
                    //add to matrix
                    submatrix[row-(row>i?1:0)][col-(col>j?1:0)] = mat[row][col];
                }
            }
        }
    }

    return submatrix;
}


double det(vector<vector<double>> mat){
    if(mat.size() != mat[0].size()){
        cout << "Tried to get det of non square matrix!\n";
        return -1;
    }
    if(mat.size()==1) return mat[0][0];
    if(mat.size()==2) return mat[0][0]*mat[1][1] - mat[0][1]*mat[1][0];

    double detr = 0;
    for(int row=0; row<(int)mat.size(); row++){
        detr+= (row%2==0?1:-1) * mat[row][0] * det(submat(mat, row,0));
    }


    return detr;
}

vector<vector<double>> comatrix(vector<vector<double>> mat){
    vector<vector<double>> cmat(mat.size(), vector<double>(mat[0].size()));

    for(int i=0; i<(int)mat.size(); i++){
        for(int j=0; j<(int)mat[0].size(); j++){
            cmat[i][j] = ((i+j)%2==0?1:-1) * det(submat(mat,i,j)); //Pretty sure this generates the right sign matrix
        }
    }

    return cmat;
}

vector<vector<double>> adj(vector<vector<double>> mat){
    return trans(comatrix(mat));
}

vector<vector<double>> mult(vector<vector<double>> mat, double x){
    vector<vector<double>> mul(mat.size(), vector<double>(mat[0].size()));
    for(int i=0; i<(int)mat.size(); i++){
        for(int j=0; j<(int)mat[0].size(); j++){
            mul[i][j] = x*mat[i][j];
        }
    }
    return mul;
}

vector<double> mult(vector<vector<double>> mat, vector<double> vec){

    vector<double> mul(mat.size());

    if(mat[0].size() != vec.size()){
        cout<<"MULT(<mat>,<vec>) size missmatch\n";
        return mul;
    }

    for(int row=0; row<(int)mat.size(); row++){
        for(int intermed=0; intermed<(int)vec.size(); intermed++){
            mul[row] += mat[row][intermed] * vec[intermed];
        }
    }

    return mul;
}

vector<vector<double>> mult(vector<vector<double>> mat, vector<vector<double>> mat2){
    //rows1 x cols1   X   rows1 x cols1     =  rows1 x cols2

    vector<vector<double>> mul(mat.size(), vector<double>(mat2[0].size()));

    if(mat[0].size() != mat2.size()){
        cout<<"MULT(<mat>,<mat>) size missmatch\n";
        return mul;
    }

    for(int i=0; i<(int)mat.size(); i++){
        for(int j=0; j<(int)mat2[0].size(); j++){
            for(int interm=0; interm<(int)mat2.size(); interm++){
                mul[i][j] += mat[i][interm] * mat2[interm][j];
            }
        }
    }

    return mul;
}
vector<vector<double>> inv(vector<vector<double>> mat){
    //1/det(mat) * adj(mat)
    vector<vector<double>> adjucate = adj(mat);
    double detr = det(mat);
    return mult(adjucate, 1/detr);
}

double dist(double x1, double y1, double z1, double x2, double y2, double z2){
    return sqrt(pow(x1-x2,2)+pow(y1-y2,2)+pow(z1-z2,2));
}

void add(double x, double y, double z, double s){
    receivers.push_back(receiver({x,y,z,s}));
}

int xh = 39152;
int yh = -46104;
int zh = -174;
std::default_random_engine generator;
std::uniform_int_distribution<int> distribution(-10,10);

void adds(double x, double y, double z){
    double accuracy = 1000;
    
    double errx=distribution(generator)/accuracy/10;
    double erry=distribution(generator)/accuracy/10;
    double errz=distribution(generator)/accuracy/10;

    receivers.push_back(receiver({x+errx,y+erry,z+errz,
        ((int)(dist(x,y,z, xh,yh,zh)*accuracy))/accuracy
    }));
}

void solve(){
    vector<vector<double>> A(receivers.size(), vector<double>(4)); //[row][col]
    vector<double>         b(receivers.size());                    //[row]

    //TODO: loop over recvs & fill in A & b
    for (int row = 0; row<(int)receivers.size(); row++){
        A[row][0] = 1;
        A[row][1] = -2*receivers[row].x;
        A[row][2] = -2*receivers[row].y;
        A[row][3] = -2*receivers[row].z;

        b[row] = pow(receivers[row].s, 2) - pow(receivers[row].x, 2) - pow(receivers[row].y, 2) - pow(receivers[row].z, 2);
    }

    /*cout<<"trans(A): \n";
    print(trans(A));
    cout<<"det(A): "<<to_string(det(A))<<"\n";
    cout<<"adj(A): \n";
    print(adj(A));
    */
 

    //nieve solution   (for exactly 4 references)
    //x = inv(A) . b
    //cout<<"nieve x: \n";
    //vector<double> pos = mult(inv(A),b);

    //least squares solution
    //x = A . inv(trans(A) . A) . trans(A) . b
    vector<double> pos =mult(inv(mult(trans(A), A)), mult(trans(A), b));
    //print(pos);
    
    //cout<<"Recvs: " << receivers.size() << "\n";
    //cout<<"    Disagreement: " << to_string(pos[0] - pow(pos[1],2) - pow(pos[2],2) - pow(pos[3],2)) <<"\n";
    //cout<<"    Real Error  : " << to_string(dist(xh,yh,zh, pos[1], pos[2], pos[3])) <<"\n";

    cout << "(" << receivers.size() << ", " << to_string(dist(xh,yh,zh, pos[1], pos[2], pos[3]))<<","<<to_string(pos[0] - pow(pos[1],2) - pow(pos[2],2) - pow(pos[3],2)) << ")\n";
}


int main(){

    //some demo point
    

    //Add receivers & measurements
    //[AF-LCO] SomeoneLucas: I think the blue box in the SSC is 70x50x35m

    
    double xb=70/2.0;
    double yb=50/2.0;
    double zb=35/2.0;

    double div=2;

    for(double i=-1; i<1; i+=1/div){
        for(double j=-1; j<1; j+=1/div){
            for(double k=-1; k<1; k+=1/div){
                adds(xb*i, yb*j, zb*k);
            }
        }
    }
    
    cout << "SSC method, div:" << div <<"\n";
    solve();
    
    receivers.clear();


    //rangefinder path
    cout << "recv path method, path:\n";

    int i=0,j=0,k=0;
    int lim = 6000;
    int step= 3000;

    for(i=0; i<=lim; i+=step){
        adds(i,j,k);
        cout<<"  ("<<to_string(i)<<", "<<to_string(j)<<", "<<to_string(k)<<")\n";
    }
    cout<<"\n";

    for(j=0; j<=lim; j+=step){
        adds(i,j,k);
        cout<<"  ("<<to_string(i)<<", "<<to_string(j)<<", "<<to_string(k)<<")\n";
    }
    cout<<"\n";

    for(k=0; k<=lim; k+=step){
        adds(i,j,k);
        cout<<"  ("<<to_string(i)<<", "<<to_string(j)<<", "<<to_string(k)<<")\n";
    }
    cout<<"\n";
    adds(i,j,k);
    cout<<"  ("<<to_string(i)<<", "<<to_string(j)<<", "<<to_string(k)<<")\n";
    
    solve();

    //A . x = b
    //construct A matrix & b vector
    
    
    

    //Required operations
    //  print(<mat>)                -done
    //  print(<vec>)                -
    //
    //  trans(<mat>)                -done
    //  inv(<mat>)                  -done
    //      det(<mat>)              -done
    //          submat(<mat>, i,j)  -done
    //      adj(<mat>)              -done
    //          comatrix(<mat>)     -done
    //  mult(<mat>,<mat>)
    //  mult(<mat>,<vec>)   //<vec> can be considered a 1xN / Nx1 matrix


    cout<<"\n";
    return 0;
}