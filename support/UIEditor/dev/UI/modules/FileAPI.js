/*
	(╯°□°）╯︵ ┻━┻
*/
var File = java.io.File;
var FileReader = java.io.FileReader;
var BufferedReader = java.io.BufferedReader;
var FOS = java.io.FileOutputStream;
var String = java.lang.String;
var StringBuilder = java.lang.StringBuilder;
var sdcard = android.os.Environment.getExternalStorageDirectory();
var FileAPI={
	getName: function(dir){
		let name = new File(dir).name;
		return(name.replace('.png', ''));
	},
	select:function(dir,Name){
		return (new File(dir,Name));
	},
	createNewDir:function(dir, newDirName){
		return (new File(dir, newDirName).mkdir());
	},
	exists:function(file){
		return file.exist();
	},
	create:function(path, name){
		new File(path, name).createNewFile();
		return File;
	},
	deleteF:function(path){
		try{var filed = new java.io.File(path);
			if(filed.isDirectory()){
			var directoryFiles = filed.listFiles();
			for(var i in directoryFiles){
				FileAPI.deleteF(directoryFiles[i].getAbsolutePath());
			}
			filed.deleteF();
		}
			if(filed.isFile()){
			filed.deleteF();}
		}catch(e){
			print(e);
		}
	},
	read:function(selectedFile){
		var readed=(new BufferedReader(new FileReader(selectedFile)));
		var data=new StringBuilder();
		var string;
		while((string=readed.readLine())!=null){
			data.append(string);
			data.append('\n');
		}
		return data.toString();
	},
	readLine:function(selectedFile, line){
		var readT=new FileAPI.read(selectedFile);
		var lineArray=readT.split('\n');
		return lineArray[line-1];
	},
	write:function(selectedFile , text){
		FileAPI.rewrite(selectedFile,(new FileAPI.read(selectedFile)) + text);
	},
	rewrite:function(selectedFile, text){
		var writeFOS = new FOS(selectedFile);
		writeFOS.write(new String(text).getBytes());
	},
	getFilesList:function(path, endsWith){
		var c = [], d = (new java.io.File(path)).listFiles();
		for(var e = 0; e < d.length; e++) {
			var f = d[e];
			f.isDirectory() || endsWith && !f.getName().endsWith(endsWith) || c.push(f.getName())
		}
		return c
	},
	//my
	checkDir:function(name){
		for(let i in name){
			if(FileTools.isExists(__dir__+name[i])==false)
			FileAPI.createNewDir(__dir__, name[i]);
		}
	},
	list:function(dir) {
		let list = [];
		for(let i in dir){
			list.push(FileTools.GetListOfFiles(__dir__+dir[i]));
		}
		return list;
	},
	getFilesCount:function(list) {
		let count=0;
		for(let i in list)count++;
		return count;
	},
	getGuiItems: function(gui){
		let count = 0;
		for(let i in gui.elements){
			if(gui.elements[i]!=null){count++;}
		}
		if(count>0)return true; else return false;
	}
};
/*
	┬─┬ノ( º _ ºノ)
*/
