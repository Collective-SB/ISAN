#include "ynum.h"

ynum::ynum(double num){
    base = num*1000;  //int cast truncates
}
ynum::ynum(int num){
    base = num*1000;
}
ynum::ynum(long num, bool mul=true){
    if(mul){
        base = num*1000;
    } else {
        base = num;
    }
    
}

ynum ynum::operator*(ynum other){ // (a*1000) * (b*1000) -> a*b * 1000 * 1000
    return ynum((base*other.base)/1000,false);
}
void ynum::operator*=(ynum other){ // (a*1000) * (b*1000) -> a*b * 1000 * 1000
    base = (base*other.base)/1000;
}

ynum ynum::operator/(ynum other){
    return ynum((base*1000)/other.base,false);   //(a*1000) / (b*1000) -> a/b
}

void ynum::operator=(double num){
    base =num*1000;
    //return this;
}

ynum ynum::operator-(){
    return ynum(-base,false);
}

ynum ynum::operator-(ynum other){ //a*1000 - b*1000 = (a-b)*1000
    return ynum(base-other.base,false);
}

ynum ynum::operator+(ynum other){ //a*1000 + b*1000 = (a+b)*1000
    return ynum(base+other.base,false);
}

ynum ynum::sq(){
    return ynum((base*base)/1000,false);
}

double ynum::asd(){
    return (double)base / 1000;
}