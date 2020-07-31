# ISAN DEV

Welcome to the dev section.

The only restriction is that all yolol code should be stored in a directory structure as such.

 - V[x]/parent/subproject
    - The problem this specific yolol solves
        - dev/
            - Contains all development work
        - "final yolol file Vx.n[a|b].yolol"

The root problem directory "The problem this specific yolol solves" should have a meaningful name, one word is fine, but this must be elaborated on in the docs. (See Documentation/README.md, section: "V2/3 Core modules")

The dev/ folder can contain whatever notes you have pertaining to the problem, in whatever folder structure you like, as janky, scribbly & illegible as desired. Just don't let this spill out into the final versions.

Your yolol file can start with any name you would like, ideally identifying the specific problem, such that it can be moved from this folder & still explain itself (eg. don't just have "final Vx.n[a].yolol").

The version descriptor ``Vx.n[a|b]`` is mandatory. 
 - x will refer to the Parent version of ISAN (V1/V2/V3...) 
 - n will refer to the version of this specific problem solution.
 - The suffix [a|b] denotes:
    - a: version is in "alpha", it has not been tested in-game
    - b: version is in "beta", minor in-game testing has already happened
    - no suffix: this version has been extensively tested in-game

Examples:
            
- ``Development/V2/core/isolated/Isolated Mono SC V2.1a.yolol``
    - Name: "Isolated Mono SC"
        - Isolated: Hard-Coded 4 transmitters
        - Mono: Single receiver
        - SC: Single chip solution
    - Parent ISAN version: 2
    - Specific implementation version: 1
    - a: this has not been tested in game
- ``Development/V2/core/isolated/Isolated Quad SC V2.1b.yolol``
    - Name: "Isolated Quad SC" (see docs for terms)
        - Isolated: Hard-Coded 4 transmitters
        - Quad: 4 receivers
        - SC: Single chip solution
    - Parent ISAN version: 2
    - Specific implementation version: 1
    - b: has recieved *some* in-game testing