unpackModRepository = function(repository, output, appendToExisting) {
	if (arguments.length < 2) {
		MCSystem.throwException("unpackModRepository: Usage: <repositoryDirectory> <outputDirectory> [appendToExisting]");
	}

	let outputDirectory = Files.of(output);
	if (outputDirectory.isFile()) {
		MCSystem.throwException("unpackModRepository: Output path is file");
	} else if (!outputDirectory.exists()) {
		outputDirectory.mkdirs();
	} else if (!appendToExisting) {
		Files.remove(outputDirectory);
	}

	let archives = Files.listFiles(repository, "relative", "icmod");
	if (archives == null || archives.length == 0) {
		MCSystem.throwException("unpackModRepository: Directory is empty or does not exists");
	}

	log("unpackModRepository: " + repository + " -> " + output);

	// let folders = $.ExtractionHelper.extractICModFile(file, {
		// message: function(message) {
			// log("unpackModRepository: " + message);
		// }
	// }, null);

	for (let i = 0, l = archives.length; i < l; i++) {
		let archive = Files.of(repository, archives[i]);
		log("unpackModRepository: Unpacking '" + archives[i] + "' to relative directory");
		let relativeDirectory = Files.basename(archives[i], true);
		let buildConfigDirectory = null;
		try {
			let zipPathOrFile = new java.util.zip.ZipFile(archive);
			try {
		        let entries = zipPathOrFile.entries();
		        while (entries.hasMoreElements()) {
		            let element = entries.nextElement();
		            if (!element.isDirectory()) {
		                let name = "" + element.getName();
		                if (name == "build.config" || name == "/build.config" || name == "modpack.json" || name == "/modpack.json") {
		                	break;
		                } else if (name.endsWith("/build.config") || name.endsWith("/modpack.json")) {
		                	relativeDirectory = Files.basename(name.substring(0, name.length - 13));
		                	buildConfigDirectory = Files.dirname(name);
		                	break;
		                }
		            }
		        }
	        } catch (e) {
	        	Logger.Log("unpackModRepository: '" + archives[i] + "' is potentially broken, skipped relativeness checking!", "WARNING");
	        }
	        let repositoryOutput = Files.of(outputDirectory, relativeDirectory);
        	let offset = 1;
        	while (Files.is(repositoryOutput)) {
        		repositoryOutput = Files.of(outputDirectory, relativeDirectory + " " + (++offset));
        	}
        	if (offset != 1) {
        		Logger.Log("unpackModRepository: Unpacking to '" + Files.basename(repositoryOutput) + "', because directory already exists!", "WARNING");
        	}
	        let entries = zipPathOrFile.entries();
	        while (entries.hasMoreElements()) {
	            let element = entries.nextElement();
	            let name = "" + element.getName();
	            if (buildConfigDirectory == null || name.startsWith(buildConfigDirectory)) {
		            let outputFile = Files.of(repositoryOutput, buildConfigDirectory != null ? name.substring(buildConfigDirectory.length) : name);
		            if (element.isDirectory()) {
		                Files.ensureDirectory(outputFile);
		            } else {
		                Files.ensureFile(outputFile);
		                outputFile.createNewFile();
		                Files.writeFromStreamUnsafe(zipPathOrFile.getInputStream(element), outputFile);
		            }
	            }
	        }
	        try {
	            zipPathOrFile.close();
	        } catch (e) {}
	    } catch (e) {
	    	Logger.Log("unpackModRepository: " + e, "ERROR");
	    }
	}
};
