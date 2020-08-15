# ISAN DEV

Welcome to the dev section.

## Directory structure

 - **Development/**
    - **Core/**
        - **Additional Notes/**
        - **Isolated/**
            - **dev/**
            - **Releases/**
        - **Modular/**
            - **`<Module Name>`/**
                - **dev/**
                - **Releases/**
                - **README.MD**
    - **Addon Modules/**
        - **`<Module Name>`/**
            - **dev/**
            - **Releases/**
            - **README.MD**

The **README.MD** in the root of a module folder, should contain *at least* a brief description of what that module does, a link to the most recent version in **`<Module Name>`/Releases/** at the top and have a method of contact for the lead contributer(s) (discord is preferred). Feel free to add sections under this with further explanation, credits, etc.

The **dev/** folder can contain whatever notes you have pertaining to the problem, in whatever folder structure you like. Use the .yodev & .yolol formats to explain yolol code, and note formats for extra explanation.

The **Releases/** folder should contain only .yorel files, with a name that starts with a copy of the `<Module Name>`, followed by whatever you like, ending with a version identifier `V#.#.#.#[a|b|t]`. And an optional README.MD detailing the updates in each version, especially if there are multiple "current versions". 

Also, check out documentation/README.md for info on ISAN related terms you may wish to use to create more descriptive names for your files.

# File Types:
Extension | description
-|-
none, .txt| Notes
.md | Markdown, more complete explanations
.yolol | Yolol code exactly as it would appear in a single chip
.yodev | Multiple chips worth of code, potentially violating the line and/or character limits.
.yorel| A yolol release file.
other | should only be used for additional material like images, or helper scripts in other languages

# Versoning

We'll be using an extended version of SemVer. All yolol & yorel files *must* contain this version string in their name.

```
Format: V#.#.#.#[a|b|t]
```
Given a version number ISAN.MAJOR.MINOR.PATCH, increment the:

- ISAN version, never. (it should match the parent ISAN Major version)
- MAJOR version when you make incompatible API changes,
- MINOR version when you add functionality in a backwards compatible manner, and
- PATCH version when you make backwards compatible bug fixes.

[a|b|t] refers to the requirement of a single character (a, b or t) at the end of the version string. 
 - a: Alpha version (not tested in game)
 - b: Beta version  (minor in-game testing)
 - t: tested, known to work in game

### yorel-template

```c
//Name: 
//Current Version: 
//Credit: 

//Globals:
//  :Y - description
----+----|----+----|----+----|----+----|----+----|----+----|----+----|
//Code for chip 1
//You can have chip specific comments after their code, that are ofc not mandatory to copy
//It'd be nice if you included descriptive names for local vars, but that's not nessesary
//Please include a relative path to related .yolol/.yodev file(s) if they exist
----+----|----+----|----+----|----+----|----+----|----+----|----+----|
//Code for chip 2
----+----|----+----|----+----|----+----|----+----|----+----|----+----|
//Code for chip 3...
```
### yorel-example (ISANv2 Core V2.0.0.0a.yorel)
```c
//Name:             ISANv2 Core
//Current Version:      2.0.0.0a
//Credit:               Azurethi, Lumi, Reca, Solon

//Globals
// :M#              - Message field of reciever # (#={1,2,3,4})
// :X#, :Y#, :Z#    - Position of transmitter # (#={1,2,3,4})
// :X, :Y, :Z       - Ship position
// :rst             - Inversion Engine Reset
// ... (in practice you should enumerate all of these)

----+----|----+----|----+----|----+----|----+----|----+----|----+----|
m="station_"
:M1=m+"hq_imperial_a"      :X1=-9938.401 :Y1=  4904.714 :Z1=0
:M2=m+"hq_kingdom_a"       :X2= 9894.287 :Y2=  4904.714 :Z1=0
:M3=m+"proving_grounds"    :X3=19218.818 :Y3=-45540.987 :Z1=0
:M4=m+"capital_imperial_a" :X4= -465.876 :Y4=     0.236 :Z1=-801.149
:rst=1 //ISAN 2.0:Temp_Setup_2.1a                       THE COLLECTIVE
----+----|----+----|----+----|----+----|----+----|----+----|----+----|
goto 1+(:rst==1)
A=:X1-:X2 z=:Y1-:Y2 u=:Z1-:Z2 r=:X1-:X3 e=:Y1-:Y3 t=:Z1-:Z3 h=:X1-:X4
i=:Y1-:Y4 C=:Z1-:Z4 da=A*e*C-A*t*i-z*r*C+z*t*h+u*r*i-u*e*h n=-0.5
:XA=m  z=:Y2 u=:Z2 e=:Y3 t=:Z3 i=:Y4 C=:Z4 m=9223372036854775.807
:YA=m  A=n   r=n   h=n   :XA= da/(A*e*C-A*t*i-z*r*C+z*t*h+u*r*i-u*e*h)
:ZA=m  z=:X2 e=:X3 i=:X4 :YA=-da/(A*e*C-A*t*i-z*r*C+z*t*h+u*r*i-u*e*h)
:ZB=m  u=:Y2 t=:Y3 C=:Y4 :ZA= da/(A*e*C-A*t*i-z*r*C+z*t*h+u*r*i-u*e*h)
:YB=m  z=:X1 u=:Y1       :ZB=-da/(A*e*C-A*t*i-z*r*C+z*t*h+u*r*i-u*e*h)
:XB=m  u=:Z1 t=:Z3 C=:Z4 :YB= da/(A*e*C-A*t*i-z*r*C+z*t*h+u*r*i-u*e*h)
       z=:Y1 e=:Y3 i=:Y4 :XB=-da/(A*e*C-A*t*i-z*r*C+z*t*h+u*r*i-u*e*h)
:XC=m  e=:Y2 t=:Z2 //ISAN 2.0:InvEng_2.1a               THE COLLECTIVE
:YC=m  A=n   r=n   h=n   :XC= da/(A*e*C-A*t*i-z*r*C+z*t*h+u*r*i-u*e*h)
:ZC=m  z=:X1 e=:X2 i=:X4 :YC=-da/(A*e*C-A*t*i-z*r*C+z*t*h+u*r*i-u*e*h)
:ZD=m  u=:Y1 t=:Y2 C=:Y4 :ZC= da/(A*e*C-A*t*i-z*r*C+z*t*h+u*r*i-u*e*h)
:YD=m  i=:X3 C=:Y3       :ZD=-da/(A*e*C-A*t*i-z*r*C+z*t*h+u*r*i-u*e*h)
:XD=m  u=:Z1 t=:Z2 C=:Z3 :YD= da/(A*e*C-A*t*i-z*r*C+z*t*h+u*r*i-u*e*h)
       z=:Y1 e=:Y2 i=:Y3 :XD=-da/(A*e*C-A*t*i-z*r*C+z*t*h+u*r*i-u*e*h)
P1=:X1^2+:Y1^2+:Z1^2 P2=:X2^2+:Y2^2+:Z2^2 P3=:X3^2+:Y3^2+:Z3^2
P4=:X4^2+:Y4^2+:Z4^2 :XE=P1/:XA+P2/:XB+P3/:XC+P4/:XD
:YE=P1/:YA+P2/:YB+P3/:YC+P4/:YD :ZE=P1/:ZA+P2/:ZB+P3/:ZC+P4/:ZD :rst=0
----+----|----+----|----+----|----+----|----+----|----+----|----+----|
y=999999
:X=(y-:R1)^2/:XA+(y-:R2)^2/:XB+(y-:R3)^2/:XC+(y-:R4)^2/:XD-:XE goto 2
goto 2 //ISAN 2.0:AxP_X_2.0a                            THE COLLECTIVE
----+----|----+----|----+----|----+----|----+----|----+----|----+----|
y=999999
:Y=(y-:R1)^2/:YA+(y-:R2)^2/:YB+(y-:R3)^2/:YC+(y-:R4)^2/:YD-:YE goto 2
goto 2 //ISAN 2.0:AxP_Y_2.0a                            THE COLLECTIVE
----+----|----+----|----+----|----+----|----+----|----+----|----+----|
y=999999
:Z=(y-:R1)^2/:ZA+(y-:R2)^2/:ZB+(y-:R3)^2/:ZC+(y-:R4)^2/:ZD-:ZE goto 2
goto 2 //ISAN 2.0:AxP_Z_2.0a                            THE COLLECTIVE
```


### yodev-template

```c
//Name: 
//Credit: 
----+----|----+----|----+----|----+----|----+----|----+----|----+----|
```

### yodev-example (Example yolol V2.0.0.3b.yodev)
```c
//Name:     Example Yolol
//Credit:       Azurethi
----+----|----+----|----+----|----+----|----+----|----+----|----+----|
//Changed X & Y in this version
some=example*yolol code=:forA^Demonstration //this does a thing
----+----|----+----|----+----|----+----|----+----|----+----|----+----|
//Changed Z, removed Y
some=example*yololCode
----+----|----+----|----+----|----+----|----+----|----+----|----+----|
//Originan version
some=example*yolol goto :demo
```