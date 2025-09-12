function useState(initialState) {
    let state = initialState;

    function setState(newState) {
        state = newState;
    }

    function getState() {
        return state
    }

    return [getState, setState];
}

class Task {
    constructor(task) {
        this.task = task;
        this.favorite = false;
        this.done = false;
        this.id = Date.now();
    }
}

export { useState, Task };