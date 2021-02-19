"use strict";
import { Grid, Column, Row, Cell } from "./modules/classes.js";
import * as editGrid from "./modules/grid.js";
import { renderCell } from "./modules/utilities.js";
import { updateSlider, reportWindowSize, updateCellSize, updateTools, reportGridSize, toggleBorderColor, updateZoom, changeBorderWidth, inputGridChange } from "./modules/view.js";
import "./modules/interaction.js"

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

// Bindings
$("button#addLeft").on("click",function(){editGrid.addLeft(grid)})
$("button#addRight").on("click",function(){editGrid.addRight(grid)})
$("button#removeLeft").on("click",function(){editGrid.removeLeft(grid)})
$("button#removeRight").on("click",function(){editGrid.removeRight(grid)})
$("button#addTop").on("click",function(){editGrid.addTop(grid)})
$("button#addBottom").on("click",function(){editGrid.addBottom(grid)})
$("button#removeTop").on("click",function(){editGrid.removeTop(grid)})
$("button#removeBottom").on("click",function(){editGrid.removeBottom(grid)})
$("#gridSize").on("click", function() {reportGridSize(grid)})
$("#borderColor").on("click",function(e) {toggleBorderColor(grid, e)})
zoom.on("input change", function(e) {updateZoom(grid, e)})
border.on("input change", function(e) {changeBorderWidth(grid, e)})
$("input[type='number']").on("change",function(e) {inputGridChange(grid, e)})

// $(document).on("mousedown",".cell", function(e) {
// 	const target = grid.cells.filter(e => e.index == this.dataset.cell)[0]
// 	console.log(target)
// })