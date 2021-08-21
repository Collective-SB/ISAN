# Destination Input (& display)

Add an extra text panel which displays your current target destination & allows easy editing by pasting a coordinate string directly into the display.

Example coord String: ``1000 -100 32123`` (integer's only!)

Most Recent Release: V1
```c
xm="\n\nX: " ym="\nY: " zm="\nZ: " dm="\n\nD:" l="" :WPT="" k=1000
a=:WPT b=l l=xm+:m+ym+:n+zm+:o+dm+:f/k :WPT=l goto 2+a!=b
:WPT=l+"\nParsing new point" s="98743" i=0 o=0 j=-1
c=a c-=a-- d=5*(c>4)+2*(s>(s-c)) d+=c>d d+=c>d o+=d*10^j++ goto4+c<0 
v=1 if c=="-" then v=-1 a-- end
i++ z=y y=x x=o*v o=0 j=-1 goto 4+3*(i>2)
:m=x :n=y :o=z :WPT="\nNew point parsed" goto 1
```

## Installation:
- Ensure you have ISAN on an advanced chip with speed & alignment enabled
- Add the above code to another advanced chip
- add a text panel & rename it's field to "WPT"

## Who to contact to get involved
    - Azurethi#0789

## Credits
    - Azurethi