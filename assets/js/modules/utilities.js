function getSmallestAvailableIndex(grid, axis) {
	let array = []
	for (var i = grid[axis].length - 1; i >= 0; i--) {
		array.push(grid[axis][i].index)
	}
	return Math.max(...array) + 1;
}

function renderCell(cell, grid) {
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

export { renderCell, getSmallestAvailableIndex };