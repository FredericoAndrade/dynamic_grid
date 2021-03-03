"use strict";

// update grid objects after drag & drop
// Arbitrary canvas size
// get border values
// change one cell
// infinite scroll in any direction with recycling

let canvas = $("#canvas"),
workspace = $("#workspace"),
lens = $("#lens"),
interactive = false,
animate = false,
height,
width,
zoom = $("#zoomRange"),
border = $("#borderRange"),
borderVal = border.val,
val = zoom.val();

setZoom();

class Grid {
  constructor(columns, rows, border) {
    this.columnSet = [];
    this.rowSet = [];
    this.cells = [];
    this.columns = columns;
    this.rows = rows;
    this.border = border;
    this.borderColor = "white";
  };
  get getCells() {
    return this.columns * this.rows;
  };
};

class Column {
	constructor(index) {
		this.index = index;
		this.cells = [];
	}
}

class Row {
	constructor(index) {
		this.index = index;
		this.cells = [];
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
    this.data = "";
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
	rowLocation = top ? "beforebegin" : "afterend";
	
	
	top ? grid.rowSet.unshift(row) : grid.rowSet.push(row)
	grid.rows = grid.rows + 1
	for (var i = 0; i <=  grid.columns - 1; i++) {
		const column = i,
		cellIndex = getSmallestAvailableIndex("cells"),
		locationRoot = top ? i : workspace.children().length - 1,
		cell = new Cell(grid.columnSet[column].index, row.index, cellIndex)

		top ? grid.cells.splice(i, 0, cell) : grid.cells.splice(workspace.children().length, 0, cell) ;// add to grid
		top ? grid.columnSet[column].cells.unshift(cell) : grid.columnSet[i].cells.push(cell) // add to columns
	  row.cells.push(cell) // add to rows
		workspace.children()[locationRoot].insertAdjacentHTML(rowLocation,renderCell(cell)) // add to dom
	}
	updateGridUtility()
}


function addColumn(index) {
	const newColumnIndex = getSmallestAvailableIndex("columnSet"),
	column = new Column(newColumnIndex),
	left = index == "left",
	columnLocation = left ? "beforebegin" : "afterend";

	let array = []
	
	for (var i = 0; i <= grid.rows - 1; i++) {
		let columnCount = left ? (i * grid.columns) : (grid.columns + (grid.columns * i) - 1);
		array.push(columnCount)
	}
	left ? grid.columnSet.unshift(column) : grid.columnSet.push(column)
	grid.columns = grid.columnSet.length

	for (var i = 0; i <= array.length - 1; i++) {
		const row = i,
		cellIndex = getSmallestAvailableIndex("cells"),
		cell = new Cell(column.index, grid.rowSet[row].index, cellIndex),
		cellLocation = left ? array[row] + row : array[row] + 1 + row;
		
		grid.cells.splice(cellLocation, 0, cell) // add to grid
		column.cells.push(cell) // add to columns
	  left ? grid.rowSet[row].cells.unshift(cell) : grid.rowSet[row].cells.push(cell) // add to rows
		workspace.children()[array[row]+i].insertAdjacentHTML(columnLocation,renderCell(cell)) // add to dom
	}
	updateGridUtility()
}


function removeColumn(index) {
	if (grid.columns > 1) {
		const left = index == "left",
		columnSetLocation = left ? 0 : grid.columnSet.length - 1,
		column = grid.columnSet[columnSetLocation]
		let array = [];

		for (var i = 0; i <= grid.rows - 1; i++) {
			let columnsToPush = left ? (i * grid.columns) : (grid.columns + (grid.columns * i) - 1);
			array.push(columnsToPush);
		}

		let a2 = grid.cells.filter(e => e.column == column.index)
	
		grid.columnSet.splice(columnSetLocation,1);
		grid.columns = grid.columnSet.length;
		for (var i = 0; i <= array.length - 1; i++) {
			grid.rowSet[i].cells = grid.rowSet[i].cells.filter(e => e.column !== column.index)
			grid.cells.splice(array[i] - i,1);
			workspace.children()[array[i] - i].remove();
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
			grid.columnSet[i].cells.splice(rowSetLocation, 1);
			grid.cells.splice(cellLocation, 1);
			workspace.children()[cellLocation].remove();
		}
		updateGridUtility()
	}
}

function updateGridUtility() {
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

function getSmallestAvailableIndex(channel) {

	let array = []
	for (var i = grid[channel].length - 1; i >= 0; i--) {
		array.push(grid[channel][i].index)
	}
	return Math.max(...array) + 1;

}

function generateGrid() {
  const currGridLen = workspace.children().length,
  targetGridLen = grid.getCells,
  diff = targetGridLen - currGridLen;
  
	for (var i = 0; i <= diff - 1; i++) {
		const row = Math.floor(i/grid.columns),
		column = i - (grid.columns * row),
		cell = new Cell(column, row, grid.cells.length);

	  grid.cells.push(cell)

	  grid.columnSet[column].cells.push(cell)
	  grid.rowSet[row].cells.push(cell)

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
			<h1>${cell.index}</h1>
      <table>
	      <thead>
	      	<tr>
		      	<td>col</td>
		      	<td>row</td>
	      	</tr>
	      </thead>
	      <tbody>
		      <tr>
		      	<td>${cell.column}</td>
		      	<td>${cell.row}</td>
	      	</tr>
	      </tbody>
      </table>
      <p>${cell.color}</p>
      </div>
    </div>
  `)
}

function setZoom() {
	Object.assign(lens[0].style, {
		width:`${val}%`,
		height:`${val}%`,
		top:`${(100-val)/2}%`,
		left:`${(100-val)/2}%`
	})
	height = workspace.innerHeight()
	width = workspace.innerWidth()
	$("input.readout#zoom")[0].value = `${val}%`
	$("input.readout#width")[0].value = `${Math.round(width)}px`
	$("input.readout#height")[0].value = `${Math.round(height)}px`
}

function changeZoom(e) {
	val = e.target.value;
  setZoom()
	updateCellSize();
}

function changeBorderWidth(e) {
	borderVal = e.target.value;
  grid.border = e.target.value;
  $("input.readout#border")[0].value = e.target.value
  $(".nucleus").css("border-width",`${grid.border}px`);
  workspace.css("outline-width",`${grid.border}px`);	
}

$("#widthRange").attr("max", $("body").innerWidth()*1.5);
$("#widthRange").attr("value",$("body").innerWidth()*(val/100))
$("#widthRange").on("input change", function() {
	let w = this.value
	Object.assign(canvas[0].style, {
		width: `${w}px`,
		left: `50%`,
		marginLeft: `${-(w/2)}px`
	})
	$("input.readout#width")[0].value = `${w}px`
	updateCellSize();
})

$("#heightRange").attr("max", $("body").innerHeight()*1.5);
$("#heightRange").attr("value",$("body").innerHeight()*(val/100))
$("#heightRange").on("input change", function() {
	let h = this.value
	Object.assign(canvas[0].style, {
		height: `${h}px`,
		top: `50%`,
		marginTop: `${-(h/2)}px`
	})
	$("input.readout#height")[0].value = `${h}px`
	updateCellSize();
})

setInterval(function() {
	if (animate) {
		addColumn("right")
		removeColumn("left")
		addRow("bottom")
		removeRow("top")
	}
},1000)

function changeBorderColor(e) {
  const color = e.target.innerText;
  let output = color == "white" ? "black" : "white"
  e.target.innerText = output
  grid.borderColor = output;
  workspace.css("outline-color",output,"background",output);
  $(".nucleus").css("border-color",output);
}

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

function reportGridSize(t) {
	const target = t ? grid[t] : grid
	console.log(target)
}

function toggleInteractive(e) {
	const state = interactive ? "static" : "interactive"
	e.target.innerText = state
	$(".cell").toggleClass("interactive")
	interactive = !interactive
}

function toggleAnimate() {
	animate = !animate
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
zoom.on("input change", function(e) {changeZoom(e)})
border.on("input change", function(e) {changeBorderWidth(e)})
$("#borderColor").click(function(e){changeBorderColor(e)})
$("#toggleAnimate").click(function(){toggleAnimate()})


window.onresize = reportWindowSize;

$(document).on("click",".nucleus",function(e) {
	console.log(grid.cells.filter(f => f.index == e.target.parentNode.dataset.cell)[0])
})

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
	  	x: e.clientX - cellDimensions.left + (($("body").width() - canvas.width())/2),
	  	y: e.clientY - cellDimensions.top + (($("body").height() - canvas.height())/2)
	  };

	  let destination = document.elementFromPoint(e.clientX,e.clientY).parentElement,
	  destinationCellIndex = Array.prototype.indexOf.call(workspace.children(),destination),
		obj =  clickedCell.cloneNode(true);

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
		  $(".cell").removeClass("destination")
		  $(destination).addClass("destination")
		  destinationCellIndex = Array.prototype.indexOf.call(workspace.children(),destination)
		}
	  
	  document.addEventListener('mousemove', onMouseMove);

	  $(document).on("mouseup",".cell", function(f) {
	  	const workspaceNode = workspace[0];
	  	let el = $("#virtual")[0]
	  	$(".cell").removeClass("destination")
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

	    document.removeEventListener('mousemove', onMouseMove);
	    obj.remove()
	    $(document).unbind('mouseup');
	  });
	}
})

$(document).ondragstart = function() {
  return false;
};