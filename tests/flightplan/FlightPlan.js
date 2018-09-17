
/*

OUTLINE
- Some Fake classes that serve as stand-ins during dev
  - FakeApp, FakePart, FakePlace
- Utility functions
  - getHash()
  - getIdFromDomPosition()
- User-config constants
- High-level parsing functions 
  (they don't access the DOM directly, but do the high-level
  analysis and recursion)
  - parseFlightPlans
  - parseFlightPlan
  - parseDomElem
- Register class
  (This object keeps track of "current" Parts, Places, Phases
  as the DOM is parsed)
- Interfaces to PPP constructors
  (routines to talk to Part/Place/Phase constructors to get
  new instances back)
  - getNewPhase(), getNewPart(), getNewPlace()
- Data from DOM functions
  (Routines that look at the DOM and pull out the data as
  it relates to PPP definitions. This data is passed back to 
  the high-level parsing functions)
  - getDataFromDomElem(), which calls:
    - getPhaseDataFromDomElem()
    - getPartDataFromDomElem()
    - getPlaceDataFromDomElem()
- init()
  (the main routine)


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

MARKUP SCHEMA

This current version allows for multiple FlightPlans on a 
single page. In practice, this may never occur, but it could
allow for e.g. a webpage with several embedded Flights, or
a dashboard of controllers for several Flights.

This could, of course, be also achieved with iframes.

Currently, the only Flight that is run is the first one encountered.

Note: much of the parsing takes place in getPartDataFromDomElem(),
      getPhaseDataFromDomElem(), and getPlaceDataFromDomElem().
      These functions look at the passed DOM node and extract
      the markup and translate it into a data structure.

Phases
- The root Phase-type is SEQ by default unless specified otherwise
- Immediate children of SEQ and PAR are themselves Phases, even
  if not explicitly indicated (they need to be, because those
  children need to activate/deactivate, etc.)
- A new Phase is created from a DOM node IFF one or more of
  the following are true:
    - there is a duration specified
    - there is a delay specified
    - a phase-type is specified

Parts

- A new Part is created from a DOM node IFF one or more of:
  - there is a @part-type or class part-* OR (failing that)
  - the element identifies a Phase, so it must also
    identify a new Part (because SOMEthing needs to
    receive messages from the Phase). In this case, the
    Part is a default Part Type (pass-through / identity)
- The part ID is taken from
  - the @part-id attribute OR (failing that)
  - the @part-ref attribute OR (failing that)
  - the @id attribute
- The Part type is taken from:
  - the @part-type attribute OR (failing that)
  - a .part-* classname OR (failing that)
  - the default part type (part-type-identity) NOT IMPLEMENTED

Part Views

- Must be defined as an immediate child of a Part-defining
  element.
- Is defined through the use of:
  - @part-view
  - CSS classname part-<PART TYPE>-<VIEW NAME>
      (Note that the inclusion of the Part Type in the 
        classname does NOT instantiate a Part -- that must be
        done in the parent element)
- If the Part element has NO View-defining children, then all
  element content is put into a default View
- If the child of a Part element does not define a View,
  then that element goes into the default View

Part References

- Defined through @part-ref -- e.g. part-ref="#abc"
- They serve to: 
  - associate a previously used Part with a (new) Phase
  - change a Part's state (as options) at a given Phase
- They do NOT:
  - Introduce or change Views -- they only work with Parts
    (this could potentially change, if we decide that 
      the author should be able to move Views to different 
      Places)

Places
- Places have two aspects, arranged in a hierarchy
  - The Role (level 1) -- this is the equivalent of a 
    'display/device class', e.g. "The DSL wall", 
    "audience phones", etc.
  - The Region (level 2) -- this is the area of the
    display to put the Part. What exactly this means depends 
    on the Place-type.
- The Flight root starts with a null Place -- that is,
    one in which Role and Region are set to UNDEFINED
    (the content will go to all Roles, and Region is not set)
- The Role/Region is/are set according to the following
  order (from highest precedent to lowest):
  - the @place-role and @place-region attributes OR (failing that)
  - the @place attribute (of form "<ROLENAME>-<REGIONNAME>") 
    OR (failing that)
  - a classname of format place-<ROLENAME>-<REGIONNAME> 
    (where REGIONNAME is optional)
- If you have a bunch of elements that all are for a single Role,
  you can define the Role in a parent element and then
  defined the Regions (if needed) in the descendents without
  re-stating the Role -- in other words, the Role is inherited.
  - NOTE THAT for now, a Role assigned by an element
    can NOT be reassigned by an ancestor -- you're stuck with it!

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
    // this.pppStore = [];
    this.partsPhases = []; // Associate Parts and Phases
    this.partsViewsPlaces = []; // Associate Parts, Views, and Places
  }

  // TODO: Should be able to add by object or by id
  //  (this is so that part-refs can be submitted and
  //   App can resolve it to the correct Part object)
  //  DEFUNCT

  /*
  setPPP(pppCoordinate) {
    let { part, partView, place, phase } = pppCoordinate;

    if (this.isID(part)) {
      part = this.getPartById(part);
    }

    this.pppStore.push(pppCoordinate);
    console.log(`Associating Phase ${phase.id} with Part ${part.id} and Place ${place.id}`);
  }
  */

  // UNDER DEV - START 

  setPartPhase(args) {
    let { part, phase } = args;
    console.log(`Setting Part ${part.id} to Phase ${phase.id}`);
    if (this.doesNotHavePartPhase(args)) {
      this.partsPhases.push(args);
    }
  }

  setPartViewPlace(args) {
    let { part, partView, place } = args;
    console.log(`Setting [Part ${part.id} > View ${partView}] to Place ${place.id}`);
    if (this.doesNotHavePartViewPlace(args)) {
      this.partsViewsPlaces.push(args);
    }
  }

  doesNotHavePartPhase(query) {
    let { part, phase } = query;
    return ! this.partsPhases.some(
      partPhase => (partPhase.part === part && partPhase.phase === phase)
    );
  }

  doesNotHavePartViewPlace(query) {
    let { part, partView, place } = query;

    return ! this.partsViewsPlaces.some(
      partViewPlace => (
        partViewPlace.part === part 
        && partViewPlace.partView === partView
        && partViewPlace.place === place
      )
    )
  }

  // TODO: UNTESTED

  getPartByPhase(phase) {
    return this.partsPhases.filter(
      partPhase => (partPhase.phase === phase)
    );
  }

  // UNDER DEV - END 

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

  toString() {

    let thisApp = this;

    function printPart(part) {
      const views = thisApp.partsViewsPlaces
      .filter(pvp => pvp.part === part)
      .map(pvp => { return { 
        view: pvp.partView, 
        place: pvp.place.id 
      }});

      const phases = thisApp.partsPhases
      .filter(pp => pp.part === part)
      .map(pp => pp.phase.id);

      return {
        part: part.id,
        views: views,
        phases: phases
      }
    }

    return JSON.stringify(
      thisApp.partsPhases.map(partPhase => {
        return printPart(partPhase.part)
      }), null, '  ')
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
  constructor(options) {

    window.totalPlaces++;

    this.id = options.id || 'pl_' + Math.floor(Math.random() * 1000);
    this.app = options.app;
    this.role = options.role;
    this.region = options.region;

    this.roleNotSet = (options.role === undefined);
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
// (Currently not used)

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
    ID_ATT_NAME: 'id',
    PART_ID_ATT_NAME: 'part-id',
    PART_REF_ATT_NAME: 'part-ref',
    PART_ATT_NAME: 'part',
    TYPE_ATT_NAME: 'part-type',
    VIEW_ATT_NAME: 'part-view',
    OPTIONS_ATT_NAME: 'part-options',
    SELECTOR_PREFIX: 'part-',
    CLASSNAME_PREFIX: 'part-',
    TYPE_VIEW_DELIMITER: '-',
    TYPE_CSS_CLASS_PATTERN: /^part-([^\-\s]+)$/,
    VIEW_CSS_CLASS_PATTERN: /^part-[^\-\s]+-([^\-\s]+)$/,
    DEFAULT_VIEW_NAME: '_DEFAULT'
  },

  PHASE: {
    ID_ATT_NAME: 'id',
    TYPE_ATT_NAME: 'phase-type',
    TYPES: { PAR: 'par', SEQ: 'seq', LEAF: 'leaf' },
    DELAY_ATT_NAME: 'phase-begin',
    DURATION_ATT_NAME: 'phase-duration',
    PHASE_DESCENDANT_SELECTOR: '*[phase-type],*[phase-duration],*[phase-begin]'
  },

  PLACE: {
    ID_ATT_NAME: 'place',
    PLACE_ATT_NAME: 'place',
    ROLE_ATT_NAME: 'place-role',
    REGION_ATT_NAME: 'place-region',
    SELECTOR_PREFIX: 'place-',
    CLASSNAME_PREFIX: 'place-',
    ROLE_REGION_DELIMITER: '-'
  }
}



// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

// PARSING FUNCTIONS

// Find all FlightPlans on page and parse each with parseFlightPlan()
//  Returns an array of App objects
//  (This allows for separate Flights on a single page, which may or may not
//    provide useful)

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
//  Recurse into child DOM elements
//  Return the App object

function parseFlightPlan(domElem) { 

  let app = new FakeApp(),
      elemData = getDataFromDomElem(domElem),
      initPart, initPlace, initPhase;

  // Create root Phase object (seq unless specified otherwise)

  let newPhaseType = (elemData.phase.type === 'par') ? 'par' : 'seq';
  initPhase = getNewPhase(elemData, app, newPhaseType);

  // Create root Part object
  // #ToDo Joel ask about this!
  // TODO: What kind of part is the root?
  // TODO: Can the root be a specified Part?

  initPart = new FakePart(); // TODO: This should use getNewPart()

  // Create root Place object
  // #ToDO Joel ask about this!
  // TODO (Patrick): This should probably be an 'all' Place
  //  i.e. ROLE=undefined, and REGION=UNDEFINED

  initPlace = new FakePlace({}); // TODO: This should use getNewPlace()

  // Create initial PPPRegister

  let pppRegister_init = new PPP_Register({
    app: app,
    part: initPart,
    partView: undefined,
    place: initPlace,
    phase: initPhase
  });

  // Save this to App - and set root Phase

  pppRegister_init.save();
  app.rootPhase = initPhase;

  // Recurse to children by passing them to parseDomElem()

  let forceNewPhase = true;

  Array.from(domElem.children).forEach(
    childElem => parseDomElem(childElem,  pppRegister_init, forceNewPhase)
  );

  return app;
}

