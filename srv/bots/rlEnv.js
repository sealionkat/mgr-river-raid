
export default class RlEnv {
  constructor() {

  }

  getNumStates() {
    return 8; // dimensionality of the state feature space not number of states
  }

  getMaxNumActions() {
    return 3; // move left, move right, stop/noop
  }

}