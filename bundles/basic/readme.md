# ISAN: Basic Bundle!

## Version history

- V2.5: Public release 2
    ```diff
    + Added reboot from LOS
        • Fixes infinite loop bug when system installed incorrectly
    - removed alignment feature
        • not in scope of basic bundle
    + Added error message when speed enabled on basic chip
    + spawned navigators bundle
    ```

- V2.4: Beta version (w/ Alignment) for SOS team
    ```diff
    + Updated & compressed weights
        • Improves accuracy
        • More space for new features
    + Improved LOS detection
        • No more random numbers when only 1 station is out of range
        • Now notifies user which station lost signal
    + Fixed Speed divisor
        • System will now much more accurately report craft speed
    + Added Alignment feature
        • Easily line up with target point
    ```
    
- V2.3: First public release for EA!
    ```diff
    + Updated neural network weights for EA
    ```

- V2.2: **Internal test version**
    ```diff
    + Merged additional features into a single chip
        • Loss of Signal (LOS) reporting
        • Loss of Receiver dection
        • Speed calculator
        • System shutdown & reboot ("Streamer Mode")
    + YASM rewrite for easier code management
    ```

- V2.1: **Internal test version**
    ```diff
    + Merged Quad & Mono code into a single chip with hardware detection
        • biases were ommitted from this to save space 
            ○ (always 0 for dev-placed transmitters)
    ```

- V2.0: Internal test version, intended for use in CA.
    ```diff
    + Updated to new neural network style core
    ```

- V1: The original ISAN, developed in CA
    ```diff
        //TODO: original version notes
    ```