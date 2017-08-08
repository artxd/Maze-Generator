const maze = document.querySelector("table");
const error = document.querySelector("section > h3");
let x = 0,
	y = 0,
	cells = [];

function createMaze() {
	maze.innerHTML = "";
	error.innerHTML = "";
	x = Number(document.getElementById("x").value);
	y = Number(document.getElementById("y").value);
	let n = x * y;
	if (x * y - 1 < 0 || x === 1 || y === 1) {
		error.innerHTML = "X and Y must be Integer values bigger than 1";
		return;
	}
	cells = createCells();
	let unvisited = createUnvisitedCells(),
		cX = 1,
		cY = 1,
		counter = 1,
		path = [];
	function step() {
		if(counter >= n) return;
		setTimeout(function() {
			let current = getCellIndex(cX, cY);
			unvisited[cY][cX] = false;
			let neighbours = [[cY, cX + 1], [cY, cX - 1], [cY + 1, cX], [cY - 1, cX]];
			let unvisitedNeighbours = getUnvisitedNeighbours(unvisited, neighbours);
			let next;
			if (unvisitedNeighbours.length > 0) {
				counter++;
				if (unvisitedNeighbours.length > 1) path.push([cY, cX]);
				let randomNeighbour =
					unvisitedNeighbours[Math.floor(Math.random() * unvisitedNeighbours.length)];
				next = getCellIndex(randomNeighbour[1], randomNeighbour[0]);
				dealWithBorders(current, next);
				cX = randomNeighbour[1];
				cY = randomNeighbour[0];
				current = next;
			} else {
				let fromPath = path.pop();
				next = getCellIndex(fromPath[1], fromPath[0]);
				cX = fromPath[1];
				cY = fromPath[0];
				current = next;
			}
			step();
		}, 10);
	}
	step();
}

function dealWithBorders(currentIndex, nextIndex) {
	console.log(currentIndex+" - "+nextIndex);
	let i = currentIndex,
		j = nextIndex;
	if (j > i) {
		if (j > i + 1) {
			cells[currentIndex].style.borderBottom = "none";
			cells[nextIndex].style.borderTop = "none";
		} else {
			cells[currentIndex].style.borderRight = "none";
			cells[nextIndex].style.borderLeft = "none";
		}
	} else {
		if (j < i - 1) {
			cells[currentIndex].style.borderTop = "none";
			cells[nextIndex].style.borderBottom = "none";
		} else {
			cells[currentIndex].style.borderLeft = "none";
			cells[nextIndex].style.borderRight = "none";
		}
	}
}

function getUnvisitedNeighbours(unvisited, neighbours) {
	let unvisitedNeighbours = [];
	neighbours.forEach(function(e) {
		if (unvisited[e[0]][e[1]]) unvisitedNeighbours.push(e);
	});
	return unvisitedNeighbours;
}

function createUnvisitedCells() {
	let unvisited = [];
	for (let i = 0; i < y + 2; i++) {
		unvisited[i] = [];
		for (let j = 0; j < x + 2; j++) {
			if (i === 0 || i === y + 1 || j === 0 || j === x + 1)
				unvisited[i].push(false);
			else unvisited[i].push(true);
		}
	}
	return unvisited;
}

function getCellIndex(cX, cY) {
	return (cY - 1) * x + (cX - 1);
}

function createCells() {
	let width = Math.round(100 / x * 100) / 100;
	for (let i = 0; i < y; i++) {
		let row = document.createElement("tr");
		for (let j = 0; j < x; j++) {
			let data = document.createElement("td");
			data.style.width = String(width) + "%";
			data.style.paddingBottom = String(width) + "%";
			row.appendChild(data);
		}
		maze.appendChild(row);
	}
	return document.querySelectorAll("td");
}
