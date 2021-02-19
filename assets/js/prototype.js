"use strict";

let canvas = $("#canvas"),
workspace = $("#workspace"),
lens = $("#lens"),
interactive = false,
height,
width,
zoom = $("#zoom"),
border = $("#border"),
borderVal = border.val,
val = zoom.val();

updateZoom();

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
		this.index = index
	}
}

class Row {
	constructor(index) {
		this.index = index
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
  	return( `c${this.column}r${this.row}`)
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

const grid = new Grid(7,6,2);
// const grid = new Grid(4,3,2);

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


function addRow(index) {
	const row = new Row(getSmallestAvailableIndex("rowSet")),
	top = index == "top",
	newRowCount = grid.rows + 1,
	rowLocation = top ? "beforebegin" : "afterend",
	locationRoot = top ? 0 : workspace.children().length - 1;
	
	top ? grid.rowSet.unshift(row) : grid.rowSet.push(row)
	grid.rows = newRowCount
  
	for (var i = grid.columns - 1; i >=  0; i--) {
		let cellindex = top ? grid.cellCount + 1 : grid.cellCount,
		cell = new Cell(grid.columnSet[i].index, getSmallestAvailableIndex("rowSet") - 1, grid.cellCount + i)
		
		top ? grid.cells.unshift(cell) : grid.cells.push(cell)
		workspace.children()[locationRoot].insertAdjacentHTML(rowLocation,renderCell(cell))
	}
	updateGridUtility()
}


function addColumn(index) {
	const column = new Column(getSmallestAvailableIndex("columnSet")),
	left = index == "left",
	newColumnCount = grid.columns + 1,
	columnLocation = left ? "beforebegin" : "afterend";

	let array = []
	
	for (var i = 0; i <= grid.rows - 1; i++) {
		let columnCount = left ? (i * grid.columns) : (grid.columns + (grid.columns * i) - 1);
		array.push(columnCount)
	}
	
	left ? grid.columnSet.unshift(column) : grid.columnSet.push(column)
	grid.columns = grid.columnSet.length

	for (var i = array.length - 1; i >= 0; i--) {
		let cell = new Cell(getSmallestAvailableIndex("columnSet") - 1, grid.rowSet[i].index, grid.cellCount + i),
		cellLocation = left ? array[i] : array[i] + 1;

		grid.cells.splice(cellLocation,0,cell)
		workspace.children()[array[i]].insertAdjacentHTML(columnLocation,renderCell(cell))
	}
	updateGridUtility()
}


function removeColumn(index) {
	if (grid.columns > 1) {
		let left = index == "left",
		columnSetLocation = left ? 0 : grid.columnSet.length - 1,
		array = [];

		for (var i = 0; i <= grid.rows - 1; i++) {
			let columnsToPush = left ? i * grid.columns : grid.columns + (grid.columns * i) - 1;
			array.push(columnsToPush);
		}
		
		grid.columnSet.splice(columnSetLocation,1);
		grid.columns = grid.columnSet.length;
	  
		for (var i = array.length - 1; i >= 0; i--) {
			grid.cells.splice(array[i],1);
			workspace.children()[array[i]].remove();
		}
		updateGridUtility()
	}
}

function removeRow(index) {
	if (grid.rows > 1) {
		let top = index == "top",
		rowSetLocation = top ? 0 : grid.rowSet.length - 1;
		
		grid.rows = grid.rows - 1;
		grid.rowSet.splice(rowSetLocation,1);
	  
		for (var i = grid.columns - 1; i >= 0; i--) {
			let cellLocation = top ? 0 : grid.cells.length - 1;
			grid.cells.splice(cellLocation, 1);
			workspace.children()[cellLocation].remove();
		}
		updateGridUtility()
	}
}

function updateGridUtility() {
	grid.cellCount = grid.cells.length;
	updateTools();
	updateCellSize();
}

function updateGridInput(e) {
	const param = e.target,
  updatedValue = param.value,
  sign = grid[param.id] < updatedValue ? "add" : "remove";
  
  let magnitude = updatedValue - grid[param.id]

	for (var i = Math.abs(magnitude) - 1; i >= 0; i--) {
		if (sign == "add") {
			param.id == "columns" ? addColumn("right") : addRow("bottom")
		} else {
			param.id == "columns" ? removeColumn("right") : removeRow("bottom")
		}
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
	updateGridUtility()
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

function updateZoom() {
	Object.assign(lens[0].style, {
		width:`${val}%`,
		height:`${val}%`,
		top:`${(100-val)/2}%`,
		left:`${(100-val)/2}%`
	})
	height = workspace.innerHeight()
	width = workspace.innerWidth()
}

zoom.on("input change", function() {
  val = this.value;
  updateZoom()
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

function updateTools() {
	$("input#columns").val(grid.columns);
	$("input#rows").val(grid.rows);
	$("input#gridSizeInput").val(grid.getCells);
}

function reportGridSize() {
	console.log("Grid size: ", grid)
}

function toggleInteractive(e) {
	const state = interactive ? "static" : "interactive"
	e.target.innerText = state
	$(".cell").toggleClass("interactive")
	interactive = !interactive
}

// Bindings
$("button#addLeft").on("click",function(){addColumn("left")})
$("button#addRight").on("click",function(){addColumn("right")})
$("button#removeLeft").on("click",function(){removeColumn("left")})
$("button#removeRight").on("click",function(){removeColumn("right")})
$("button#addTop").on("click",function(){addRow("top")})
$("button#addBottom").on("click",function(){addRow("bottom")})
$("button#removeTop").on("click",function(){removeRow("top")})
$("button#removeBottom").on("click",function(){removeRow("bottom")})
$("#gridSize").on("click", function() {reportGridSize()})
$("input[type='number']").on("change",function(e) {updateGridInput(e)})
$("#toggleInteractive").on("click", function(e) {toggleInteractive(e)})

window.onresize = reportWindowSize;

// Drag and drop behavior
// from https://javascript.info/mouse-drag-and-drop
$(document).on("mousedown",".cell", function(e) {
	if (interactive) {
		const clickedCell = e.target.parentNode,
		clickedCellIndex = Array.prototype.indexOf.call(workspace.children(),clickedCell),
		cellDimensions = {
			top: clickedCell.getBoundingClientRect().top, 
			left: clickedCell.getBoundingClientRect().left
		},
		shift = {
	  	x: e.clientX - cellDimensions.left,
	  	y: e.clientY - cellDimensions.top
	  }

	  let destination = document.elementFromPoint(e.clientX,e.clientY).parentElement
	  let destinationCellIndex = Array.prototype.indexOf.call(workspace.children(),destination)
		
		$(".cell").toggleClass("focused")

		let obj =  clickedCell.cloneNode(true);
		Object.assign(obj.style, {
			zIndex: 1000,
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
		  destination = document.elementFromPoint(event.pageX,event.pageY).parentElement
		  destinationCellIndex = Array.prototype.indexOf.call(workspace.children(),destination)
		}
	  
	  document.addEventListener('mousemove', onMouseMove);

	  $(document).on("mouseup",".cell", function(f) {
	  	const workspaceNode = workspace[0];
	  	
	  	obj.hidden = true;
		  let elemBelow = document.elementFromPoint(f.clientX, f.clientY);
		  obj.hidden = false;
	  	
	  	if (clickedCellIndex != destinationCellIndex) {
	  		if (destinationCellIndex != clickedCellIndex + 1) {
	  			let backSwap = clickedCellIndex > destinationCellIndex ? 1 : 0
	  			workspaceNode.insertBefore(workspace.children()[clickedCellIndex],workspace.children()[destinationCellIndex])
	  			workspaceNode.insertBefore(workspace.children()[destinationCellIndex + backSwap],workspace.children()[clickedCellIndex + backSwap])		
		  	} else {
		  		workspaceNode.insertBefore(clickedCell,workspace.children()[destinationCellIndex])
			  	workspaceNode.insertBefore(workspace.children()[destinationCellIndex],clickedCell)	
		  	}
	  	}

	  	$(".cell").toggleClass("focused")

	  	let el = $("#virtual")[0]
	    
	    document.removeEventListener('mousemove', onMouseMove);
	    obj.remove()
	    $(document).unbind('mouseup');
	  });
	}
})

$(document).ondragstart = function() {
  return false;
};