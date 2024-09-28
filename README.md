Name: U Sunk My Battleship
Getting Started: 
Instructions
1. Hit "Start Game" to automatically set pieces.
2. Red Team starts and selects a space on the Blue Team's board.
3. If a hit, space will fill with a hint as to what ship type it is.
4. If a miss, space will be colored white.
5. Turn switches after a hit or a miss and continues until all battleships are sunk.

Link to game: https://tlowgrits.github.io/usunkmybattleship/

Attributions: MDN, W3Schools for help with automating ship placement.

Technologies Used: Javascript, HTML, CSS

Next Steps:
1. Resolve titling issue & remove preview of Red Team's Board placement.
2. Add pictures and animations.
3. Style board.

Screenshot: 

![screenshot of program](<assets/Screen Shot 2024-09-28 at 9.15.10 AM.png>)




















Planning materials:

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