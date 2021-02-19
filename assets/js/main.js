"use strict";

// const batch = require("./batch.js");	

const rawData = data 
// ES6 syntax below duplicates array instead of simply assigning a new variable name.
let availableData = [...rawData];
let usedData = [];
let latest = [];

class Grid {
  constructor(columns, rows, border) {
    this.columns = columns,
    this.rows = rows;
    this.border = border;
    this.borderColor = white;
    this.data = [];
  };
  get cells() {
    return this.columns * this.rows;
  };
};

class Cell {
  constructor(obj) {
    this.datum = obj ? obj : getRandomCell();
    this.title = this.datum.title;
    this.key = this.datum.id;
    this.image = this.datum.img;
    this.url = this.datum.youtube
    this.height = height / grid.rows;
    this.width = width / grid.columns;
    this.color = getRandomColor();
  };
};

const grid = new Grid(4,3,2);

let canvas = $("#canvas"),
height = canvas.innerHeight(),
width = canvas.innerWidth();

// |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
// ||| DOM |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
// |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||

( //Render Grid
  function() {
    getLatestDataHelper()
    let mql = window.matchMedia('(max-width: 600px)');
    if (mql.matches) {
      grid.columns = 1;
    } else {
      grid.columns = 4;
    }
    for (var i = 0; i <= grid.cells -1; i++) {
      let cell = getRandomCell()
      addCell(cell);
    };
  }()
);

// Create latest data array
function getLatestDataHelper() {
  for (var i = 0; i <= grid.cells - 1; i++) {
    latest.push(rawData[i])
  }
}

function updateGrid() {
  let currGridLen = canvas.children().length,
  targetGridLen = grid.cells,
  diff = targetGridLen - currGridLen;

  if( diff > 0 ) {
    for (var i = 0; i <= diff - 1; i++) {
      addCell();
    };
  } else if ( diff < 0 ) {
    for (var i = 0; i <= (diff * -1) - 1; i++) {
      removeCells();
    };
  };
  updateCellSize();
};

function addCell(obj) {
  const cell = new Cell(obj);
  const prevData = grid.data;
  const newData = prevData.push(cell);
  canvas.append(`
    <div class="cell"
    data="${cell.key}"
    data-url="${cell.url}"
    data-title="${cell.title}"
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
        background-image:url('${cell.image}');
        "
      >
      </div>
    </div>
  `);
};

// pass in an arbitrary set of ids and load the appropriate grid
function loadGrid() {
  const data = ["Alessandro_20170421_lij", "Lorenzo_20130202_quc", "Sorcha_20140828_gle", "Martha_20151013_ayr", "Nastya_20150609_deu+fra+rus+ces+eng", "Joshi_20131201_epo", "Lee_20130706_eng", "Leo_20191210_fuf+fra", "Rosemary_20150113_gla", "Jamal_20200412_shi", "Mustafa+Gulnisa+Elise_20190306_uig", "Leslie_20140209_eng"]
}

function removeCells() {
  const target = canvas.children().last().attr("data"),
  index = usedData.map(p => p.id).indexOf(target),
  removedCell = usedData[index];

  canvas.children().last().detach();
  usedData.splice(index,1);
  availableData.push(removedCell);
};

function randomizeAllCells() {
  for (var i = grid.cells - 1; i >= 0; i--) {
    removeCells()
  }
  for (var i = grid.cells - 1; i >= 0; i--) {
    addCell()
  }
}

function setLatestData() {
  for (var i = grid.cells - 1; i >= 0; i--) {
    removeCells()
  }
  for (var i = 0; i <= grid.cells - 1; i++) {
    usedData.push(rawData[i])
    availableData.splice(i,1);
    addCell(latest[i])
  }
}

function getRandomCell() {
  const index = Math.floor(Math.random()*availableData.length),
  cell = availableData[index];
  usedData.push(cell);
  availableData.splice(index,1);

  return cell;
};

function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";

  for (var i = 0; i < 6; i++) {
    color += letters[8 + Math.floor(Math.random() * 8)];
  };

  return color;
};

// |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
// ||| INTERACTION |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
// |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||

function reportWindowSize() {
  height = window.innerHeight;
  width = window.innerWidth;
  updateCellSize();
};

function updateCellSize() {
  $(".cell").height(canvas.innerHeight()/grid.rows);
  $(".cell").width(canvas.innerWidth()/grid.columns);
};

window.onresize = reportWindowSize;

$("input").change(function(e){
  const target = e.target
  const preChange = grid[target.id]
  grid[target.id] = Number(this.value);
  if (rawData.length >= grid.cells) {
    updateGrid();
  } else {
    target.value = preChange;
    alert("Error. Not enough additional data to display.")
    grid[target.id] = preChange;
  }

  $(".nucleus").css("border-width",`${grid.border}px`);
  $("input#gridSize").val(grid.cells);
})

$(document).on("mouseover", ".cell", function(e) {
  const obj = $(e.target).parent().attr("data");
  const title = $(e.target).parent().attr("data-title");
  history.pushState({page:obj}, obj, `?video=${obj}`);
  document.querySelector("#title").textContent = title;
})

$(document).on("mouseover", "#controls", function(e) {
  document.querySelector("#title").textContent = "";
})

$(document).on("click", ".nucleus", function(e) {
  const url = $(e.target).parent().attr("data-url");
  const iframe = `
    <div id="modalWrapper">
      <div id="modal">
        <button class="close" data-for="modalWrapper">
          <span class="background"></span>
        </button>
        <iframe id="iframe" width="560" height="315" src="https://www.youtube.com/embed/${url}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" controls=0 modestbranding=1 allowfullscreen>
        </iframe>
      </div>
    </div>`;
  $("#wrapper").after(iframe);
});

function closeModal () {
  $("#modalWrapper").remove();
}

$(document).on("keydown", function(event) {
 event.key === "Escape" ? closeModal() : undefined;
});

$(document).click(function(e) {
  e.target.id === "modalWrapper" ? closeModal() : undefined;
});

$(document).on("click", ".close", function(e) {
  const target = $(e.target).attr("data-for");
  target === "modalWrapper" ? closeModal() : $(`#${target}`).toggleClass("hidden");
})

$("#menu").click(function(e) {
  $("#tool").toggleClass("hidden");
})

$("#random").click(function(e){
  randomizeAllCells();
})

$("#latest").click(function(e){
  setLatestData();
})

$(".borderColor").click(function(e){
  const color = e.target.id;
  grid.borderColor = color;
  $("#canvas").css("border-color",color);
  $(".nucleus").css("border-color",color);
})

$("#details").click(function(e) {
  const gridData = grid.data.map(p => `<li><p>${p.key}</p></li>`).join('')
  $("#gridSize").parent().after(`
    <ol id="gridData">${gridData}</ol>
    `)
})

// $("#metadata").on("click", function() {
//   let test = grid.data.map(p => p.key)
//   console.log(grid.data)
//   test = []
// })
// |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
// ||| DIAGNOSTICS |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
// |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
// Add column and row values
$("input#columns").val(grid.columns);
$("input#rows").val(grid.rows);
$("input#border").val(grid.border);
$("input#gridSize").val(grid.cells);
