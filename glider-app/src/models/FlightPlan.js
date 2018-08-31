import App from '@/models/App.js'
import Phase from '@/models/Phase.js'
import Part from '@/models/Part.js'


/*


THE WAY THIS WORKS

- Starts with init()
- Calls parseFlightPlans with the starting DOM node
- ...which in turn calls parseFlightPlan (allows for the 
  possibility of multiple flight plans in a single doc)
- parseFlightPlan initialized a PPP register, which keeps 
  track of the current coordinate in PPP space -- this gets
  inherited down from parent DOM Elem to child
- parseFlightPlan then creates a default SEQ Phase for
  the root DOM elem and recurses down into the DOM children
- Each DOM child gets passed to parseDomElem, which receives
  the DOM element and the PPP Register. (There is also an
  optional flag, forceNewPhase, which is only set for the Phase 
  children of a PAR or SEQ phase)
- parseDomElem takes the element and passes it to 
  getDataFromDomElem, which returns a data structure with the
  information from the DOM element itself (e.g. its attributes, 
  etc.)
- Based on the data from getDataFromDomElem, parseDomElem now 
  creates new Parts, Places, and Phases (if indicated by the DOM)
  and accordingly updates the PPP Register. Once all changes 
  to the register are complete, the Register is asked to
  notify the App of a new PPP coordinate point.
- parseDomElem now recurses to the children of the DOM Element,
  calling parseDomElem in turn on each, and passing the new
  PPP Register.
- Repeat until done
- The return value for the parsing process is an array of 
  initialized App objects with all the PPP associations. All 
  that's left is to call App.run() and the phases kick into
  action

  

OUTLINE

- Fake class definitions (TEMP)
  Fake App, Fake Part, Fake Place -- stand-ins while Joel is 
  developing

- Utilities (TEMP)
  Misc functions that may or may not be used permanently
  - getHash() 
    simple hash generator
  - getIdFromDomPosition() 
    create a unique ID for a node based on its position 
    in the document
  - log()
    simple logger for debugging

- Constants
  Data structure for configuring the parser -- 
  e.g. DOM attribute names, etc.

- Parsing functions
  The main functions that perform the core parsing
  - parseFlightPlans()
  - parseFlightPlan()
  - parseDomElem()

- PPP_Register class
  This is what gets passed between parse levels;
  the register keeps track of the PPP objects that are
  'inherited' between parent and child DOM elements.
  The PPP_Register also can save a version of its state
  to the App object so that App can associate a Part, Phase,
  and Place with each other.

- Interfaces TO PPP constructors
  Functions that talk to the constructors and return 
  new Parts, Places, and Phases
  - getNewPhase()
  - getNewPart() - STUB
  - getNewPlace() - FORTHCOMING

- Data-fom-DOM functions
  These functions take a DOM element and extract the 
  data from it and save it to a data structure that is
  used by the parse functions.

  getDataFromDomElem() -- the main function which calls ...
    getPhaseDataFromDomElem()
    getPartDataFromDomElem()
    getPlaceDataFromDomElem() - FORTHCOMING

- init()
  The main initialization function, which just registers
  a call to parseFlightPlans() once DOMContentLoaded fires.

*/


// FAKE NEWS
//  Stand-ins for dev

// Fake App object

class FakeApp {

  constructor() { 
    this.startTime = new Date();
    this.rootPhase = undefined;
    this.pppStore = [];
  }

  // TODO: Should be able to add by object or by id
  //  (this is so that part-refs can be submitted and
  //   App can resolve it to the correct Part object)

  setPPP(pppCoordinate) {
    let { part, place, phase } = pppCoordinate;

    if (this.isID(part)) {
      part = this.getPartById(part);
    }

    this.pppStore.push(pppCoordinate);
    console.log(`Associating Phase ${phase.id} with Part ${part.id} and Place ${place.id}`);
  }

