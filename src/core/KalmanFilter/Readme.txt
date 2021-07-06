Kalman Filtered Velocity by RenzDot https://github.com/RenzDot
A Kalman Filter is a statistical approach to extracting speed from noisy positional data
The filter is used with an existing navigation system (Mono) as the Kalman doesn't calculate positions itself

Global Variables used
:a, :Vx, :Vy, :Vz, :VV, :x, :y, :z, :at

Installing Kalman Filter:
1) Copy Kalman_X yolol into a basic chip
2) Copy Kalman_Y yolol into a basic chip
3) Copy Kalman_Z yolol into a basic chip
4) Install a memory chip with these variables: Vx, Vy, Vz, x, y , z, VV
5) Install a Text Panel and rename "Panel Value" to "VV"
VV represents speed
Vx, Vy, Vz represents speed on x, y, z dimensions
x, y, z represents the positions from an existing navigation system

Installing Navigation:
1) Copy mono_k yolol into a basic chip
2) Install a Navigation Reciever and rename the following fields:
    TargetMessage -> at
    SignalStrength -> a