class Grid {
  constructor(columns, rows, border) {
    this.columns = columns,
    this.rows = rows,
    this.border = border,
    this.origin = 1;
    this.cellCount = columns * rows;
    this.columnSet = [];
    this.rowSet = [];
    this.cells = [];
    this.borderColor = "white";
  };
  get getCells() {
    return this.columns * this.rows;
  };
};

class Column {
	constructor(index) {
		this.index = index;
	}
}

class Row {
	constructor(index) {
		this.index = index;
	}
}

class Cell {
  constructor(col,row,index) {
    // this.datum = obj ? obj : getRandomCell();
    // this.title = this.datum.title;
    // this.key = this.datum.id;
    // this.image = this.datum.img;
    // this.url = this.datum.youtube
    this.index = index;
		this.color = this.getRandomColor();
    this.column = col;
    this.row = row;   
  };
  get address() {
  	return this.getAddress();
  }
  getAddress() {
  	return( `c${this.column}r${this.row}`);
  }
  getRandomColor() {
	  const letters = "0123456789ABCDEF";
	  let color = "#";
	  for (var i = 0; i < 6; i++) {
	    color += letters[8 + Math.floor(Math.random() * 8)];
	  };
	  return color;
	};
};

export { Grid, Column, Row, Cell };