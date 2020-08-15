# Axis processors.

Use the axis constants produced by the Inversion engine to scale & shift the squared distances calculated from the receivers in order to attain the core's position on one or more axis.

Most recent release: [V2.2b](Releases/AxP%20(MCQ)%20V2.2b.yorel)
```c
//Name:             Multi-Chip Quad Axis processors.
//Current Version:      V2.2b
//Credit:               Azur, Reca, Lumi

//Globals:
//  :X, :Y, :Z      - Core position
//  :R[1|2|3|4]     - Receiver's signal strength
//  :[X|Y|Z][A-D]   - Axis scale constants
//  :[X|Y|Z]E       - Axis Offset constants

//Locals:
//  y=999999       - Conversion constant (Signal Strength -> Distance)

----+----|----+----|----+----|----+----|----+----|----+----|----+----|
y=999999
:X=(y-:R1)^2/:XA+(y-:R2)^2/:XB+(y-:R3)^2/:XC+(y-:R4)^2/:XD-:XE goto 2
goto 2 //ISAN 2.0:AxP_X_2.2b                            THE COLLECTIVE
----+----|----+----|----+----|----+----|----+----|----+----|----+----|
y=999999
:Y=(y-:R1)^2/:YA+(y-:R2)^2/:YB+(y-:R3)^2/:YC+(y-:R4)^2/:YD-:YE goto 2
goto 2 //ISAN 2.0:AxP_Y_2.2b                            THE COLLECTIVE
----+----|----+----|----+----|----+----|----+----|----+----|----+----|
y=999999
:Z=(y-:R1)^2/:ZA+(y-:R2)^2/:ZB+(y-:R3)^2/:ZC+(y-:R4)^2/:ZD-:ZE goto 2
goto 2 //ISAN 2.0:AxP_Z_2.2b                            THE COLLECTIVE
----+----|----+----|----+----|----+----|----+----|----+----|----+----|
```