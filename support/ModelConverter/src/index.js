
function myFunction() {
  var obj = document.getElementById("name").value;
  var c = eval('var code=' + obj);
  // code = JSON.parse(code);
  var exporting = "";
  if (code.elements) {
    exporting += "\t\/\/" + " Generated With Model Converter - Json To ICModel\n";
    exporting += "var render = new ICRender.Model();\nvar model = BlockRenderer.createModel();";
    for (let i in code.elements) {
      let curr = code.elements[i];
      exporting += "\n\tmodel.addBox(";
      exporting += curr.from["0"] + "/16, " + curr.from["1"] + "/16, " + curr.from["2"] + "/16, " + curr.to["0"] + "/16, " + curr.to["1"] + "/16, " + curr.to["2"] + "/16";
      exporting += ", [";
      var face = curr.faces;
      var down = up = south = north = west = east = "";
      if (face["down"]) {
        try {
          down = code["textures"][face["down"]["texture"].replace(/^(#-|#)/, "")].replace(/^.*:.*\//, "");
          exporting += "\"" + down + "\", 0]";
        } catch (e) { console.log(e) }
      }
      if (face["up"]) {
        try {
          up = code["textures"][face["up"]["texture"].replace(/^(#-|#)/, "")].replace(/^.*:.*\//, "");
          exporting += ", [\"" + up + "\", 0]";
        } catch (e) { console.log(e) }
      }
      if (face["south"]) {
        try {
          south = code["textures"][face["south"]["texture"].replace(/^(#-|#)/, "")].replace(/^.*:.*\//, "");
          exporting += ", [\"" + south + "\", 0]";
        } catch (e) { console.log(e) }
      }
      if (face["north"]) {
        try {
          north = code["textures"][face["north"]["texture"].replace(/^(#-|#)/, "")].replace(/^.*:.*\//, "");
          exporting += ", [\"" + north + "\", 0]";
        } catch (e) { console.log(e) }
      }
      if (face["west"]) {
        try {
          west = code["textures"][face["west"]["texture"].replace(/^(#-|#)/, "")].replace(/^.*:.*\//, "");
          exporting += ", [\"" + west + "\", 0]";
        } catch (e) { console.log(e) }
      }
      if (face["east"]) {
        try {
          east = code["textures"][face["east"]["texture"].replace(/^(#-|#)/, "")].replace(/^.*:.*\//, "");
          exporting += ", [\"" + east + "\", 0]";
        } catch (e) { console.log(e) }
      }
      exporting += "]);";
      exporting += " \/\/" + curr.name;
    }
    exporting += "\nrender.addEntry(model);\nBlockRenderer.setStaticICRender(BlockID.block_rendered, 0, render);" +
      "\n\/\/Model generated with block id block_rendered, please change id before copy pasting to your code!";
    document.getElementById("frm2").value = exporting;
  }
}