// This is the main parsing function for non-root DOM elements.
// Checks to see if there's a change in PPP

function parseDomElem(domElem, pppRegister, forceNewPhase = false, isChildOfPart = false) { 

  let elemData = getDataFromDomElem(domElem),
    pppRegister_new = pppRegister.copy(),
    registerChanged = false,
    tellChildrenTheyHaveAPartParent = false,
    forceChildrenToHaveNewPhase;

  // If a Part definition, create new and update register

  /*

    App.setPartViewToPlace(PartView, Place)
    App.setPartToPhase(Part, Phase)

      - The app associates 
        - Part / PartView / Place
        - Part / Phase

    Who checks about the uniqueness of the Part?
      Or if you need to create a new Part? 
      Is it app or flightPlan?
      (Only App knows about previous Parts, but the
      markup should indicate if it's a reused component)
  */

  // If this is the direct child of a Part
  //   if it also defines a new PartView, 
  //     then set it to the current PartView in the register
  //   otherwise, set the register PartView to the default view

  const partViewImplicitlyDeclared = isChildOfPart;

  if (partViewImplicitlyDeclared) {

    if (elemData.part.definesNewPartView) {
      let newPartViewName = elemData.part.view;
      pppRegister_new = pppRegister_new.changePartViewTo(newPartViewName);
    } else {
      pppRegister_new = pppRegister_new.changePartViewTo(
        PARSING_CONSTANTS.PART.PART_DEFAULT_VIEW_NAME
      )
    }

    registerChanged = true;
  }

  // Conditions for defining a new Part:
  //  Either the markup explicitly declares a new Part OR
  //   it defines a new Phase which requires a Part to reference
  //   (which is always the case with Phase children of Container Phases)
  // Ignore part definition if also defines a PartView
  //  (NOTE: this may be chaged in the future)

  const newPartExplicitlyDeclared = (elemData.part.definesNewPart && ! isChildOfPart),
    newPartImplicityDeclared = (elemData.phase.definesNewPhase || forceNewPhase);

  if (newPartExplicitlyDeclared || newPartImplicityDeclared) {

    let newPart = getNewPart(elemData, pppRegister.app);
    pppRegister_new = pppRegister_new.changePartTo(newPart);

    registerChanged = true;
    tellChildrenTheyHaveAPartParent = true;
  }

/*
  if (elemData.part.definesNewPart || elemData.part.definesNewPartView) {
    let newPart = getNewPart(elemData, pppRegister.app);
    pppRegister_new = pppRegister_new.changePartTo(newPart)
      .changePartViewTo(newPart);
    registerChanged = true;
  } */

  // If a change of Place Role or Region, create new and update register
  //   Check if Role is defined in the DOM; update Role in PPPRegister, but
  //     only if it is currently undefined

  if (elemData.place.hasRole || elemData.place.hasRegion) {

    // If the role hasn't already been determined (in an ancestor)
    // AND the role is defined in the current element, then
    // use that new role

    let newPlaceRole;
    
    if (pppRegister.place.roleNotSet) {
      newPlaceRole = (elemData.place.hasRole ? elemData.place.role : undefined);
    } else {
      newPlaceRole = pppRegister.place.role;
    }

    let newPlaceRegion = elemData.place.region;

    // TODO: this should use getNewPlace(elemData, pppRegister.app)

    let newPlace = new FakePlace({
      app: pppRegister.app,
      role: newPlaceRole,
      region: newPlaceRegion
    });

    pppRegister_new = pppRegister_new.changePlaceTo(newPlace);
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

  forceChildrenToHaveNewPhase = (elemData.phase.definesNewPhase && elemData.phase.isContainer);

  Array.from(domElem.children).forEach(
    child => parseDomElem(child, pppRegister_new, forceChildrenToHaveNewPhase, tellChildrenTheyHaveAPartParent)
  );
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
// REGISTER CLASS

class PPP_Register {

  constructor (options) {
    this.app = options.app;
    this.part = options.part;
    this.partView = options.partView;
    this.place = options.place;
    this.phase = options.phase;
  }

  get state() {
    return {
      app: this.app,
      part: this.part,
      place: this.place,
      partView: this.partView,
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

  changePartViewTo(partView) {
    return this.updateAndCopy({ partView: partView });
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

    this.app.setPartPhase({
      part: this.part,
      phase: this.phase
    });

    if (this.partView !== undefined) {
      this.app.setPartViewPlace({
        part: this.part,
        partView: this.partView,
        place: this.place
      })
    }

    /*
    this.app.setPPP({
      part: this.part,
      place: this.place,
      phase: this.phase
    }); */
  }
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
// INTERFACES TO PPP CONSTRUCTORS
//  These handle creating new Parts, Places, and Phases.
//  It provides a consistent interface between the Parser
//    and the various constructors

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

// Place

function getNewPlace(elemData, app) {

  return new FakePlace({
    app: app,
    role: elemData.place.role,
    region: elemData.place.region
  })
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
// DATA-FROM-DOM FUNCTIONS
// These functions extract the information from the markup and
//  return a data structure for further parsing.
// The idea is that if it ain't in the markup, it's not dealt with
//  here.

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

  // Check the immediate children of domElem to
  //  see if they define View(s). 
  // Returns False if there are no Views defined; 
  //  True otherwise

  function checkIfHasChildViews(domElem) {
    return Array.from(domElem.children).some(childElem => {
      return (getPartTypeView(childElem).view !== undefined)
    });
  }

  function getPartTypeViewFromString(identifierString) {

    let partTypeViewData = {};

    let parsedTypeViewData = identifierString
      .replace(RegExp(`^${PARSING_CONSTANTS.PART.SELECTOR_PREFIX}`), '')
      .split(PARSING_CONSTANTS.PART.TYPE_VIEW_DELIMITER);

    if (parsedTypeViewData[0] !== undefined)
      partTypeViewData.type = parsedTypeViewData[0];

    if (parsedTypeViewData[1] !== undefined)
      partTypeViewData.view = parsedTypeViewData[1];

    return partTypeViewData;
  }

  function getPartTypeViewFromPartAttribute(domElem) {
    let attString = domElem.getAttribute(PARSING_CONSTANTS.PART.PART_ATT_NAME);

    return (attString !== null)
      ? getPartTypeViewFromString(attString)
      : {};
  }

  function getPartTypeViewFromPartTypeViewAttributes(domElem) {

    let partTypeViewData = {},
      partTypeAtt = domElem.getAttribute(PARSING_CONSTANTS.PART.TYPE_ATT_NAME),
      partViewAtt = domElem.getAttribute(PARSING_CONSTANTS.PART.VIEW_ATT_NAME);

    if (partTypeAtt !== null)
      partTypeViewData.type = partTypeAtt;
    if (partViewAtt !== null)
      partTypeViewData.view = partViewAtt;

    return partTypeViewData;
  }

  function getPartTypeViewFromClassname(domElem) {

    let partClassname = Array.from(domElem.classList).find(
      className => className.startsWith(PARSING_CONSTANTS.PART.CLASSNAME_PREFIX)
    );

    let partTypeViewData;

    if (partClassname !== undefined) {
      partTypeViewData = getPartTypeViewFromString(
        partClassname.slice(PARSING_CONSTANTS.PART.CLASSNAME_PREFIX.length)
      )
    } else {
      partTypeViewData = {}
    }

    return partTypeViewData;
  }

  function getPartTypeView(domElem) {
    return Object.assign({},
      getPartTypeViewFromClassname(domElem),
      getPartTypeViewFromPartAttribute(domElem),
      getPartTypeViewFromPartTypeViewAttributes(domElem)
    );
  }

  function getPartIdFromDomElem(domElem) {

    let id,
      plainId = domElem.getAttribute(PARSING_CONSTANTS.PART.ID_ATT_NAME),
      partId = domElem.getAttribute(PARSING_CONSTANTS.PART.PART_ID_ATT_NAME),
      partRefId = domElem.getAttribute(PARSING_CONSTANTS.PART.PART_REF_ATT_NAME);
    
    if (partId != null) {
      id = partId;
    } else if (plainId != null) {
      id = plainId.replace(/^#/, '');
    } else if (partRefId != null) {
      id = partRefId;
    } else {
      id = undefined;
    }

    return id;
  }

  // TODO: This is an (insecure) kludge -- see 
  //  getPartOptionsFromDomElem_TODO for the proper solution

  function getPartOptionsFromDomElem(domElem) {

    const optionsString = domElem.getAttribute(PARSING_CONSTANTS.PART.OPTIONS_ATT_NAME);

    let optionsData;

    if (optionsString !== null && optionsString !== '') {

      const BRACES = /^\s*\{|\}\s*$/g;

      const evalString = "(function() { return {" 
        + optionsString.replace(BRACES, '')
        + "} })()";

      optionsData = eval(evalString);
      
    } else {
      optionsData = {};
    }

    return optionsData;
  }


  // Attribute format is JSON (without the enclosing {  })
  // Pre-processing: 
  // 1. remove enclosing {  } if present
  // 2. add {  }
  // 3. add quotes around keys (if missing)
  //    (from https://gist.github.com/larruda/967110d74d98c1cd4ee1)


  // KEEP THIS FOR LATER - it's the better way
  // Currently it works EXCEPT that single quotes around values
  // don't parse in JSON -- e.g { a: 'b' } -- the single 
  //  quotes around 'b' have to be converted to "b"
  // It currently already handles single quotes around the key

  function getPartOptionsFromDomElem_TODO(domElem) {

    // Convert single quotes around object values to double quotes

    /* 
    
      The output is called OUT

        1. Look for " or ' -- keep copying to OUT until you find it
        2. IF you find a " then
          Grab all the following text to the next " (skipping over the ones with a preceding \)
          Push this text to OUT
          Go back to 1.
        3. IF you find a ' then
          Grab all the following text to the next ' (skipping the ones with a preceding \)
          Call this X
          Look within X for any " -- replace it with \"
          Wrap X with double quotes
          Push this to OUT
          Go back to 1.

    */

    function transformSingleQuotesToDouble(jsonString) {
      // TODO: code this up
      return jsonString;
    }

    // Remove curly brackets (if exist), then add them

    function wrapJsonInCurlyBrackets(jsonString) {

      let jsonStringNoBrackets = jsonString.replace(/^\s*\{|\}\s*$/g, ''),
        jsonStringWithBrackets = '{' + jsonStringNoBrackets + '}';

      return jsonStringWithBrackets;
    }

    // Make sure that object keys have double quotes around them
    // (required of JSON)

    function ensureQuotesAroundKeyNames(jsonString) {

      const SPACE = '\\s*',
        OPEN_BRACE = SPACE + '\{' + SPACE,
        // CLOSE_CURLY_BRACKET = SPACE + '\}' + SPACE,
        COMMA = SPACE + ',' + SPACE,
        QUOT = `["']`,
        KEY_TEXT = '[a-zA-Z0-9_\\-\\s]+',
        // KEY_TEXT = '[^\\2]+',
        COLON = ':';

      const keysThatNeedQuotesRegEx = new RegExp(
        `(${OPEN_BRACE}|${COMMA})(${QUOT}?)(${KEY_TEXT})(${QUOT}?)${COLON}`,
        'g'
      );
/*
      console.log(`(${OPEN_BRACE}|${COMMA})(${QUOT}?)(${KEY_TEXT})(${QUOT}?)${COLON}`);
      console.log(jsonString);
      console.log(jsonString.replace(keysThatNeedQuotesRegEx, '$1"$3":'));
*/
      return jsonString.replace(keysThatNeedQuotesRegEx, '$1"$3":');
    }

    let optionsString = domElem.getAttribute(PARSING_CONSTANTS.PART.OPTIONS_ATT_NAME);

    if (optionsString !== null) {
      
      // optionsString = '{' + optionsString + '}'; // Add {  }

      optionsString = wrapJsonInCurlyBrackets(optionsString);
      optionsString = ensureQuotesAroundKeyNames(optionsString);

      console.log("XXX " + optionsString);

      /*
      optionsString = optionsString.replace( // Enclose bare keywords with quotes
        keysThatNeedQuotesRegEx,
        //  /(\s*?{\s*?|\s*?,\s*?)(['"])?([a-zA-Z0-9]+)(['"])?:/g,
        '$1"$3":' );
      */
      optionsString = transformSingleQuotesToDouble(optionsString);

        console.log(optionsString);
      return JSON.parse(optionsString);
    } else return null;
  }

  // Get Part data from DOM

  let id = getPartIdFromDomElem(domElem),
    partTypeView = getPartTypeView(domElem),
    options = getPartOptionsFromDomElem(domElem),
    partContainer = domElem,
    definesNewPart = (
      partTypeView.type !== undefined || partTypeView.view !== undefined
    ),
    definesNewPartView = (partTypeView.view !== undefined),
    hasChildViews = checkIfHasChildViews(domElem);

  return {
    type: partTypeView.type,
    view: partTypeView.view,
    id: id,
    hasId: (id !== undefined),
    options: options,
    container: partContainer,
    definesNewPart: definesNewPart,
    definesNewPartView: definesNewPartView,
    hasChildViews: hasChildViews
  }
}

// DATA-FROM-DOM FUNCTIONS: Places temp from Joel. 
// #ToDo Still need to figure out how this Place data gets to App.js
// #ToDo does every phase need place defined? Probably, right?

function getPlaceDataFromDomElem(domElem) {

  // Given a string (e.g. place-red-green) return a 
  //  data structure (e.g. { role: 'red', region: 'green' })

  function getRoleRegionFromString(identifierString) {

    let roleRegionData = {};

    let parsedRoleRegion = identifierString
      .replace(RegExp(`^${PARSING_CONSTANTS.PLACE.SELECTOR_PREFIX}`), '')
      .split(PARSING_CONSTANTS.PLACE.ROLE_REGION_DELIMITER);

    if (parsedRoleRegion[0] !== undefined)
      roleRegionData.role = parsedRoleRegion[0];
      
    if (parsedRoleRegion[1] !== undefined)
      roleRegionData.region = parsedRoleRegion[1];

    return roleRegionData;
  }

  function getPlaceFromPlaceAttribute(domElem) {

    let attString = domElem.getAttribute(PARSING_CONSTANTS.PLACE.PLACE_ATT_NAME);

    return (attString !== null) 
      ? getRoleRegionFromString(attString) 
      : {};
  }

  function getPlaceFromRoleRegionAttributes(domElem) {

    let roleRegionData = {},
      roleAtt = domElem.getAttribute(PARSING_CONSTANTS.PLACE.ROLE_ATT_NAME),
      regionAtt = domElem.getAttribute(PARSING_CONSTANTS.PLACE.REGION_ATT_NAME);

    if (roleAtt !== null) 
      roleRegionData.role = roleAtt;
    if (regionAtt !== null) 
      roleRegionData.region = regionAtt;

    return roleRegionData;
  }

  function getPlaceFromClassname(domElem) {

    let placeClassname = Array.from(domElem.classList).find(
      className => className.startsWith(PARSING_CONSTANTS.PLACE.CLASSNAME_PREFIX)
    );

    let roleRegionData = (placeClassname !== undefined)
      ? getRoleRegionFromString(placeClassname)
      : {};

    return roleRegionData;
  }

  // Collect the { role: <str>, region: <str> } data structures
  //  from attributes and/or classnames and merge them in order of 
  //  precedence (from lowest to highest)

  let placeData = Object.assign( {},
    getPlaceFromClassname(domElem),
    getPlaceFromPlaceAttribute(domElem),
    getPlaceFromRoleRegionAttributes(domElem)
  );

  placeData.hasRole = (placeData.role !== undefined);
  placeData.hasRegion = (placeData.region !== undefined);

  return placeData;
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
// Main -- call parseFlightPlans on DOM load
// Currently only deals with the first Flight on the page

function init() {
  document.addEventListener('DOMContentLoaded', () => {
    let apps = parseFlightPlans(document.body);
    if (apps.length > 0) {
      window.glider = apps[0];
      apps[0].run();
    }
  });
}

// This is for testing the Flight markup

function testParse(id) {
  let nodeToTest = document.getElementById(id)
  // Create new app - pass to pppRegister
    pppRegister = new PPP_Register({
      app: new FakeApp(),
      part: new FakePart(),
      place: new FakePlace(),
      phase: getNewPhase(333333333, app, 'par')
    });
  
    parseDomElem(nodeToTest, pppRegister);
}

init();
