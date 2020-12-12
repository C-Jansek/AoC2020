const _ = require("lodash")

class Ship {
  /**
   * Constructor
   * @param {number[]} pos starting coordinates of ship
   * @param {string} facing single letter defining the cardinal direction the ship is facing
   * @param {object[]} directions array of cardinal directions, each with their coordinate representation on the unit cirle
   * @param {number[]} waypoint default: [10,0] - starting coordinates of the waypoint (relative to the ship)
   * @param {boolean} useWaypoint default: false - use the waypoint wayfinding or the normal wayfinding
   */
  constructor(
    pos,
    facing,
    directions,
    waypoint = [10, 0],
    useWaypoint = false
  ) {
    this.startingPos = _.cloneDeep(pos);
    this.pos = pos;
    this.facing = facing;
    this.directions = directions;
    this.waypoint = waypoint;
    this.useWaypoint = useWaypoint;
  }

  /**
   * Do action, F for move forward/to waypoint, L or R for turn/rotate, cardinal direction for move ship/waypoint
   * @param {string} action char representation of action
   * @param {number} val 
   */

  doAction(action, val) {
    if (this.useWaypoint) {
      if (["R", "L"].includes(action)) {
        this.rotateWaypoint(action, val);
      } else if (action === "F") {
        this.moveToWaypoint(val);
      } else {
        this.moveWaypoint(val, action);
      }
    }
    if (["R", "L"].includes(action)) {
      this.turn(action, val);
    } else {
      this.move(action, val);
    }
  }

  /**
   * Move ship in direction
   * @param {string} action char representation of direction (cardinal or Forward)
   * @param {number} distance distance to move in [action] direction
   * @return {number[]} current ship position
   */
  move(action, distance) {
    if (action === "F") {
      this.pos[0] +=
        this.directions.find((direction) => direction.cardinal === this.facing)
          .coords[0] * distance;
      this.pos[1] +=
        this.directions.find((direction) => direction.cardinal === this.facing)
          .coords[1] * distance;
    } else {
      this.pos[0] +=
        this.directions.find((direction) => direction.cardinal === action)
          .coords[0] * distance;
      this.pos[1] +=
        this.directions.find((direction) => direction.cardinal === action)
          .coords[1] * distance;
    }
    return this.pos;
  }

  /**
   * Turn the ship clockwise or counter-clockwise
   * @param {string} side Way to turn, R -> clockwise, L -> counter-clockwise
   * @param {number} angle Turn [angle] degrees
   * @return {string} char representation of cardinal direction currently facing
   */
  turn(side, angle) {
    const index = this.directions.indexOf(
      this.directions.find((direction) => direction.cardinal === this.facing)
    );
    const rotation = parseInt(angle / 90) * (side === "R" ? 1 : -1);
    const shift =
      index + rotation < 0
        ? index + rotation + this.directions.length
        : index + rotation;
    this.facing = this.directions[shift % this.directions.length].cardinal;
    return this.facing;
  }

  /**
   * Rotate waypoint around ship clockwise or counter-clockwise
   * @param {string} side Way to rotate, R -> clockwise, L -> counter-clockwise
   * @param {number} angle Rotate [angle] degrees
   * @return {number[]} current waypoint position (relative to ship)
   */
  rotateWaypoint(side, angle) {
    for (let i = 0; i < angle / 90; i++) {
      if (side === "L") this.waypoint = [-this.waypoint[1], this.waypoint[0]];
      else this.waypoint = [this.waypoint[1], -this.waypoint[0]];
    }
    return this.waypoint
  }

  /**
   * Move waypoint relative to its current location in cardinal direction
   * @param {number} distance
   * @param {string} action char representation of direction (cardinal)
   * @return {number[]} current waypoint position (relative to ship)
   */
  moveWaypoint(distance, action) {
    this.waypoint[0] +=
      this.directions.find((direction) => direction.cardinal === action)
        .coords[0] * distance;
    this.waypoint[1] +=
      this.directions.find((direction) => direction.cardinal === action)
        .coords[1] * distance;
    return this.waypoint;
  }

  /**
   * Move ship to the waypoint [amount] times
   * @param {number} amount
   * @return {number[]} current ship position
   */
  moveToWaypoint(amount) {
    this.pos[0] += this.waypoint[0] * amount;
    this.pos[1] += this.waypoint[1] * amount;
    return this.pos;
  }

  /**
   * Calculate Manhattan distance relative to the starting position
   * @return {number}
   */
  manhattanDistance() {
    return (
      Math.abs(this.pos[0] - this.startingPos[0]) +
      Math.abs(this.pos[1] - this.startingPos[1])
    );
  }
}

module.exports = Ship;
