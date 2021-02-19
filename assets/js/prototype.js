import { Grid, Column, Row, Cell } from "./modules/test.js";
"use strict";

let canvas = $("#canvas"),
workspace = $("#workspace"),
lens = $("#lens"),
height,
width,
zoom = $("#zoom"),
border = $("#border"),
borderVal = border.val,
val = zoom.val();

updateSlider()

// functions
// Rows: addTop, addBottom, removeTop, removeBottom
// Columns: addLeft, addRight, removeLeft, removeRight
// getSmallestAvailableIndex
// generateGrid
// removeCells
// renderCell
// updateSlider
// reportWindowSize
// updateCellSize
// updateTools
// reportGridSize

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

function addTop() {
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

function addBottom() {
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

function removeTop() {
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

function removeBottom() {
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

function addLeft() {
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

function addRight() {
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

function removeLeft() {
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

function removeRight() {
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

function getSmallestAvailableIndex(axis) {
	let array = []
	for (var i = grid[axis].length - 1; i >= 0; i--) {
		array.push(grid[axis][i].index)
	}
	return Math.max(...array) + 1;
}

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
	  workspace.append(renderCell(cell));
	}
	
	grid.cellCount = grid.getCells

  updateCellSize();
  updateTools();
};

function removeCells() {
  const target = workspace.children().last().attr("data");
  grid.cells.length = grid.cells.length - 1 
  workspace.children().last().detach();
};

function renderCell(cell) {
	return(
	`
    <div class="cell" data-cell="${cell.index}" data-column="${cell.column}" data-row="${cell.row}"
    style="
      height:${cell.height}px;
      width: ${cell.width}px;
      background:${cell.color};
      "
    >
      <div class="nucleus"
        style="
        border-width:${grid.border}px;
        border-color:${grid.borderColor};
        "
      >
      <!--table>
	      <thead>
	      	<tr>
		      	<td>id</td>
		      	<td>adr</td>
		      	<td>col</td>
		      	<td>row</td>
		      	<td>hex</td>
	      	</tr>
	      </thead>
	      <tbody>
		      <tr>
		      	<td>${cell.index}</td>
		      	<td>${cell.address}</td>
		      	<td>${cell.column}</td>
		      	<td>${cell.row}</td>
		      	<td>${cell.color}</td>
	      	</tr>
	      </tbody>
      </table-->
      <h1>${cell.index}</h1>
      </div>
    </div>
  `)
}

function updateSlider() {
	$("#lens").css("width",`${val}%`)	
	$("#lens").css("height",`${val}%`)
	$("#lens").css("top",`${(100-val)/2}%`)	
	$("#lens").css("left",`${(100-val)/2}%`)		
	height = workspace.innerHeight()
	width = workspace.innerWidth()
}

zoom.on("input change", function() {
  val = this.value;
  updateSlider()
	updateCellSize();
})

border.on("input change", function() {
  borderVal = this.value;
  grid.border = this.value;
  $(".buttonGroup#borderGroup input[type='text']")[0].value = this.value
  $(".nucleus").css("border-width",`${grid.border}px`);
  workspace.css("outline-width",`${grid.border}px`);
})

$("#borderColor").click(function(e){
  const color = e.target.innerText;
  let output = color == "white" ? "black" : "white"
// console.log(e)
  e.target.innerText = output
  grid.borderColor = output;
  workspace.css("outline-color",output,"background",output);
  $(".nucleus").css("border-color",output);
})

function reportWindowSize() {
  height = window.innerHeight;
  width = window.innerWidth;
  updateCellSize();
};

function updateCellSize() {
  $(".cell").height(workspace.innerHeight()/grid.rows);
  $(".cell").width(workspace.innerWidth()/grid.columns);
};

window.onresize = reportWindowSize;

$("input[type='number']").on("change",function(e) {
	const param = e.target;
  const updatedValue = param.value;
  const sign = grid[param.id] < updatedValue ? "add" : "remove";
  const loc = param.id == "columns" ? "Right" : "Bottom";
  let magnitude = updatedValue - grid[param.id]
	for (var i = Math.abs(magnitude) - 1; i >= 0; i--) {
		window[`${sign}${loc}`]()
	}
  $(".nucleus").css("border-width",`${grid.border}px`);
})

updateTools();

function updateTools() {
	$("input#columns").val(grid.columns);
	$("input#rows").val(grid.rows);
	$("input#gridSize").val(grid.getCells);
}

function reportGridSize() {
	console.log("Grid size: ", grid)
}

// Bindings
$("button#addLeft").on("click",function(){addLeft()})
$("button#addRight").on("click",function(){addRight()})
$("button#removeLeft").on("click",function(){removeLeft()})
$("button#removeRight").on("click",function(){removeRight()})
$("button#addTop").on("click",function(){addTop()})
$("button#addBottom").on("click",function(){addBottom()})
$("button#removeTop").on("click",function(){removeTop()})
$("button#removeBottom").on("click",function(){removeBottom()})
$("#gridSize").on("click", function() {reportGridSize()})

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

console.log("test")
test("hi")
