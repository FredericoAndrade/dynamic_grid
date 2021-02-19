import { Grid, Column, Row, Cell } from "./classes.js";
import { getSmallestAvailableIndex, renderCell } from "./utilities.js"
import { updateCellSize, updateTools } from "./view.js";

const workspace = $("#workspace")

function addTop(grid) {
	const row = new Row(getSmallestAvailableIndex(grid,"rowSet"));
	const newRowCount = grid.rows + 1;
	grid.rowSet.unshift(row)
	grid.rows = newRowCount
  updateTools(grid);
  
	for (var i = grid.columns - 1; i >= 0; i--) {
		let cell = new Cell(grid.columnSet[i].index, getSmallestAvailableIndex(grid,"rowSet") - 1, grid.cellCount + i)
		grid.cells.unshift(cell)
		workspace.children()[0].insertAdjacentHTML('beforebegin',renderCell(cell, grid))
	}

	updateCellSize(grid);
	grid.cellCount = grid.cells.length
}

function addBottom(grid) {
	const row = new Row(getSmallestAvailableIndex(grid,"rowSet"));
	let newRowCount = grid.rows + 1
	grid.rowSet.push(row)
	grid.rows = newRowCount
  updateTools(grid);

	for (var i = 0; i <= grid.columns - 1; i++) {
		let cell = new Cell(grid.columnSet[i].index, getSmallestAvailableIndex(grid,"rowSet") - 1, grid.cellCount)
		grid.cells.push(cell)
		grid.cellCount = grid.cells.length
		workspace.children()[workspace.children().length - 1].insertAdjacentHTML('afterend',renderCell(cell, grid))
	}
	updateCellSize(grid);
}

function removeTop(grid) {
	if (grid.rows > 1) {

		grid.rows = grid.rows - 1
		grid.rowSet.splice(0,1)
	  updateTools(grid);
	  
		for (var i = grid.columns - 1; i >= 0; i--) {
			grid.cells.splice(0,1)
			workspace.children()[0].remove()
		}
		grid.cellCount = grid.cells.length
		updateCellSize(grid);
	}
}

function removeBottom(grid) {
	if (grid.rows > 1) {
		grid.rows = grid.rows - 1
		grid.rowSet.splice(grid.rowSet.length - 1,1)
	  updateTools(grid);
	  
		for (var i = grid.columns - 1; i >= 0; i--) {
			grid.cells.splice(grid.cells.length - 1,1)
			workspace.children()[grid.cells.length - 1].remove()
		}
		grid.cellCount = grid.cells.length
		updateCellSize(grid);
	}
}

function addLeft(grid) {
	let array = []
	for (var i = 0; i <= grid.rows - 1; i++) {
		array.push(grid.columns * i)
	}

	let newColumnCount = grid.columns + 1
	const column = new Column(getSmallestAvailableIndex(grid,"columnSet"))
	grid.columnSet.unshift(column)
	grid.columns = grid.columnSet.length
  
  

	for (var i = array.length - 1; i >= 0; i--) {
		let cell = new Cell(getSmallestAvailableIndex(grid,"columnSet") - 1, grid.rowSet[i].index, grid.cellCount + i)

		grid.cells.splice(array[i],0,cell)

		workspace.children()[array[i]].insertAdjacentHTML('beforebegin',renderCell(cell, grid))
	}

	grid.cellCount = grid.cells.length
	
	updateTools(grid);
	updateCellSize(grid);	
}

function addRight(grid) {
	let array = []
	for (var i = 0; i <= grid.rows - 1; i++) {
		array.push(grid.columns + (grid.columns * i) - 1)
	}

	let newColumnCount = grid.columns + 1
	const column = new Column(getSmallestAvailableIndex(grid,"columnSet"))
	grid.columnSet.push(column)
	grid.columns = grid.columnSet.length
  

	for (var i = array.length - 1; i >= 0; i--) {
		let cell = new Cell(getSmallestAvailableIndex(grid,"columnSet") - 1, grid.rowSet[i].index, grid.cellCount + i)

		grid.cells.splice(array[i] + 1,0,cell)

		workspace.children()[array[i]].insertAdjacentHTML('afterend',renderCell(cell, grid))
	}
	
	grid.cellCount = grid.cells.length
	
	updateTools(grid);
	updateCellSize(grid);
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
		
		updateTools(grid);
		updateCellSize(grid);
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

		updateTools(grid);
		updateCellSize(grid);
	}
}

export { addTop, addBottom, addLeft, addRight, removeTop, removeBottom, removeLeft, removeRight };