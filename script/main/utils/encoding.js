/**
 * Avoids large fractions in project.
 */
const preround = function(number, fixed) {
	typeof fixed == "undefined" && (fixed = 6);
	return parseFloat(Number(number).toFixed(fixed));
};

const MathUtils = {};

MathUtils.RAD = 180 / Math.PI;

MathUtils.mathDivider = function(who) {
	if (who == 0) {
		return "" + who;
	}
	if (who % 100000000 == 0) {
		return Math.round(who / 1e8) + "e8";
	}
	if (who % 10000000 == 0) {
		return Math.round(who / 1e7) + "e7";
	}
	if (who % 1000000 == 0) {
		return Math.round(who / 1e6) + "e6";
	}
	if (who % 100000 == 0) {
		return Math.round(who / 1e5) + "e5";
	}
	if (who % 10000 == 0) {
		return Math.round(who / 1e4) + "e4";
	}
	if (who % 1000 == 0) {
		return Math.round(who / 1e3) + "e3";
	}
	if (who % 100 == 0) {
		return Math.round(who / 1e2) + "e2";
	}
	if (who % 1 == 0) {
		return "" + who;
	}
	if (who % .5 == 0) {
		return Math.round(who * 2) + "/2";
	}
	if (who % .25 == 0) {
		return Math.round(who * 4) + "/4";
	}
	if (who % .125 == 0) {
		return Math.round(who * 8) + "/8";
	}
	if (who % .0625 == 0) {
		return Math.round(who * 16) + "/16";
	}
	if (who % .03125 == 0) {
		return Math.round(who * 32) + "/32";
	}
	if (who % .015625 == 0) {
		return Math.round(who * 64) + "/64";
	}
	if (who % .0078125 == 0) {
		return Math.round(who * 128) + "/128";
	}
	if (who % .00390625 == 0) {
		return Math.round(who * 256) + "/256";
	}
	if (who % .001953125 == 0) {
		return Math.round(who * 512) + "/512";
	}
	if (who % .0009765625 == 0) {
		return Math.round(who * 1024) + "/1024";
	}
	return "" + who;
};

const Base64 = {};

Base64.encode = function(bytes) {
	if (android.os.Build.VERSION.SDK_INT >= 26) {
		return java.util.Base64.getEncoder().encode(bytes);
	}
	return android.util.Base64.encode(bytes, android.util.Base64.NO_WRAP);
};

Base64.encodeToString = function(bytes) {
	if (android.os.Build.VERSION.SDK_INT >= 26) {
		return java.util.Base64.getEncoder().encodeToString(bytes);
	}
	return android.util.Base64.encodeToString(bytes, android.util.Base64.NO_WRAP);
};

Base64.decode = function(bytes) {
	if (android.os.Build.VERSION.SDK_INT >= 26) {
		return java.util.Base64.getDecoder().decode(bytes);
	}
	return android.util.Base64.decode(bytes, android.util.Base64.NO_WRAP);
};
