"use strict";
import { Grid, Column, Row, Cell } from "./modules/classes.js";
import * as editGrid from "./modules/grid.js";
import { renderCell } from "./modules/utilities.js";
import { updateSlider, reportWindowSize, updateCellSize, updateTools, reportGridSize, toggleBorderColor, updateZoom } from "./modules/view.js";

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
zoom.on("input change", function(e) {updateZoom(grid,e)})

// $(document).on("mousedown",".cell", function(e) {
// 	const target = grid.cells.filter(e => e.index == this.dataset.cell)[0]
// 	console.log(target)
// })

// Drag and drop behavior
let interactive = true
if (interactive === true) {
	// from https://javascript.info/mouse-drag-and-drop
	$(document).on("mousedown",".cell", function(e) {
		const clickedCell = e.target.parentNode,
		cellDimensions = {
			top: clickedCell.getBoundingClientRect().top, 
			left: clickedCell.getBoundingClientRect().left
		},
		shift = {
	  	x: e.clientX - cellDimensions.left,
	  	y: e.clientY - cellDimensions.top
	  }
	  let test = Array.prototype.indexOf.call(workspace.children(),clickedCell)
	  console.log(test)
	  let underlying = document.elementFromPoint(e.clientX,e.clientY).parentElement.dataset.cell,
	  destination = null,
		originAnchor = clickedCell.nextSibling.nextElementSibling
		// console.log("c",clickedCell.dataset.cell,"u",underlying,"d",destination,"o",originAnchor.dataset.cell)
		
		$(".cell").toggleClass("focused")

		let obj =  clickedCell.cloneNode(true);
		Object.assign(obj.style, {
			zIndex:1000,
			position:"absolute",
			left: event.pageX - shift.x + 'px',
			top: event.pageY - shift.y + 'px'
		})
		obj.id = "virtual"
		canvas.append(obj)

	  function moveAt(x, y) {
		  Object.assign(obj.style, {
		  	left: x - shift.x + 'px',
				top: y - shift.y + 'px'	
		  })	  	
	  }

		function onMouseMove(event) {
		  moveAt(event.pageX, event.pageY);
		  underlying = document.elementFromPoint(event.pageX,event.pageY).parentElement.dataset.cell
		  console.log(clickedCell.dataset.cell === underlying )
		  destination = clickedCell.dataset.cell === underlying ? null : workspace.children()[underlying]
			originAnchor = clickedCell.nextSibling.nextElementSibling
		  // console.log("c",clickedCell.dataset.cell,"u",underlying,"d",destination ? destination.dataset.cell : null,"o",originAnchor.dataset.cell)
		}
	  
	  document.addEventListener('mousemove', onMouseMove);

	  $(document).on("mouseup",".cell", function(f) {
	  	const workspaceNode = workspace[0];
	  	
	  	obj.hidden = true;
		  let elemBelow = document.elementFromPoint(f.clientX, f.clientY);
		  obj.hidden = false;
	  
	  	if (clickedCell.dataset.cell != underlying) {
	  		if (destination != originAnchor) {
		  		// console.log("not right neighbor")
		  		workspaceNode.insertBefore(clickedCell,destination)
			  	workspaceNode.insertBefore(destination,originAnchor)	
		  	} else {
		  		// console.log("right neighbor")
		  		// console.log(clickedCell.dataset.cell,destination.dataset.cell)
		  		workspaceNode.insertBefore(clickedCell,destination)
			  	workspaceNode.insertBefore(destination,clickedCell)	
		  	}
	  	}	else {
	  		console.log("catch")
	  	}  	

	  	$(".cell").toggleClass("focused")

	  	let el = $("#virtual")[0]
	    
	    document.removeEventListener('mousemove', onMouseMove);
	    canvas[0].removeChild(el)
	    $(document).unbind('mouseup');
	  });
	})

	$(document).ondragstart = function() {
	  return false;
	};
}