var BufferedReader = java.io.BufferedReader;
var FileReader = java.io.FileReader;
var StringBuilder = java.lang.StringBuilder;

function readFile(path){
    var reader = new BufferedReader(new FileReader(path));
    var builder = new StringBuilder();
    
    try{
        var line = reader.readLine();
        while (line != null) {
            builder.append(line);
            line = reader.readLine();
        }
        return builder.toString();
    } catch(e){
        Game.message(e);
    }
}