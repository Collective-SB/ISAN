# V2 optional extra features

## Base units

To calculate your position, any system must measure the distance to four reference transmitters. A single receiver can make one measurement every two ticks. Thanks to improved measurement of the reference transmitter positions and the new system allowing a better choice of reference set, the position (and calculated derivatives) are now much more accurate compared to V1/

Base versions output position to the X, Y & Z fields:

- Mono, requires one receiver, base update rate: 3 ticks
  - accurate in any frame with constant acceleration
  - Single basic chip
  - The single receiver polls each of the four selected transmitters, then the system uses a quadratic prediction system and the previous 12 measurements to estimate what the latest measurements would have been if all taken in the same tick

- Duo, requires two receivers, base update rate: 3 ticks
  - accurate in any frame with constant acceleration, quickly reacting to changes
  - Single basic chip
  - The middle-man between Mono & Quad, using similar prediction to mono, except measurements can be taken twice as fast, so the previous 12 measurements used for prediction are much more up-to date, allowing for faster reaction to changing acceleration

- Quad, requires four receivers, base update rate: 2 ticks
  - as accurate as can be, always
  - Single basic chip
  - Able to measure to all four reference transmitters simultaneously ever two ticks

## Single chip optional features

feature | description | cost (update ticks) | available for
-|-|-|-
Built-in display driver | Won't require an extra chip to update visual coordinate display | 1 | any
Built-in speed | Calculate the craft speed on the core chip, now **much** more accurate | 1 (& upgrade to advanced chip) | any
Automated Mono fallback | Use mono on an available receiver if one or more are damaged | 0 | Quad
(Extra) prediction | Further calibrated prediction method to remove speed dependant error in position output | 1 | any
Integrated self test & debug | Notifies the user of system damage / incorrect setup | 0 / 1 | any
Updateable magics | Adds an interface which allows the programmatic update of the V2 constants, this allows you to switch which transmitters you are using for positioning. Minor future-proofing for V3's player transmitter system | 0 (& upgrade to advanced) | any

## Additional chip optional features

feature | description | cost (extra chips) | available for
-|-|-|-
Display driver | Shows ISAN X,Y,Z (,S) on a 24x24 text panel | 1 basic | any
Speed calculator | Calculates craft speed, now **much** more accurate | 1 advanced | any
ORN | Direction heading / pitch | TBC | any
WNS vector calculator | Calculates by how much your heading must change in order to point to a specified destination | 1 advanced | any
Autopilot (single core)* | Flies your ship for you, this version runs using one ISAN core (mono or quad) | 1 advanced | any
Autopilot (dual core)* | Adding an extra ISAN core to your ship gives this version of autopilot enough information to fly your ship without guesses, making it more stable. Any combination of quad(s)/mono(s) will work. | 1 advanced + extra core. | dual core

*still under development