  isID(idOrObject) {
    return (typeof idOrObject === 'string');
  }

  getPartById(id) {
    if (isID(id)) {
      let matchingPPP = this.pppStore.filter(
        ppp => (ppp.part.id === id)
      );
      return (matchingPPP.length > 0) ? matchingPPP[0] : undefined;
    } else {
      return undefined;
    }
  }

  get elapsedTime() {
    return ((new Date()) - this.startTime) / 1000;
  }

  phaseActive(phaseObject) {
    console.log(`${phaseObject.id} is active at time ${this.elapsedTime}`);
    //console.log('Matching PartPlaces:' + this.partPlacesByPhase(phaseObject).map(pp => `${pp.part.id}::${pp.place.id}`).join(', '));
  }

  phaseInactive(phaseObject) {
    console.log(`${phaseObject.id} is inactive at time ${this.elapsedTime}`);
    //console.log('Matching PartPlaces:' + this.partPlacesByPhase(phaseObject).map(pp => `${pp.part.id}::${pp.place.id}`).join(', '));
  }

  partPlacesByPhase(phase) {
    return this.pppStore.filter(ppp => (ppp.phase === phase));
  }

  // Start the flight!

  run() {
    this.rootPhase.run();
  }
}

// Fake Part object
window.allParts = [];
class FakePart {

  constructor(options) {
    // #debug
 
    
    if(!options) {
      options = Object.assign({
        id: 'pt_' + Math.floor(Math.random() * 1000),
        type: '_default',
        options: [],
        container: undefined
      }, options);
    }

    this.app = options.app;
    this.id = options.id || 'pt_' + Math.floor(Math.random() * 1000);
    this.type = options.type;
    this.options = options.options;
    this.container = options.container;
    this.state = "inactive";

    // if(!!this.container)
    //   this.container.classList.add('hidden');

       window.allParts.push(this);
  }

  activate() {
    this.state="active";
    console.log(`activating part ${this.id}`);
  }

  deactivate() {
    this.state="inactive";
  }
}

// Fake Place object

