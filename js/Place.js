class Place {
  // this is super tied to CSS Grid, which I don't necesssarily love at the moment, but ¯\_(ツ)_/¯ 
  constructor(id, parent, isCentral, category, row, column, spanrows, spancols) {
    this.id = id;
    this.parent = parent;
    this.isActive = false;
    this.isCentral = isCentral;
    this.category = category;
    this.row = row;
    this.column = column;
    this.spanrows = spanrows;
    this.spancols = spancols;
    this.domWrapper = document.createElement("div");
    this.domWrapper.classList.add("place");
    this.domWrapper.classList.add("place-id-"+ this.id);
    this.domWrapper.setAttribute("place-id", "place-" + this.id);
    this.preparedContent = "";
    this.setContent(this.preparedContent);
  }

  setContent(content) {
    this.domWrapper.innerHTML = content;
  }

  constructCSS() {
    // from row, column, spanrows, spancols, etc;
    this.domWrapper.style.gridRow = this.row + " / span " + this.spanrows;
    this.domWrapper.style.gridColumn = this.column + " / span " + this.spancols;
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