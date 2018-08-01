// (function(){

  /* 

  CONTENTS

  - Class definitions:
    - Phase
    - Phase_noChildren
    - Phase_withChildren
      - Phase_par
      - Phase_seq
  - Phase_manager (TODO)

  STILL LEFT TODO:

  - RepeatCount implementation
  - Goto/next/prev implementation
  - Play/Pause

  PHASE CONSTRUCTOR OPTIONS OBJECT PROPERTIES:

  - id
  - app
  - delay
  - duration
  - ... more to come? RepeatCount, etc. ...


  */

  // Classes


/* 
  Phase.states = { 
    idle: 1,      // Unactivated and waiting (possible due to a delayed start)
    running: 2,   // Active and running
    complete: 3   // Completed being active
  }; */

  export default class Phase {

    constructor(options) {
      options = Object.assign({
        id: '_rand_' + Math.floor(Math.random() * 1000),
        app: undefined,
        delay: 0,
        duration: Infinity
      }, options);

      this.id = options.id;
      this.app = options.app;
      this.delay = options.delay;
      this.duration = options.duration;

      this.currentState = 'idle';
      this.timer = null;
    }

    // Given state s, if the Phase isn't already 
    //  in that state, change state to s
    //  (note: does not check for allowed/disallowed transitions)

    set state(s) {
      if (this.currentState !== s) this.currentState = s;
    }

    get isComplete() {
      return (this.currentState === 'complete')
    }

    // Change state to complete and notify App

    complete(onComplete) {
      this.state = 'complete';
      this.notifyInactive();
      this.clearTimer();
      if (typeof onComplete === 'function') onComplete();
    }

    // Change state to running and notify App

    startRunning() {
      this.state = 'running';
      this.notifyActive();
    }

    // Notifications to App
    // Note that active/inactive are messages to App,
    //  but are not the same as the Phase states
    //  of idle/running/complete

    notifyActive() {
      this.app.phaseActive(this.id);
    }

    notifyInactive() {
      this.app.phaseInactive(this.id);
    }

    // Schedule a full run -- 
    //  delay, then afterDelay(), then duration, then afterDuration()

    scheduleRun(stuffToDo) {

      stuffToDo = Object.assign({
        afterDelay: () => {},
        afterDuration: () => {} 
      }, stuffToDo);

      let thisPhase = this, 
        afterDelay, afterDuration;

      afterDuration = function() {
        thisPhase.forceComplete();
        stuffToDo.afterDuration();
      }

      afterDelay = function () {
        stuffToDo.afterDelay();
        if (thisPhase.duration < Infinity) {
          thisPhase.waitAndCall(thisPhase.duration, afterDuration);
        }
      };

      this.state = 'idle';
      this.waitAndCall(this.delay, afterDelay);
    }

    // Schedule a future function call

    waitAndCall(timeInMillieconds, aFunction) {
      this.timer = window.setTimeout(aFunction, timeInMillieconds);
    }

    // Clears currently running timer

    clearTimer() {
      if (this.timer !== null) {
        clearTimeout(this.timer);
        this.timer = null;
      }
    }

    // Phase subclass factory -- this is called by FlightPlan

    static createType(type, options) {
      if (Phase.types[type] !== undefined) {
        return new Phase.types[type](options);
      }
    }
  }

  // This is the "leaf" object -- does not contain
  //  any children (it may not be necessary)

  class Phase_noChildren extends Phase {

    constructor(options) {
      super(options);
    }

    forceComplete() {
      this.complete();
    }

    get isContainer() { return false }

    // Main run routine
    // Schedule to run after delay and call
    //  onComplete after duration

    run(onComplete) {

      let thisPhase = this;
      
      let callAfterDelay = function () {
        thisPhase.startRunning();
      }

      this.scheduleRun({
        afterDelay: callAfterDelay,
        afterDuration: onComplete
      });
    }
  }

  // TimeContainer abstract class

  class Phase_withChildren extends Phase {

    constructor(options) {
      super(options);
      this.childPhases = [];
    }

    get isContainer() { return true }

    addChild(childPhase) {
      childPhase.parentPhase = this;
      childPhase.app = this.app;
      this.childPhases.push(childPhase);
    }

    forceChildrenToComplete() {
      this.childPhases.forEach(childPhase => childPhase.forceComplete());
    }

    forceComplete() {
      this.forceChildrenToComplete();
      this.complete();
    }
  }

  // Parallel TimeContainer

  class Phase_par extends Phase_withChildren {

    constructor(options) {      
      super(options);
    }

    // Check if all the child phases have completed

    get allChildrenComplete() {
      return this.childPhases.every(childPhase => childPhase.isComplete)
    }

    // Start all child phases running

    runAllChildren(onChildComplete) {
      this.childPhases.forEach(childPhase => childPhase.run(onChildComplete));
    }

    // Generate a function that is called every time a child completes.
    // If all children are complete, transition this phase to complete

    getOnChildCompleteCallback(onThisPhaseComplete) {

      let thisPhase = this;

      return function() {
        if (thisPhase.allChildrenComplete) {
          onThisPhaseComplete();
        }
      }
    }

    // Main run routine

    run(onComplete) { 

      let thisPhase = this;

      // Schedule to start running after delay

      let onChildComplete = this.getOnChildCompleteCallback(onComplete);

      let callAfterDelay = function () {
        thisPhase.startRunning();
        thisPhase.runAllChildren(onChildComplete); // Run children
      }

      this.scheduleRun({
        afterDelay: callAfterDelay,
        afterDuration: onComplete
      });
    }
  }

  // Sequence TimeContainer

  class Phase_seq extends Phase_withChildren {

    constructor(options) { 
      super(options);
    }

    // Start all child phases running
    // (recurse through children)

    runAllChildren(onLastChildComplete) {
      let firstChildIndex = 0;
      this.runChild(firstChildIndex, onLastChildComplete);
    }

    // notifyParentCallback is provided by parentPhase to let it 
    //  know when sequence is complete

    runChild(currChildPhaseIndex, onLastChildComplete) {

      let thisPhase = this,
        isLastChild = this.childPhases.length === currChildPhaseIndex + 1,
        currentChild = this.childPhases[currChildPhaseIndex],
        onChildComplete;

      // If this is the last child Phase, 
      //  complete this Phase when the child is complete

      if (isLastChild) {
        onChildComplete = function () { 
          thisPhase.complete();
          onLastChildComplete();
        }
      } else { 

        // If this is not the last child Phase, 
        //  run the next child when this child Phase is complete

        onChildComplete = function () {
          thisPhase.runChild(currChildPhaseIndex + 1, onLastChildComplete);
        }
      }
    
      currentChild.run(onChildComplete);
    }

    // Main run routine

    run(onComplete) {

      let thisPhase = this;

      // Schedule to start running after delay

      let callAfterDelay = function () {
        thisPhase.startRunning();
        thisPhase.runAllChildren(onComplete); // Run children
      }

      this.scheduleRun({
        afterDelay: callAfterDelay,
        afterDuration: onComplete
      });
    }
  }

  // Map @phase-type values to Classes

  Phase.types = {
    par: Phase_par,
    parallel: Phase_par,
    seq: Phase_seq,
    sequence: Phase_seq,
    leaf: Phase_noChildren
  }

  // The master clock (from TSS) -- CURRENTLY NOT USED

	class Tempo {
    constructor() {
      this.timeout = 40;	 // clock timeout: 40ms or 25 fps
      this.itemList = [];  // list of items that require time support */
      this.lastTimeout = performance.now();	// last registered time
			this.timeupdate();
    }

    add(item) {

      if (! this.itemList.includes(item)) {

        this.itemList.push(item);

        // Is it the first item? If so, start the timer

        if (this.itemList.length === 1) {
          this.lastTimeout = null;
          this.timeupdate();
        }

        return true;
      } else {
        return false;
      }
    }

    remove(item) {

      const index = this.itemList.indexOf(item);
      
      if (index !== -1) {
        this.itemList.splice(index, 1);
        return true;
      } else { return false }
    }

    timeupdate() {
      if (this.itemList.length !== 0) {
        let now = performance.now(),
            timeOffset = now - this.lastTimeout;
        
        this.lastTimeout = now;

        // update current time of all registered elements
        // TODO: look at this trigger thing

        this.itemList.forEach((item) => item.trigger('tempoupdate', timeOffset));

        // recursively re-run the function
        // TODO: tempo should probably live somewhere else
        setTimeout('window.tempo.timeupdate()', this.timeout);
      }
    }
  }

  Phase.clock = new Tempo();
  
  function test() {

    let a = new App();

    // SEQ test

    let seqTest = new Phase_seq({ app: a });
    seqTest.addChild( new Phase_noChildren({ app: a, duration: 1000, delay: 2000 }) );
    seqTest.addChild( new Phase_noChildren({ app: a, duration: 2000, delay: 1000 }) );
    seqTest.addChild( new Phase_noChildren({ app: a, duration: 1000 }) );

    window.a = a;
    window.seqTest = seqTest;

    // console.log("TESTING SEQUENCE");
    // seqTest.run(() => console.log("SEQUENCE TEST COMPLETE"));


    // SEQ test with duration - will interrupt

    let seqTest2 = new Phase_seq({ app: a, duration: 5000 });
    seqTest2.addChild( new Phase_noChildren({ app: a, duration: 1000, delay: 2000 }) );
    seqTest2.addChild( new Phase_noChildren({ app: a, duration: 2000, delay: 1000 }) );
    seqTest2.addChild( new Phase_noChildren({ app: a, duration: 1000 }) );

    window.a = a;
    window.seqTest = seqTest;
    window.seqTest2 = seqTest2;

    //console.log("TESTING SEQUENCE WITH DURATION");
    //seqTest2.run(() => console.log("SEQUENCE TEST WITH DURATION COMPLETE"));

    // PAR TEST

    let parTest = new Phase_par({ app: a });
    parTest.addChild( new Phase_noChildren({ app: a, duration: 1000 }) );
    parTest.addChild( new Phase_noChildren({ app: a, duration: 2000 }) );
    parTest.addChild( new Phase_noChildren({ app: a, duration: 1000 }) );

    window.parTest = parTest;

    console.log("TESTING PARALLEL");
    parTest.run(() => console.log("PARALLEL TEST COMPLETE"));

  }

  // test();

// })();