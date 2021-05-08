/*
BUILD INFO:
  dir: dev
  target: main.js
  files: 4
*/



// file: main.js

var code;


Callback.addCallback("PostLoaded", function(){
    code = readFile(__dir__ + "scripts/1.js");
    
});


Callback.addCallback("NativeGuiChanged", function(screenName){
    if(screenName == "hud_screen" || screenName == "in_game_play_screen"){
        if(!container.isOpened()){
            container.openAs(window);
        }
    }
    else{
        container.close() 
    }
});




// file: readFile.js

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




// file: gui.js

var AlertDialog  = android.app.AlertDialog;
var DialogInterface = android.content.DialogInterface;
var ScrollView = android.widget.ScrollView;
var LinearLayout = android.widget.LinearLayout;
var Button = android.widget.Button;
var OnClickListener = android.view.View.OnClickListener;
var DialogInterface = android.content.DialogInterface;
var File = java.io.File;

var ctx = UI.getContext();


var window = new UI.Window({
    location: {
        x:950,
        y:0,
        width:60,
        height:60
    },
    elements: {
        "0": {type: "button", x: 0, y: 0, bitmap: "btnIR", scale: 60, clicker: {
            onClick: openAndroidUI
        }}
    },
    drawing: [
        {type: "background", color: android.graphics.Color.TRANSPARENT}
    ]
});
window.setAsGameOverlay(true);
var container = new UI.Container();



function openAndroidUI(){
    try{
        var builder = new AlertDialog.Builder(ctx);
        builder.setTitle("Instant Runner");
        var scroll = new ScrollView(ctx);
        var layout = new LinearLayout(ctx);
        layout.setOrientation(LinearLayout.VERTICAL);
        
        var dir = new File(__dir__ + "scripts/");
        var files = dir.listFiles();
        
        for(var i in files){
            let filename = files[i].getName();
            let btn = new Button(ctx);
            btn.setText(filename);
            btn.setOnClickListener(new OnClickListener({
                onClick: function(){
                    dialog.dismiss();
                    runScript(filename);
                }
            }));
            layout.addView(btn);
        }
        
        scroll.addView(layout);
        builder.setView(scroll);
        var dialog = builder.show();
    } catch(e){
        Game.message(e);
    }
}




// file: eval.js

function runScript(filename){
    var code = readFile(__dir__ + "scripts/" + filename);
    eval("try {" + code + " ;Game.message('Successfully run file ' + filename);}" + 
    "catch(e){Game.message('Some errors occured when running file ' + filename + ':');Game.message(e);}");
    
}




