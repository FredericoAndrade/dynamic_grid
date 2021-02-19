export function() {
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
}
