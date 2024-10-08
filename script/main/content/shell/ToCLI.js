const ColorToCLI = {
	BLACK: "\x1b[30m",
	BLUE: "\x1b[34m",
	CYAN: "\x1b[36m",
	DKGRAY: "\x1b[90m",
	GRAY: "\x1b[90m", // really bad idea use dim instead
	GREEN: "\x1b[32m",
	LTGRAY: "\x1b[37m",
	MAGENTA: "\x1b[95m",
	RED: "\x1b[31m",
	TRANSPARENT: "\x1b[8m", // not effective everywhere
	WHITE: "\x1b[97m", 
	YELLOW: "\x1b[93m",

	ORANGE: "\x1b[33m",
	PURPLE: "\x1b[35m",
	PINK: "\x1b[91m",
	LIME: "\x1b[92m",
	LAZURE: "\x1b[94m",
	AQUA: "\x1b[96m",

	RESET: "\x1b[0m",
	BOLD: "\x1b[1m",
	DIM: "\x1b[2m",
	ITALIC: "\x1b[3m",
	INVERSE: "\x1b[7m" // also selection
};

const BackgroundToCLI = {
	BLACK: "\x1b[40m",
	BLUE: "\x1b[44m",
	CYAN: "\x1b[46m",
	DKGRAY: "\x1b[100m",
	GRAY: "\x1b[100m", // really bad idea use dim instead
	GREEN: "\x1b[42m",
	LTGRAY: "\x1b[47m",
	MAGENTA: "\x1b[105m",
	RED: "\x1b[41m",
	TRANSPARENT: "\x1b[8m", // not effective everywhere
	WHITE: "\x1b[107m", 
	YELLOW: "\x1b[103m",

	ORANGE: "\x1b[43m",
	PURPLE: "\x1b[45m",
	PINK: "\x1b[101m",
	LIME: "\x1b[102m",
	LAZURE: "\x1b[104m",
	AQUA: "\x1b[106m",

	RESET: "\x1b[0m",
	INVERSE: "\x1b[7m" // also selection
};
