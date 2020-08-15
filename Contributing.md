# How to Contribute

The Collective has completely open-sourced ISAN. As such you'll see the development unfold here, not just the pretty final releases. We welcome any outside ideas & help!

There are two main parts to ISAN: The Core & Addons. "The Core" refers to any part of the system directly involved in resolving the coordinates of any set of receivers. "A core" is the entire system required to resolve the position of a particular set of receivers. Addons are extra modules that use this position data to implement new functionality. Some examples in ISANv2:

- Some parts of the core
    - Axis processors: Evaluates an axis equation to resolve one or more of the X,Y,Z coordinate
    - Inversion Engine: Performs a matrix inversion in order to calculate constants for Axis processors
    - Scanner: Selects transmitters to use as reference points and sets up the receivers & global fields as necessary.

- Some planned Addons
    - Velocity: Uses multiple samples of the ships position in order to determine average velocity.
    - Autopilot: Pilots the ship based on input from one or more ISAN cores.

You can contribute to both of these, however the methods are a little different:
 - [Contributing a new addon or new addon idea](#Contributing-a-new-addon-or-new-addon-idea)
 - [Contributing an implementation of an already given idea (Issue already exists)](#Contributing-an-implementation-of-an-already-given-idea-(Issue-already-exists))
 - [There's already an existing WIP repo, but I want to make my own version.](#There's-already-an-existing-WIP-repo,-but-I-want-to-make-my-own-version.)
 - [Contributing to The Core](#Contributing-to-The-Core)
 - [Reporting bugs](#Reporting-bugs)

## Contributing a new addon or new addon idea

**FIRST CHECK THAT IT HASN'T ALREADY BEEN OPENED AS AN ISSUE**

Open an issue titled "New Addon:" followed by a descriptive name for your addon, the comment should contain a brief explanation of your addons intended purpose. This lets people know that it's already suggested & potentially being worked on. 

If you wish to not only suggest the idea, but implement it yourself: Fork the repo & create a new branch titled `dev-addon-<your addon name>` from the dev branch. Post a comment on the issue you've created containing "WIP" and a link to **the branch** you just created in your fork. You can create further branches from there if need be, named like so: `dev-addon-<your addon name>-<sub branch name>`. All of the work for your addon should be done in a new folder: `Development/Addon Modules/<your addon name>`. This folder should follow the structure outlined in [Development/README.md](Development/README.md).

Complete your work in your own time, and once you're happy with how it's working. Submit a pull request to merge your branch into the `dev` branch.

## Contributing an implementation of an already given idea (Issue already exists)

Check the comments, if there's one that contains "WIP" and a link to a fork, work has already started. 

If there's no "WIP" comment, follow the instructions above as if you have just created the issue yourself and begin work in your own fork.

If there is, follow the link to the branch & contact the people working on it there, by convention, on the `dev-addon-<your addon name>`, there should be a README.md in `Development/Addon Modules/<your addon name>` that contains the contact information for the lead contributor(s).

## There's already an existing WIP repo, but I want to make my own version.

**DON'T JUST OPEN A NEW ADDON ISSUE WITH A DIFFERENT NAME**

Please at least try to work with the existing team. However, if there are conflicting views on how the project should proceed, contact one of the people listed below to resolve the conflict:
 - Solon (Solon#4472 on discord)
 - Azurethi (Azurethi#0789 on discord)

## Contributing to The Core

If you have some ideas, feel free to add them as issues titled "Core improvement:", followed by a brief explanatory title & further explanation in the issue comments. 

If you feel that have exceptionally important improvement ideas (something that will greatly improve speed, reduce chip count or improve accuracy), or if you would like to contribute to the implementation and further development of the core, please contact Solon (Solon#4472 on discord), who can be easily found in the Collective discord sever.

## Reporting bugs

Open an issue titled "BUG:" followed by a descriptive title. Then please provide as much information as possible on the nature of the bug & any way you have found to reproduce it.

Things that are not (always) bugs:
 - Signal loss: Unless you're definitely within range.
 - System failure after accidental or forced rapid disassembly