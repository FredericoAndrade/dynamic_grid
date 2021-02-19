import { Grid, Column, Row, Cell } from "./modules/classes.js";

function addTop(grid) {
	const row = new Row(getSmallestAvailableIndex("rowSet"));
	const newRowCount = grid.rows + 1;
	grid.rowSet.unshift(row)
	grid.rows = newRowCount
  updateTools();
  
	for (var i = grid.columns - 1; i >= 0; i--) {
		let cell = new Cell(grid.columnSet[i].index, getSmallestAvailableIndex("rowSet") - 1, grid.cellCount + i)
		grid.cells.unshift(cell)
		workspace.children()[0].insertAdjacentHTML('beforebegin',renderCell(cell))
	}

	updateCellSize();
	grid.cellCount = grid.cells.length
}

function addBottom(grid) {
	const row = new Row(getSmallestAvailableIndex("rowSet"));
	let newRowCount = grid.rows + 1
	grid.rowSet.push(row)
	grid.rows = newRowCount
  updateTools();

	for (var i = 0; i <= grid.columns - 1; i++) {
		let cell = new Cell(grid.columnSet[i].index, getSmallestAvailableIndex("rowSet") - 1, grid.cellCount)
		grid.cells.push(cell)
		grid.cellCount = grid.cells.length
		workspace.children()[workspace.children().length - 1].insertAdjacentHTML('afterend',renderCell(cell))
	}
	updateCellSize();
}

function removeTop(grid) {
	if (grid.rows > 1) {

		grid.rows = grid.rows - 1
		grid.rowSet.splice(0,1)
	  updateTools();
	  
		for (var i = grid.columns - 1; i >= 0; i--) {
			grid.cells.splice(0,1)
			workspace.children()[0].remove()
		}
		grid.cellCount = grid.cells.length
		updateCellSize();
	}
}

function removeBottom(grid) {
	if (grid.rows > 1) {
		grid.rows = grid.rows - 1
		grid.rowSet.splice(grid.rowSet.length - 1,1)
	  updateTools();
	  
		for (var i = grid.columns - 1; i >= 0; i--) {
			grid.cells.splice(grid.cells.length - 1,1)
			workspace.children()[grid.cells.length - 1].remove()
		}
		grid.cellCount = grid.cells.length
		updateCellSize();
	}
}

function addLeft(grid) {
	let array = []
	for (var i = 0; i <= grid.rows - 1; i++) {
		array.push(grid.columns * i)
	}

	let newColumnCount = grid.columns + 1
	const column = new Column(getSmallestAvailableIndex("columnSet"))
	grid.columnSet.unshift(column)
	grid.columns = grid.columnSet.length
  
  

	for (var i = array.length - 1; i >= 0; i--) {
		let cell = new Cell(getSmallestAvailableIndex("columnSet") - 1, grid.rowSet[i].index, grid.cellCount + i)

		grid.cells.splice(array[i],0,cell)

		workspace.children()[array[i]].insertAdjacentHTML('beforebegin',renderCell(cell))
	}

	grid.cellCount = grid.cells.length
	
	updateTools();
	updateCellSize();	
}

function addRight(grid) {
	let array = []
	for (var i = 0; i <= grid.rows - 1; i++) {
		array.push(grid.columns + (grid.columns * i) - 1)
	}

	let newColumnCount = grid.columns + 1
	const column = new Column(getSmallestAvailableIndex("columnSet"))
	grid.columnSet.push(column)
	grid.columns = grid.columnSet.length
  

	for (var i = array.length - 1; i >= 0; i--) {
		let cell = new Cell(getSmallestAvailableIndex("columnSet") - 1, grid.rowSet[i].index, grid.cellCount + i)

		grid.cells.splice(array[i] + 1,0,cell)

		workspace.children()[array[i]].insertAdjacentHTML('afterend',renderCell(cell))
	}
	
	grid.cellCount = grid.cells.length
	
	updateTools();
	updateCellSize();
}

function removeLeft(grid) {
	if (grid.columns > 1) {
		let array = []
		for (var i = 0; i <= grid.rows - 1; i++) {
			array.push(grid.columns * i)
		}
		
		grid.columnSet.splice(0,1)
		grid.columns = grid.columnSet.length
		
	  
	  
		for (var i = array.length - 1; i >= 0; i--) {
			grid.cells.splice(array[i],1)
			workspace.children()[array[i]].remove()
		}

		grid.cellCount = grid.cells.length
		
		updateTools();
		updateCellSize();
	}
}

function removeRight(grid) {
	if (grid.columns > 1) {
		let array = []
		for (var i = 0; i <= grid.rows - 1; i++) {
			array.push(grid.columns + (grid.columns * i) - 1)
		}
		
		grid.columnSet.splice(grid.columnSet.length - 1,1)
		grid.columns = grid.columnSet.length
	  
		for (var i = array.length - 1; i >= 0; i--) {
			grid.cells.splice(array[i],1)
			workspace.children()[array[i]].remove()
		}
		
		grid.cellCount = grid.cells.length

		updateTools();
		updateCellSize();
	}
}

export { addTop, addBottom, addLeft, addRight, removeTop, removeBottom, removeLeft, removeRight };