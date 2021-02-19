let interactive = true

export default function() {
// Drag and drop behavior	
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
}