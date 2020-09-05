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
