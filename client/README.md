# Frontend project for the Planning Poker tool

React frontend application which handels the connections, states and user details for given socket events.

## Socket event details

### The application listens to the following events:
- Lobby event(s)
    - create-room-processed 
    - join-room-emit-processed
    - retrieve-room-state
    - join-room-processed
    - disconnect-room-processed
- User event(s)
    - registration-processed
- Vote event(s)
    - vote-processed
    - vote-reveal-countdown
    - vote-reveal-now
    - vote-reset-processed

### The application is emitting the following events:
- Lobby event(s)
    - create-room
    - join-room
    - get-room-state
- User event(s)
    - create-user
- Vote event(s)
    - vote
    - reveal-votes
    - reset-votes

<br>
## Available Commands

### `npm run build`