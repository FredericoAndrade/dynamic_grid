"use strict";
import { Grid, Column, Row, Cell } from "./modules/classes.js";
import * as editGrid from "./modules/grid.js";
import { renderCell } from "./modules/utilities.js";
import { updateSlider, reportWindowSize, updateCellSize, updateTools, reportGridSize, toggleBorderColor, updateZoom, changeBorderWidth, inputGridChange } from "./modules/view.js";
import "./modules/interaction.js"
import "./modules/bindings.js"

const canvas = $("#canvas"),
workspace = $("#workspace"),
lens = $("#lens"),
zoom = $("#zoom"),
border = $("#border")

updateSlider(zoom.val())

// const grid = new Grid(7,6,2);
const grid = new Grid(4,3,2);

( //Render Grid
  function() {
    let mql = window.matchMedia('(max-width: 600px)');
    if (mql.matches) {
      grid.columns = 1;
    } 
    for (var i = 0; i <= grid.columns - 1; i++) {
    	const column = new Column(i)
    	grid.columnSet.push(column)
    }
		for (var j = 0; j <= grid.rows - 1; j++) {
    	const row = new Row(j)
    	grid.rowSet.push(row)
    }

    generateGrid("columns")
  }()
);

function generateGrid() {
  const currGridLen = workspace.children().length,
  targetGridLen = grid.getCells,
  diff = targetGridLen - currGridLen,
  counter = currGridLen;
 
 	for (var i = 0; i <= diff - 1; i++) {
		
		const row = Math.floor(i/grid.columns),
		column = i - (grid.columns * row),
		cell = new Cell(column, row, grid.cells.length);

	  grid.cells.push(cell)
	  workspace.append(renderCell(cell, grid));
	}
	
	grid.cellCount = grid.getCells

  updateCellSize(grid);
  updateTools(grid);
};

window.onresize = reportWindowSize;
updateTools(grid);



// $(document).on("mousedown",".cell", function(e) {
// 	const target = grid.cells.filter(e => e.index == this.dataset.cell)[0]
// 	console.log(target)
// })