class Place {

  constructor(id, props) {
    
    let that = this;

    this.id = id;
    this.isActive = false;
    this.domWrapper;

    for (var key in props) {
      if (that.hasOwnProperty(key)) {
          that[key] = props[key];
      }
    }

    this.setupDomWrapper();
    this.preparedContent = "";
    this.setContent(this.preparedContent);

  }

  setupDomWrapper() {
    this.domWrapper = document.createElement("div");
    this.domWrapper.classList.add("place");
    this.domWrapper.classList.add("place-id-"+ this.id);
    this.domWrapper.setAttribute("place-id", "place-" + this.id);
  }

  setContent(content) {
    this.domWrapper.innerHTML = content;
  }

  constructCSS() {
    // stubby stub stub. overload.
  }

  activate () {
    this.isActive = true;
    this.constructCSS();
    this.parent.appendChild(this.domWrapper);
  }

  deactivate() {
    this.isActive = false;
    this.parent.removeChild(this.domWrapper);
  }
}

class GridPlace extends Place {
  // Assumed to be CSS Grid
  constructor(id, props){
    super(id, props);

    //category, row, column, spanrows, spancols

    this.row = props.row;
    this.column = props.column;
    this.spanRows = props.spanRows;
    this.spanCols = props.spanCols;

  }

  constructCSS() {
    // from row, column, spanrows, spancols, etc;
    if (this.isCentral) {
      this.domWrapper.style.gridRow = this.row + " / span " + this.spanrows;
      this.domWrapper.style.gridColumn = this.column + " / span " + this.spancols;
    }
  }
}