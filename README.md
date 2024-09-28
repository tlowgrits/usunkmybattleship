Psuedocode:

Players will arrive on a landing page and select Start Game to launch the game. (edit: instead of select player, used start game button instead)

Pieces are automatically set on the board and setup is concealed from both players. (edit: simplified as loading two separate pages became a challenge)

Once red has selected, the board updates with whether it was a hit or not (and a hint at what type of ship it is).

Switch to Blue,  repeat process.

Continue to repeat process until one team's boats are all sunk.

Data Structure:

Game state - determines who's turn it is, and tracks whether win conditions have been met

Player - assigns player color, tracks players ship, and will hold players hits & misses in order to generate the 2nd board on a players screen

Grids - array that will hold blank board and set board once players have selected where to place their ships

Ships - holds information on the different ships, including things like name, size, coordinates on the grid, and whether it has been sunk

Turn - a function that will handle capturing player grid selections and switching turns

Win Condition - checks to see if all ships have been sunk at the end of each turn