window.totalPlaces = 0;
class FakePlace {
  constructor(id) {
    window.totalPlaces++;
    this.id = id || 'pl_' + Math.floor(Math.random() * 1000);
  }
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

// Utilities

// Simple hash function adapted from 
//  https://stackoverflow.com/questions/6122571/simple-non-secure-hash-function-for-javascript
// NOTE: Can return negative numbers; e.g. hash for 'strign' is -891986113

function getHash(string) {
  
  let hash = 0;
  
  string.split('').forEach((char) => {
    hash = ((hash << 5) - hash) + char.charCodeAt();
    hash = hash & hash; // Convert to 32bit integer
  });
  
  return hash;
}

// Get a unique identifier based on the position of the element in the DOM tree.
// Good for auto-generating IDs for elements that will be the same across Clients

function getIdFromDomPosition(domElement) {
  
  function makeId(domElement) {

    if (domElement === document.body) return ''; // boundary condition

    let previousSiblingCount = 0,
        currSibling = domElement;

    while (currSibling = currSibling.previousSibling) 
      previousSiblingCount++;

    return previousSiblingCount + '.' + makeId(domElement.parentNode);
  }
  
  return getHash(makeId(domElement));
}

let LOG_FLAG = {
  any: true
}

function log(text, category) {
  if (LOG_FLAG.any) {
    if (category === undefined)
      console.log(text);
    else if (LOG_FLAG[category] === undefined || LOG_FLAG[category]) {
      console.log(text);
    }
  }
}


// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

// CONSTANTS 
//  used for parsing

const PARSING_CONSTANTS = {
  FLIGHT_PLAN_SELECTOR: '.glider-root',
  PART: {
    TYPE_ATT_NAME: 'part-type',
    ID_ATT_NAME: 'part-id',
    OPTIONS_ATT_NAME: 'part-options'
  },
  PHASE: {
    TYPE_ATT_NAME: 'phase-type',
    TYPES: { PAR: 'par', SEQ: 'seq', LEAF: 'leaf' },
    DELAY_ATT_NAME: 'phase-begin',
    DURATION_ATT_NAME: 'phase-duration',
    ID_ATT_NAME: 'id',
    PHASE_DESCENDANT_SELECTOR: '*[phase-type],*[phase-duration],*[phase-begin]'
  },

  PLACE: {
    ID_ATT_NAME: 'place'
  }
}



// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

// PARSING FUNCTIONS

// Find all FlightPlans on page and parse

function parseFlightPlans(domRoot) {

  let flightPlanDomRoots = Array.from(
    domRoot.querySelectorAll(PARSING_CONSTANTS.FLIGHT_PLAN_SELECTOR)
  );

  // If none found, assume the DOM element passed _is_ the FlightPlan root

  if (flightPlanDomRoots.length === 0) {
    flightPlanDomRoots = [domRoot];
  }

  // Parse each FlightPlan

  let apps = flightPlanDomRoots.map(
    flightPlanDomRoot => parseFlightPlan(flightPlanDomRoot)
  );

  return apps;
}

// Parse a FlightPlan root
//  Create an App object, initialize a PPP Register

function parseFlightPlan(domElem) { 

  let app = window.glider, // Shared by everything in this Flight
      elemData = getDataFromDomElem(domElem),
      initPart, initPlace, initPhase;

  // TEMP FOR DEBUGGING -- Set app to Global


  // Create root Phase object (seq unless specified otherwise)

  let newPhaseType = (elemData.phase.type === 'par') ? 'par' : 'seq';
  initPhase = getNewPhase(elemData, app, newPhaseType);

  // Create root Part object
  // #ToDo Joel ask about this!

  initPart = new FakePart();

  // Create root Place object
  // #ToDO Joel ask about this!

  initPlace = new FakePlace();

  // Create initial PPPRegister

  let pppRegister_init = new PPP_Register({
    app: app,
    part: initPart,
    place: initPlace,
    phase: initPhase
  });

  // Save this to App - and set root Phase

  pppRegister_init.save();
  app.rootPhase = initPhase;

  // Recurse to children

  let forceNewPhase = true;

  Array.from(domElem.children).forEach(
    childElem => parseDomElem(childElem,  pppRegister_init, forceNewPhase)
  );

  return app;
}

// This is the main parsing function
// Checks to see if there's a change in PPP

function parseDomElem(domElem, pppRegister, forceNewPhase = false) { 

  let elemData = getDataFromDomElem(domElem),
    pppRegister_new = pppRegister.copy(),
    registerChanged = false;

    console.log(elemData);

  // If a Part definition, create new and update register
  // TODO: this is a stub

  if (elemData.part.definesNewPart) {
    let newPart = getNewPart(elemData, pppRegister.app);
    pppRegister_new = pppRegister_new.changePartTo(newPart);
    registerChanged = true;
  }

  // If a change of Place, create new and update register
  // TODO: this is a stub; Joel needs help here...

  if (elemData.place.changesPlace) {
    let newPlace = new Place();
    pppRegister_new = pppRegister_new.changePartTo(newPlace);
    registerChanged = true;
  }

  // If a change of Phase (or forced to create a new Phase because 
  //  this is the child of a par or seq),
  //  create new and update register

  if (elemData.phase.definesNewPhase || forceNewPhase) {

    let parentPhase = pppRegister.phase,
      //newPhaseOptions = getPhaseConstructorOptionsFromElemData(elemData),
      //newPhase = Phase.createType(newPhaseOptions.type, newPhaseOptions);
      newPhase = getNewPhase(elemData, pppRegister.app);

    parentPhase.addChild(newPhase); // New Phase is child of parent
  
    pppRegister_new = pppRegister_new.changePhaseTo(newPhase);
    registerChanged = true;
  }

  // If register has changed, save this PPP coordinate

  if (registerChanged) {
    pppRegister_new.save();
  }

  // Parse child elements
  // (force children to have new Phases if this is a container Phase)

  let forceChildrenToHaveNewPhase = (elemData.phase.definesNewPhase && elemData.phase.isContainer);

  Array.from(domElem.children).forEach(
    child => parseDomElem(child, pppRegister_new, forceChildrenToHaveNewPhase)
  );
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
// REGISTER CLASS

class PPP_Register {

  constructor (options) {
    this.app = options.app;
    this.part = options.part;
    this.place = options.place;
    this.phase = options.phase;
  }

  get state() {
    return {
      app: this.app,
      part: this.part,
      place: this.place,
      phase: this.phase
    }
  }

  // Return a new register with updated options

  updateAndCopy(stateUpdate) {
    let newState = Object.assign(this.state, stateUpdate);
    return new PPP_Register(newState);
  }

  // Change some aspect of the register and return an 
  //  updated copy

  changePartTo(part) { 
    return this.updateAndCopy({ part: part });
  }
  
  changePlaceTo(place) { 
    return this.updateAndCopy({ place: place });
  }

  changePhaseTo(phase) { 
    return this.updateAndCopy({ phase: phase });
  }

  copy() {
    return this.updateAndCopy({});
  }

  // Save register to App

  save() {
    this.app.setPPP({
      part: this.part,
      place: this.place,
      phase: this.phase
    });
  }
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
// INTERFACES TO PPP CONSTRUCTORS

// Phase

function getNewPhase(elemData, app, typeArg) {

  let options = {};
  
  options.app = app;
  options.delay = elemData.phase.delay;
  options.duration = elemData.phase.duration;

  if (elemData.phase.hasId) 
    options.id = elemData.phase.id;

  // If there are no new Phase definitions within the 
  //  descendents, then create a leaf Phase

  let type;

  if (typeArg !== undefined) {
    type = typeArg
  } else if (elemData.phase.hasType) {
    type = elemData.phase.type;
  } else if (elemData.phase.hasNoPhaseDescendents) {
    type = 'leaf';
  } else {
    type = 'par';
  }

  return Phase.createType(type, options);
}

// Part

function getNewRealPart(elemData, app) {

  return new Part({
    app: app,
    id: elemData.part.id,
    type: elemData.part.type,
    options: elemData.part.options,

    // changed to "container" to match data
    container: elemData.part.container
  });
}

function getNewPart(elemData, app) {

  return new FakePart({
    app: app,
    id: elemData.part.id,
    type: elemData.part.type,
    options: elemData.part.options,

    // changed to "container" to match data
    container: elemData.part.container
  });
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
// DATA-FROM-DOM FUNCTIONS

function getDataFromDomElem(domElem) {

  let phaseData = getPhaseDataFromDomElem(domElem),
    partData = getPartDataFromDomElem(domElem),
    placeData = getPlaceDataFromDomElem(domElem);

    // tested to this point
    // console.log(`PlaceData is ${placeData.id}`);

  return {
    domNode: domElem,
    part: partData,
    place: placeData,
    phase: phaseData
  }
}

// DATA-FROM-DOM FUNCTIONS: Phase

function getPhaseDataFromDomElem(domElem) {

  function getPhaseIdFromDomElem(domElem) {
    return domElem.getAttribute(PARSING_CONSTANTS.PHASE.ID_ATT_NAME);
  }

  function getPhaseTypeFromDomElem(domElem) {
    return domElem.getAttribute(PARSING_CONSTANTS.PHASE.TYPE_ATT_NAME);
  }

  function getDelayFromDomElem(domElem) {
    let delayAttValue = domElem.getAttribute(PARSING_CONSTANTS.PHASE.DELAY_ATT_NAME);
    return (delayAttValue !== null) ? normalizeTimeToMS(delayAttValue) : null;
  }

  function getDurationFromDomElem(domElem) {
    let durationAttValue = domElem.getAttribute(PARSING_CONSTANTS.PHASE.DURATION_ATT_NAME);
    return (durationAttValue !== null) ? normalizeTimeToMS(durationAttValue) : null;
  }

  // Given a duration as string, return a float normalized to milliseconds
  //  (currently only handles ms and s)

  function normalizeTimeToMS(timeString) {

    let msMatch = timeString.match(/^\s*([\d\.]+)\s*ms\s*$/i);
    if (msMatch !== null) 
      return parseFloat(msMatch[1]);

    let sMatch = timeString.match(/^\s*([\d\.]+)\s*s\s*$/i);
    if (sMatch !== null) 
      return parseFloat(sMatch[1]) * 1000;

    return parseFloat(timeString);
  }

  // Does this domElem have any ancestors that defined Phases?

  function elemHasNoPhaseDescendents(domElem) {
    let results = domElem.querySelectorAll(PARSING_CONSTANTS.PHASE.PHASE_DESCENDANT_SELECTOR);
    return (results.length === 0);
  }

  // Get Phase data from DOM

  let dur = getDurationFromDomElem(domElem),
      delay = getDelayFromDomElem(domElem),
      id = getPhaseIdFromDomElem(domElem),
      phaseType = getPhaseTypeFromDomElem(domElem);

  // Compile data object

  let phaseData = { 
    id: id,
    hasId: (id !== null),
    duration: dur,
    hasDuration: (dur !== null),
    delay: delay,
    hasDelay: (delay !== null),
    hasNoPhaseDescendents: elemHasNoPhaseDescendents(domElem),
    type: phaseType,
    hasType: (phaseType !== null),
    isContainer: (phaseType === 'par' || phaseType === 'seq')
  };

  phaseData.definesNewPhase = (phaseData.hasDuration || phaseData.hasDelay || phaseData.hasType);

  return phaseData;
}

// DATA-FROM-DOM FUNCTIONS: Parts

function getPartDataFromDomElem(domElem) {

  function getPartTypeFromDomElem(domElem) {
    return domElem.getAttribute(PARSING_CONSTANTS.PART.TYPE_ATT_NAME);
  }

  function getPartIdFromDomElem(domElem) {
    return domElem.getAttribute(PARSING_CONSTANTS.PART.ID_ATT_NAME);
  }

  // TODO: stub. Attribute format is key1=val1;key2=val2;key3=val3
  //  but this should be changed

  function getPartOptionsFromDomElem(domElem) {
    let optionsString = domElem.getAttribute(PARSING_CONSTANTS.PART.OPTIONS_ATT_NAME);
    if (optionsString !== null) {
      return optionsString.split(';').map(keyValue => keyValue.split('='));
    } else return null;
  }

  // Get Part data from DOM

  let type = getPartTypeFromDomElem(domElem),
    id = getPartIdFromDomElem(domElem),
    options = getPartOptionsFromDomElem(domElem),
    partContainer = domElem,
    definesNewPart = true;

  return {
    type: type,
    id: id,
    options: options,
    container: partContainer,
    definesNewPart: definesNewPart
  }
}

// DATA-FROM-DOM FUNCTIONS: Places temp from Joel. 
// #ToDo Still need to figure out how this Place data gets to App.js
// #ToDo does every phase need place defined? Probably, right?

function getPlaceDataFromDomElem(domElem) {
  return {
    id: domElem.getAttribute(PARSING_CONSTANTS.PLACE.ID_ATT_NAME)
  }
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
// Main -- call parseFlightPlans on DOM load

function init() {
  window.glider = new App();
  document.addEventListener('DOMContentLoaded', () => {
    let apps = parseFlightPlans(document.body);
    //console.log(apps[0]);
    if (apps.length > 0) {
      apps[0].run();
    }
  });
}

init();