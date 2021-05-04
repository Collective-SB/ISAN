#ifndef YNUM
#define YNUM

class ynum {
    public:
        long base = 0; //Number * 1000  (0.001 -> 1)

        ynum(double num);
        ynum(int num);
        ynum(long num, bool mul);

        ynum operator*(ynum other);
        void operator*=(ynum other);

        ynum operator/(ynum other);

        void operator=(double num);

        ynum operator-();
        ynum operator-(ynum other);
        ynum operator+(ynum other);
        ynum operator^(ynum other);

        double asd(); //as double
        ynum sq(); //square
};

#endif