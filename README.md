# bowling-game

bowling-game is a real-time multiplayer game of bowling based on Node + Express + Socket.io.

## Storyboard

- The player signs in in order to identify herself.
- The player chooses from either one of the available games in the lobby or creates a new game (status = waitin)
- The player waits for other players to join. Then she presses the start button in order to switch the games (status = in_progress)
- The first player has a "Roll" button at his disposal. This button throws a random roll between 0 and 10
- The other players are notifies through websocket about the roll
- The game continues until there is a winner.

## Demo
https://my-bowling-game.herokuapp.com/

## Installation

### Local

```
npm install
```

```
npm run build-prod
```

```
npm run start-local-prod
```

## Technology stack

Server-side:

- Node.js
- Express
- Socket.io for the websocket support
- MongoDB behind mongoose ODM
- Passport with cookie based authentication and session managemnt

Client-side

- React.js 
- redux
- Immutable.js 


## Author

Georgi Kosharov

## License

MIT




