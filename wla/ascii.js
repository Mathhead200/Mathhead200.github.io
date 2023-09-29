const { ANIMALS, PROMPT } = window;
let selected = new Set();

const select = (path) => {
	if (selected.has(path)) {
		path.classList.remove("selected");
		selected.delete(path);
	}
	else {
		path.classList.add("selected");
		selected.add(path);
	}
};

const animalMatches = path => {
	for (let c of path.classList)
		if (ANIMALS.has("" + c))
			return true;
	return false;
};

const success = () => {
	// size is the same?
	if (ANIMALS.size !== selected.size)
		return false;
	// and, all animals match?
	for (let path of selected)
		if (!animalMatches(path))
			return false;
	// then, success
	return true;
};

// events
let svg = document.querySelector("#animals");
for (let path of svg.querySelectorAll("path")) {
	if (path.classList.contains("NA"))
		continue;
	path.addEventListener("click", event => {
		select(path);
		if (success()) {
			let a = prompt(PROMPT.q);
			if (a === PROMPT.a) {
				alert("close...");
			} else if (PROMPT.ascii.test(a)) {
				alert(`Your clue is... ${PROMPT.clue}`);
				document.querySelector("#clue").innerHTML = `<div>${PROMPT.clue}</div>`;
				location.href = "#clue";
			} else {
				alert("Try again.");
			}
		}
	});
}

// initialize ASCII
let main = document.querySelector("#ascii");
for (let animal of [...ANIMALS].sort()) {
	let span = document.createElement("span");
	for (let i = 0; i < animal.length; i++) {
		let hex = animal.charCodeAt(i).toString(16).toUpperCase();
		while (hex.length < 2)
			hex = "0" + hex;
		span.innerText += hex + " ";
	}
	main.append(span);
}