function runScript(filename){
    var code = readFile(__dir__ + "scripts/" + filename);
    eval("try {" + code + " ;Game.message('Successfully run file ' + filename);}" + 
    "catch(e){Game.message('Some errors occured when running file ' + filename + ':');Game.message(e);}");
    
}