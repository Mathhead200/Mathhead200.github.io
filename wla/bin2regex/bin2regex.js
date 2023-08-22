let regex = null;

/**
 * Converts a binary number (in String form) into
 *  a RegEx pattern that will match it.
 * @param {String} bin
 * @param {Object} {
 * 	{Boolean} includeHex:
 * 		Should he RegEx include a possible hexadecimal
 * 		match as well as the binary match?
 * }
 * @returns {String} RegEx
 */
const bin2RegEx = function(bin, options) {
	// preconditions
	if (!bin || bin.length === 0)
		throw Error(`bin must be defined and non-empty: ${bin}`);

	// "scrub" input
	bin = bin.replaceAll(/[\s,_]/g, "");

	// bin String to RegEx pattern (as String)
	let pattern = "" + bin[0];
	for (let i = 1; i < bin.length; i++) {
		pattern += "[\\s,_]*";
		pattern += bin[i];
	}

	// Do same for hex (maybe)
	if (options && options.includeHex) {
		hexLower = parseInt(bin, 2).toString(16).toLowerCase();
		hexUpper = hexLower.toUpperCase();
		
		hexPatterns = [];
		for (hex of [hexLower, hexUpper]) {
			let hexPattern = "" + hex[0];
			for (let i = 1; i < hex.length; i++) {
				hexPattern += "[\\s,_]*";
				hexPattern += hex[i];
			}
			hexPatterns.push(hexPattern);
		}

		pattern = `(${pattern}|${hexPatterns[0]}|${hexPatterns[1]})`;
	}

	// results
	pattern = `^\\s*[0\\s,_]*${pattern}\\s*$`;
	regex = new RegExp(pattern);  // store result as global
	return pattern;
}

class IOForm {
	constructor(form_selector, input_name, output_name, callback) {
		this.form = document.querySelector(form_selector);
		Object.assign(this, { input_name, output_name });
		
		this.listener = event => {
			try {
				this.output.value = callback(this.input.value, this);
			} catch(err) {
				console.warn(err);
				this.output.value = "";
			}
		};
		this.form.addEventListener("submit", event => {
			event.preventDefault();
			this.listener(input, this);
		});
		this.input.addEventListener("keyup", this.listener);
		this.input.addEventListener("change", this.listener);
	}
	get input() { return this.form.elements[this.input_name]; }
	get output() { return this.form.elements[this.output_name]; }
}

let convert = new IOForm("#bin2regex_convert", "binary", "regex",
	(input, self) => bin2RegEx(input, { includeHex: self.form.hexadecimal.checked }));
convert.form.hexadecimal.addEventListener("change", convert.listener);
convert.form.hexadecimal.addEventListener("click", convert.listener);

let validate = new IOForm("#bin2regex_validate", "input", "output",
	input => regex.test(input));
