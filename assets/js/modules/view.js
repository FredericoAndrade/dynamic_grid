const workspace = $("#workspace"),
zoom = $("#zoom"),
border = $("#border")

let borderVal = border.val,
val = zoom.val(),
height,
width

function updateSlider(val) {
	$("#lens").css("width",`${val}%`)	
	$("#lens").css("height",`${val}%`)
	$("#lens").css("top",`${(100-val)/2}%`)	
	$("#lens").css("left",`${(100-val)/2}%`)		
	height = workspace.innerHeight()
	width = workspace.innerWidth()
}

function reportWindowSize() {
  height = window.innerHeight;
  width = window.innerWidth;
  updateCellSize(grid);
};

function updateCellSize(grid) {
  $(".cell").height(workspace.innerHeight()/grid.rows);
  $(".cell").width(workspace.innerWidth()/grid.columns);
};

function updateTools(grid) {
	$("input#columns").val(grid.columns);
	$("input#rows").val(grid.rows);
	$("input#gridSizeReport").val(grid.getCells);
}

function reportGridSize(grid) {
	console.log("Grid size: ", grid)
}

function toggleBorderColor(grid, e) {
	const color = e.target.innerText;
  let output = color == "white" ? "black" : "white"
  e.target.innerText = output
  grid.borderColor = output;
  workspace.css("outline-color",output,"background",output);
  $(".nucleus").css("border-color",output);
}

function updateZoom(grid, e) {
	val = e.target.value;
  updateSlider(val)
	updateCellSize(grid);
}

function inputGridChange(e, grid) {
	console.log(e)
	const param = e.target;
  const updatedValue = param.value;
  const sign = grid[param.id] < updatedValue ? "add" : "remove";
  const loc = param.id == "columns" ? "Right" : "Bottom";
  let magnitude = updatedValue - grid[param.id]
	for (var i = Math.abs(magnitude) - 1; i >= 0; i--) {
		window[`${sign}${loc}`]()
	}
  $(".nucleus").css("border-width",`${grid.border}px`);
}

function changeBorderWidth(grid, e) {
	borderVal = e.target.value;
  grid.border = e.target.value;
  $(".buttonGroup#borderGroup input[type='text']")[0].value = e.target.value
  $(".nucleus").css("border-width",`${grid.border}px`);
  workspace.css("outline-width",`${grid.border}px`);
}

export { updateSlider, reportWindowSize, updateCellSize, updateTools, reportGridSize, toggleBorderColor, updateZoom, changeBorderWidth, inputGridChange };