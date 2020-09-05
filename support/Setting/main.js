/*
  _____        _    _    _               
 / ____|      | |  | |  (_)              
| (___    ___ | |_ | |_  _  _ __    __ _ 
 \___ \  / _ \| __|| __|| || '_ \  / _` |
 ____) ||  __/| |_ | |_ | || | | || (_| |
|_____/  \___| \__| \__||_||_| |_| \__, |
                                    __/ |
                                   |___/ 
*/

var context = UI.getContext(),
	launchTime = java.lang.System.currentTimeMillis(),
	saveLog = true, menuWidth = 0.26, typeface;

const version = "1.0",
	date = "18.04.2019",
	type = "develop",
	code = 1;

var replace = rule = updateGran = false,
	koll_total = koll_current = 0,
	setsovle = [false, false],
	sovleGoFunctions = true,
	pos1, pos2, blocks = [],
	activeM = activeP = 0,
	functionNumber = 0,
	ab = bc = cd = 0,
	leaved = rover = true,
	lastCode = "";

// debug
var menuCanUpdate = true,
	coordsButtonShow = false,
	locationInfo = true,
	parseAir = true;




/*              *
 *   EXPLORER   *
 *              */

var Dirs = {
	data: "/games/com.mojang/setting",
	inner: "/games/com.mojang/innercore",
	worlds: "/games/com.mojang/minecraftWorlds",
	options: "/games/com.mojang/minecraftpe/options.txt",
	external: android.os.Environment.getExternalStorageDirectory()
};

var Files = {
	createFile: function(path, name) {
		var file = new java.io.File(path, name);
		if (!file.exists()) file.createNewFile();
	},
	createNewWithParent: function(path, name) {
		var file = new java.io.File(path, name);
		file.getParentFile().mkdirs();
		file.createNewFile();
	},
	exists: function(path) {
		return new java.io.File(path).exists();
	},
	createDir: function(path) {
		new java.io.File(path).mkdirs();
	},
	listFiles: function(path) {
		return new java.io.File(path).list();
	},
	filesCount: function(path) {
		return new java.io.File(path).list().length;
	},
	deleteDir: function(path) {
		var file = new java.io.File(path);
		if (file.isDirectory()) {
			var list = file.listFiles();
			for (var item in list) this.deleteDir(list[item]);
		} else this.deleteFile(file);
	},
	getFromAssets: function(name) {
		var assets = context.getAssets();
		return assets.open(name);
	},
	read: function(file, massive) {
		var reader = java.io.BufferedReader(new java.io.FileReader(file)),
			line = "",
			result = [];
		while (line = reader.readLine()) result.push(line);
		return massive ? result : result.join("\n");
	},
	writeBytes: function(file, bytes) {
		file.createNewFile();
		var stream = java.io.FileOutputStream(file);
		stream.write(bytes);
		stream.close();
	},
	write: function(file, text) {
		Files.writeBytes(file, java.lang.String(text).getBytes());
	},
	addText: function(file, text) {
		Files.write(file, Files.read(file) + text);
	},
	sendMail: function(file) {
		var address = android.net.Uri.parse("mailto:nernar.help@gmail.com");
		var intent = new android.content.Intent(android.content.Intent.ACTION_VIEW, address);
		intent.putExtra(android.content.Intent.EXTRA_STREAM, android.net.Uri.fromFile(file));
		context.startActivity(intent);
	},
	linesCount: function(file) {
		return Files.read(file).split("\n").length + 1;
	},
	runScript: function(file) {
		eval(Files.read(file));
	},
	copy: function(file, path) {
		var result = new java.io.File(result),
			exists = result.exists();
		if (!exists) result.createNewFile();
		Files.write(result, Files.read(file));
	},
	cut: function(file, path) {
		Files.copy(file, path);
		file.delete();
	},
	createFromBase64: function(file, code) {
		file.createNewFile();
		Files.writeBytes(file, android.util.Base64.decode(code, 0));
	}
};




/*               *
 *   INTERFACE   *
 *               */

var Ui = {
	display: {
		width: context.getWindowManager().getDefaultDisplay().getWidth(),
		height: context.getWindowManager().getDefaultDisplay().getHeight(),
		density: context.getResources().getDisplayMetrics().density
	},
	orientate: {
		horizontal: 0,
		vertical: 1
	},
	gravity: {
		bottom: 80,
		center: 17,
		right: 5,
		left: 3,
		top: 48,
		no: 0
	},
	direction: {
		inherit: 2,
		locale: 3,
		ltr: 0,
		rtl: 1
	},
	visibility: {
		visible: 0,
		invisible: 4,
		gone: 8
	},
	color: {
		lightGray: -3355444,
		darkGray: -12303292,
		black: -16777216,
		green: -16711936,
		blue: -16776961,
		cyan: -16711681,
		magenta: -65281,
		gray: -7829368,
		transparent: 0,
		yellow: -256,
		red: -65536,
		white: -1,
		parse: function(str) {
			return android.graphics.Color.parseColor(str);
		}
	},
	params: {
		match: -1,
		wrap: -2
	},
	getFontSize: function(size) {
		return Math.round(this.getY(size) / this.display.density);
	},
	getFontMargin: function() {
		return this.getY(7);
	},
	getX: function(x) {
		return (x > 0 ? Math.round(this.display.width / (1440 / x)) : x);
	},
	getY: function(y) {
		return (y > 0 ? Math.round(this.display.height / (720 / y)) : y);
	}
};

function runAsGUI(f) {
	context.runOnUiThread(function() {
		try {
			f();
		} catch(e) {
			Game.message(e);
		}
	});
}




/*                    *
 *   STYLED WIDGETS   *
 *                    */

function getStyledLayout(style) {
	var view = new android.widget.LinearLayout(context);
	switch(style) {
		case "menu":
			view.setBackgroundColor(android.graphics.Color.parseColor("#AA484848"));
			break;
		case "popup":
			view.setBackgroundColor(android.graphics.Color.parseColor("#AA484848"));
			view.setPadding(20, 20, 20, 20);
			break;
		case "setting":
			view.setBackgroundColor(Ui.color.parse("#AA464646"));
			view.setPadding(10, 10, 10, 10);
			break;
	}
	return view;
}

function getStyledButton(style) {
	var view = new android.widget.Button(context);
	view.setTextColor(Ui.color.white);
	view.setTypeface(typeface);
	switch(style) {
		case "menu":
			view.setBackgroundColor(Ui.color.parse("#AA444444"));
			view.setPadding(30, 0, 30, 0);
			view.setTextSize(12);
			break;
		case "transparent":
			view.setBackgroundDrawable(null);
			view.setPadding(30, 0, 30, 0);
			break;
	}
	return view;
}

function getStyledText(style) {
	var view = new android.widget.TextView(context);
	view.setTextColor(Ui.color.white);
	view.setTypeface(typeface);
	switch(style) {
		case "title":
			view.setTextSize(20);
			break;
		case "subtitle":
			view.setGravity(Ui.gravity.center);
			view.setPadding(0, 0, 0, 10);
			view.setTextSize(18);
			break;
		case "group":
			view.setTextColor(Ui.color.lightGray);
			view.setPadding(10, 10, 10, 10);
			view.setTextSize(10);
			break;
		case "debug":
			view.setTextColor(Ui.color.lightGray);
			view.setGravity(Ui.gravity.center);
			view.setPadding(5, 15, 5, 5);
			view.setTextSize(8);
			break;
	}
	return view;
}

function getStyledRadio(style) {
	var view = new android.widget.RadioButton(context);
	view.setTextColor(Ui.color.white);
	view.setTypeface(typeface);
	switch(style) {
		case "setting":
			view.setTextSize(10);
			break;
	}
	return view;
}

function getStyledCheck(style) {
	var view = new android.widget.CheckBox(context);
	view.setTextColor(Ui.color.white);
	view.setTypeface(typeface);
	switch(style) {
		case "setting":
			view.setTextSize(10);
			break;
	}
	return view;
}




/*                    *
 *   MENUS & POPUPS   *
 *                    */

function showHint(hint) {
	runAsGUI(function() {
		text0 = getStyledText();
		text0.setTextSize(Ui.getFontSize(18));
		text0.setTextColor(Ui.color.green);
		text0.setText(hint);
		
		var toast = new android.widget.Toast(context);
		toast.setView(text0);
		toast.show();
	});
}

function createMenu(type) {
	runAsGUI(function() {
		CurrentMenuLayout = getStyledLayout("menu");
		CurrentMenuLayout.setOrientation(Ui.orientate.vertical);
		CurrentMenuLayout.setAlpha(alpha);
		
		var layout = getStyledLayout();
		layout.setGravity(Ui.gravity.right);
		CurrentMenuLayout.addView(layout);
		
		title = getStyledText("title");
		var params = android.widget.RelativeLayout.LayoutParams(Ui.display.width * menuWidth - Ui.display.width / 14, Ui.params.match);
		title.setGravity(Ui.gravity.center);
		title.setLayoutParams(params);
		title.setText("setting");
		layout.addView(title);
		
		button23 = getStyledButton("transparent");
		var params = android.widget.RelativeLayout.LayoutParams(Ui.display.width / 13, Ui.display.width / 13);
		button23.setLayoutParams(params);
		button23.setText(type != 0 ? "‹" : "×");
		button23.setTextSize(30);
		button23.setOnClickListener(function(viewarg) {
			if(type == 0) {
				removeMenu();
				createButton();
			} else {
				updateGran = false;
				removeMenu();
				createMenu(0);
			}
		});
		layout.addView(button23);
		
		var scroll = new android.widget.ScrollView(context);
		CurrentMenuLayout.addView(scroll);
		var layout = getStyledLayout();
		layout.setOrientation(Ui.orientate.vertical);
		scroll.addView(layout);
		
		if(type == 0) {
			if(sovleGoFunctions) {
				text8 = getStyledText("group");
				text8.setText("Замерка");
				layout.addView(text8);
				
				button10 = getStyledButton("menu");
				button10.setText("Закончить");
				button10.setOnClickListener(function(viewarg) {
					rule = false;
					pos1[3] = pos2[3];
					if(menuCanUpdate) updateMenu(type);
				});
				layout.addView(button10);
				
				text1 = getStyledText("group");
				text1.setText("Место");
				layout.addView(text1);
				
				button1 = getStyledButton("menu");
				button1.setText("Точка 1");
				button1.setOnClickListener(function(viewarg) {
					pos1 = [getX(), getY(), getZ(), true];
					setsovle = [false, false];
					updata();
					if(menuCanUpdate) updateMenu(type);
					showHint("Первая точка установлена");
				});
				layout.addView(button1);
				
				button2 = getStyledButton("menu");
				button2.setText("Точка 2");
				button2.setOnClickListener(function(viewarg) {
					pos2 = [getX(), getY(), getZ(), true];
					setsovle = [false, false];
					updata();
					rule = false;
					if(menuCanUpdate) updateMenu(type);
					showHint("Вторая точка установлена");
				});
				layout.addView(button2);
				
				text2 = getStyledText("group");
				text2.setText("Действия");
				layout.addView(text2);
				
				button3 = getStyledButton("menu");
				button3.setText("Заполнить");
				button3.setOnClickListener(function(viewarg) {
					start();
					functionNumber = 1;
				});
				layout.addView(button3);
				
				button7 = getStyledButton("menu");
				button7.setText("Залить");
				button7.setOnClickListener(function(viewarg) {
					start();
					functionNumber = 4;
					koll_set = 0;
				});
				layout.addView(button7);
				
				button8 = getStyledButton("menu");
				button8.setText("Заменить");
				button8.setOnClickListener(function(viewarg) {
					if(replace) {
						start();
						functionNumber = 5;
						koll_set = 0;
					} else showHint("Выберите блок для замены");
				});
				layout.addView(button8);
				
				text3 = getStyledText("group");
				text3.setText("Инструменты");
				layout.addView(text3);
				
				button11 = getStyledButton("menu");
				button11.setText("Блок из руки");
				button11.setOnClickListener(function(viewarg) {
					var carried = Player.getCarriedItem();
					id = carried.id;
					data = carried.data;
					replace = true;
					if(menuCanUpdate) updateMenu(type);
					showHint("Блок для замены выбран");
				});
				layout.addView(button11);
				
				button9 = getStyledButton("menu");
				button9.setText("Замерить");
				button9.setOnClickListener(function(viewarg) {
					pos1 = [getX(), getY(), getZ(), true];
					if(pos2[3] == null) pos2 = [getX(), getY(), getZ(), false];
					rule = true;
					if(menuCanUpdate) updateMenu(type);
				});
				layout.addView(button9);
				
				button13 = getStyledButton("menu");
				button13.setText("Координаты");
				button13.setOnClickListener(function(viewarg) {
					Game.message("x=" + getX() + ", y=" + getY() + ", z=" + getZ());
				});
				layout.addView(button13);
				
				text4 = getStyledText("group");
				text4.setText("Буфер");
				layout.addView(text4);
				
				button5 = getStyledButton("menu");
				button5.setText("Копировать");
				button5.setOnClickListener(function(viewarg) {
					start();
					functionNumber = 2;
					blocks = [];
				});
				layout.addView(button5);
				
				button32 = getStyledButton("menu");
				button32.setText("Вырезать");
				button32.setOnClickListener(function(viewarg) {
					start();
					functionNumber = 6;
					blocks = [];
				});
				layout.addView(button32);
				
				button6 = getStyledButton("menu");
				button6.setText("Вставить");
				button6.setOnClickListener(function(viewarg) {
					start();
					functionNumber = 3;
				});
				layout.addView(button6);
				
				button19 = getStyledButton("menu");
				button19.setText("Загрузить");
				button19.setOnClickListener(function(viewarg) {
					loadDialog(type);
				});
				layout.addView(button19);
				
				button18 = getStyledButton("menu");
				button18.setText("Сохранить");
				button18.setOnClickListener(function(viewarg) {
					saveDialog(type);
				});
				layout.addView(button18);
				
				text5 = getStyledText("group");
				text5.setText("Управление");
				layout.addView(text5);
				
				button4 = getStyledButton("menu");
				button4.setText("Вернуть");
				button4.setOnClickListener(function(viewarg) {
					if(setsovle[0] == false) {
						pos1[3] = true;
						pos2[3] = true;
					} else {
						setsovle[1] = true;
					}
					if(menuCanUpdate) updateMenu(type);
				});
				layout.addView(button4);
				
				button12 = getStyledButton("menu");
				button12.setText("Сбросить");
				button12.setOnClickListener(function(viewarg) {
					removeMenu();
					rule = false;
					stop();
					setsovle[1] = false;
				});
				layout.addView(button12);
				
				button16 = getStyledButton("menu");
				button16.setText("Настройки");
				button16.setOnClickListener(function(viewarg) {
					removeMenu();
					createMenu(1);
				});
				layout.addView(button16);
				
				button17 = getStyledButton("menu");
				button17.setText("Завершить");
				button17.setOnClickListener(function(viewarg) {
					rover = false;
					removeMenu();
				});
				layout.addView(button17);
			} else {
				text6 = getStyledText("group");
				text6.setText("Выполнение");
				layout.addView(text6);
				
				button14 = getStyledButton("menu");
				button14.setText("Продолжить");
				button14.setOnClickListener(function(viewarg) {
					removeMenu();
					createStop();
					sovleGoFunctions = true;
				});
				layout.addView(button14);
				
				button15 = getStyledButton("menu");
				button15.setText("Завершить");
				button15.setOnClickListener(function(viewarg) { 
					sovleGoFunctions = true;
					removeMenu();
					stop();
				});
				layout.addView(button15);
				
				text10 = getStyledText("group");
				text10.setText("Управление");
				layout.addView(text10);
				
				button29 = getStyledButton("menu");
				button29.setText("Настройки");
				button29.setOnClickListener(function(viewarg) {
					removeMenu();
					createMenu(1);
				});
				layout.addView(button29);
			}
		} else if(type == 1) {
			text7 = getStyledText("group");
			text7.setText("Настройки");
			layout.addView(text7);
			
			goned0 = true;
			button20 = getStyledButton("menu");
			button20.setText("Скорость");
			button20.setOnClickListener(function(viewarg) {
				if(goned0) layout0.setVisibility(Ui.visibility.visible);
				else layout0.setVisibility(Ui.visibility.gone);
				updateGran = !updateGran;
				goned0 = !goned0;
			});
			layout.addView(button20);
			
			layout0 = getStyledLayout("setting");
			layout0.setOrientation(Ui.orientate.vertical);
			layout0.setVisibility(Ui.visibility.gone);
			layout0.setGravity(Ui.gravity.center);
			layout.addView(layout0);
			
			text14 = getStyledText();
			text14.setGravity(Ui.gravity.center);
			text14.setPadding(0, 25, 0, 0);
			text14.setTextSize(10);
			layout0.addView(text14);
			
			layout3 = getStyledLayout();
			layout0.addView(layout3);
			
			button25 = getStyledButton("transparent");
			button25.setText("-"); 
			button25.setTextSize(15);
			button25.setOnTouchListener(new android.view.View.OnTouchListener({
				onTouch: function(view, event) {
					if(event.getAction() == 0) {
						if(gran > 1) {
							activeM = 20;
			 				gran--;
						}
					}
					
					if(event.getAction() == 1) {
						activeM = 0;
					}
					return true;
				}
			}));
			layout3.addView(button25);
			
			button27 = getStyledButton("transparent");
			button27.setText("+"); 
			button27.setTextSize(15);
			button27.setOnTouchListener(new android.view.View.OnTouchListener({
				onTouch: function(view, event) {
					if(event.getAction() == 0) {
						if(gran < 500) {
							activeP = 20;
							gran++;
						}
					}
					
					if(event.getAction() == 1) {
						activeP = 0;
					}
					return true;
				}
			}));
			layout3.addView(button27);
			
			goned1 = true;
			button21 = getStyledButton("menu");
			button21.setText("Прозрачность");
			button21.setOnClickListener(function(viewarg) {
				if(goned1) layout4.setVisibility(Ui.visibility.visible);
				else layout4.setVisibility(Ui.visibility.gone);
				goned1 = !goned1;
			});
			layout.addView(button21);
			
			layout4 = getStyledLayout("setting");
			layout4.setOrientation(Ui.orientate.vertical);
			layout4.setVisibility(Ui.visibility.gone);
			layout4.setGravity(Ui.gravity.center);
			layout.addView(layout4);
			
			seek0 = new android.widget.SeekBar(context);
			seek0.setMax(9);
			seek0.setProgress(alpha * 10 - 1);
			seek0.setOnSeekBarChangeListener(new android.widget.SeekBar.OnSeekBarChangeListener(){
				onProgressChanged: function() {
					alpha = 0.1 + seek0.getProgress() / 10;
					CurrentMenuLayout.setAlpha(alpha);
				}
			});
			layout4.addView(seek0);
			
			goned2 = true;
			button30 = getStyledButton("menu");
			button30.setText("Переход");
			button30.setOnClickListener(function(viewarg) {
				if(goned2) layout5.setVisibility(Ui.visibility.visible);
				else layout5.setVisibility(Ui.visibility.gone);
				goned2 = !goned2;
			});
			layout.addView(button30);
			
			layout5 = getStyledLayout("setting");
			layout5.setOrientation(Ui.orientate.vertical);
			layout5.setVisibility(Ui.visibility.gone);
			layout5.setGravity(Ui.gravity.center);
			layout.addView(layout5);
			
			group0 = new android.widget.RadioGroup(context);
			group0.setOrientation(Ui.orientate.vertical);
			layout5.addView(group0);
			
			radio0 = getStyledRadio("setting");
			radio0.setText("Долгота > Высота");
			group0.addView(radio0);
			
			radio1 = getStyledRadio("setting");
			radio1.setText("Ширина > Высота");
			group0.addView(radio1);
			
			radio2 = getStyledRadio("setting");
			radio2.setText("Ширина > Долгота");
			group0.addView(radio2);
			
			group0.check(radio0.getId() + build);
			group0.setOnCheckedChangeListener(function(group, item) {
				build = item - radio0.getId();
			});
			
			goned3 = true;
			button31 = getStyledButton("menu");
			button31.setText("Отладка");
			button31.setOnClickListener(function(viewarg) {
				if(goned3) layout6.setVisibility(Ui.visibility.visible);
				else layout6.setVisibility(Ui.visibility.gone);
				goned3 = !goned3;
			});
			layout.addView(button31);
			
			layout6 = getStyledLayout("setting");
			layout6.setOrientation(Ui.orientate.vertical);
			layout6.setVisibility(Ui.visibility.gone);
			layout6.setGravity(Ui.gravity.center);
			layout.addView(layout6);
			
			check0 = getStyledCheck("setting");
			check0.setText("Не обновлять меню");
			check0.setChecked(!menuCanUpdate);
			check0.setOnCheckedChangeListener(function(group, bool) {
				menuCanUpdate = !bool;
				if(!bool) updateMenu(type);
			});
			layout6.addView(check0);
			
			check1 = getStyledCheck("setting");
			check1.setText("Кнопка координат");
			check1.setChecked(coordsButtonShow);
			check1.setOnCheckedChangeListener(function(group, bool) {
				coordsButtonShow = bool;
				if(bool) updateMenu(type);
			});
			layout6.addView(check1);
			
			check2 = getStyledCheck("setting");
			check2.setText("Вставлять воздух");
			check2.setChecked(parseAir);
			check2.setOnCheckedChangeListener(function(group, bool) {
				parseAir = bool;
			});
			layout6.addView(check2);
			
			check3 = getStyledCheck("setting");
			check3.setText("Отображение локации");
			check3.setChecked(locationInfo);
			check3.setOnCheckedChangeListener(function(group, bool) {
				locationInfo = bool;
			});
			layout6.addView(check3);
			
			text9 = getStyledText("group");
			text9.setText("Сообщество");
			layout.addView(text9);
			
			button22 = getStyledButton("menu");
			button22.setText("Информация");
			button22.setOnClickListener(function(viewarg) {
				showDialog();
			});
			layout.addView(button22);
		}
		
		debug = getStyledText("debug");
		debug.setText(this.version + "." + this.date + ", build=" + this.type + ", api=" + this.code);
		layout.addView(debug);
		
		if(menuCanUpdate) updateMenu(type);
		
		CurrentMenuWindow = new android.widget.PopupWindow(CurrentMenuLayout, Ui.display.width * menuWidth, Ui.params.match);
		CurrentMenuWindow.showAtLocation(context.getWindow().getDecorView(), android.view.Gravity.RIGHT | android.view.Gravity.TOP, 0, 0);
	});
}

function updateMenu(type) {
	runAsGUI(function() {
		if(this.CurrentMenuLayout) {
			if(type == 0) {
				if(pos1[3] == false && pos2[3] == false && !setsovle[1]) {
					button4.setVisibility(Ui.visibility.visible);
				} else {
					button4.setVisibility(Ui.visibility.gone);
				}
				
				if(pos1[3] == true && pos2[3] == false && !setsovle[1]) {
					button2.setVisibility(Ui.visibility.visible);
				} else {
					button2.setVisibility(Ui.visibility.gone);
				}
				
				if(pos1[3] && pos2[3] && !setsovle[1]) {
					text2.setVisibility(Ui.visibility.visible);
					button3.setVisibility(Ui.visibility.visible);
					button7.setVisibility(Ui.visibility.visible);
					button8.setVisibility(Ui.visibility.visible);
					button5.setVisibility(Ui.visibility.visible);
					button32.setVisibility(Ui.visibility.visible);
					button2.setVisibility(Ui.visibility.visible);
				} else {
					text2.setVisibility(Ui.visibility.gone);
					button3.setVisibility(Ui.visibility.gone);
					button7.setVisibility(Ui.visibility.gone);
					button8.setVisibility(Ui.visibility.gone);
					button5.setVisibility(Ui.visibility.gone);
					button32.setVisibility(Ui.visibility.gone);
				}
				
				var count = getProjects().items.length;
				
				if((pos1[3] && pos2[3]) || setsovle[1] || count > 0) {
					text4.setVisibility(Ui.visibility.visible);
				} else {
					text4.setVisibility(Ui.visibility.gone);
				}
				
				if(count > 0) {
					button19.setVisibility(Ui.visibility.visible);
				} else {
					button19.setVisibility(Ui.visibility.gone);
				}
				
				if(setsovle[1]) {
					button6.setVisibility(Ui.visibility.visible);
					button18.setVisibility(Ui.visibility.visible);
				} else {
					button6.setVisibility(Ui.visibility.gone);
					button18.setVisibility(Ui.visibility.gone);
				}
				
				if(rule) {
					button1.setVisibility(Ui.visibility.gone);
					text8.setVisibility(Ui.visibility.visible);
					button9.setVisibility(Ui.visibility.gone);
					button10.setVisibility(Ui.visibility.visible);
				} else {
					button1.setVisibility(Ui.visibility.visible);
					text8.setVisibility(Ui.visibility.gone);
					button9.setVisibility(Ui.visibility.visible);
					button10.setVisibility(Ui.visibility.gone);
				}
				
				if(coordsButtonShow) {
					button13.setVisibility(Ui.visibility.visible);
				} else {
					button13.setVisibility(Ui.visibility.gone);
				}
			} else if(type == 1) {
				if(functionNumber == 0) {
					button30.setVisibility(Ui.visibility.visible);
				} else {
					button30.setVisibility(Ui.visibility.gone);
				}
				
				if(this.type == "develop") {
					button31.setVisibility(Ui.visibility.visible);
				} else {
					button31.setVisibility(Ui.visibility.gone);
				}
			}
			
			if(this.type == "develop") {
				debug.setVisibility(Ui.visibility.visible);
			} else {
				debug.setVisibility(Ui.visibility.gone);
			}
		}
	});
}

function createButton() {
	runAsGUI(function() {
		CurrentButtonLayout = getStyledLayout("menu");
		CurrentButtonLayout.setOrientation(Ui.orientate.vertical);
		CurrentButtonLayout.setAlpha(alpha);
		
		button0 = getStyledButton("menu");
		button0.setText("Меню"); 
		button0.setTextSize(20);
		button0.setOnClickListener(function(viewarg) {
			createMenu(0);
			removeButton();
		});
		button0.setOnLongClickListener(function(viewarg) {
			var edit = new android.widget.EditText(context);
			lastCode && edit.setText(lastCode);
			edit.setHint("// ваш код");
			edit.setTextColor(Ui.color.black);
			edit.setHintTextColor(Ui.color.darkGray);
			edit.setBackgroundDrawable(null);
			
			var builder = new android.app.AlertDialog.Builder(context);
			builder.setTitle("Введите необходимый код");
			builder.setPositiveButton("Запуск", function() {
				try {
					lastCode = edit.getText().toString();
					eval("" + lastCode);
				} catch(e) {
					showHint(e.message);
				}
			});
			builder.setNegativeButton("Отмена", null);
			builder.setView(edit);
			
			runAsGUI(function() {
				var alert = builder.create();
				alert.show();
			});
		});
		CurrentButtonLayout.addView(button0);
		
		if(locationInfo) {
			text17 = getStyledText();
			text17.setGravity(Ui.gravity.center);
			text17.setPadding(5, 5, 5, 0);
			text17.setTextSize,(14);
			CurrentButtonLayout.addView(text17);
			
			text18 = getStyledText();
			text18.setGravity(Ui.gravity.center);
			text18.setPadding(5, 0, 5, 5);
			text18.setTextSize(14);
			CurrentButtonLayout.addView(text18);
		}
		
		CurrentButtonWindow = new android.widget.PopupWindow(CurrentButtonLayout, Ui.params.wrap, Ui.params.wrap);
		CurrentButtonWindow.showAtLocation(context.getWindow().getDecorView(), android.view.Gravity.RIGHT | android.view.Gravity.TOP, 0, 0);
	});
}

function createStop() {
	runAsGUI(function() {
		CurrentStopLayout = getStyledLayout("menu");
		CurrentStopLayout.setOrientation(Ui.orientate.vertical);
		CurrentStopLayout.setAlpha(alpha);
		
		button24 = getStyledButton("menu");
		button24.setText("Отмена"); 
		button24.setTextSize(20);
		button24.setOnClickListener(function(viewarg) {
			sovleGoFunctions = false;
			removeStop();
			createMenu(0);
		});
		CurrentStopLayout.addView(button24);
		
		text15 = getStyledText();
		text15.setGravity(Ui.gravity.center);
		text15.setPadding(5, 5, 5, 0);
		text15.setTextSize,(14);
		CurrentStopLayout.addView(text15);
		
		text16 = getStyledText();
		text16.setGravity(Ui.gravity.center);
		text16.setPadding(5, 0, 5, 5);
		text16.setTextSize(14);
		CurrentStopLayout.addView(text16);
		
		updateStop();
		
		CurrentStopWindow = new android.widget.PopupWindow(CurrentStopLayout, Ui.getX(360), Ui.params.wrap);
		CurrentStopWindow.showAtLocation(context.getWindow().getDecorView(), android.view.Gravity.RIGHT | android.view.Gravity.TOP, 0, 0);
	});
}

function updateStop() {
	runAsGUI(function() {
		text15.setText(formatInt(koll_current) + "/" + formatInt(koll_total));
		text16.setText(Math.floor(koll_current / koll_total * 1000) / 10 + "%");
	});
}

function updateButton() {
	runAsGUI(function() {
		var position = Player.getPosition(), angle = Entity.getLookAngle(Player.get());
		for(var i in angle) if(typeof angle[i] == "number") angle[i] = Math.round(angle[i] * 100) / 100;
		for(var i in position) if(typeof position[i] == "number") position[i] = Math.round(position[i] * 10) / 10;
		text17.setText("x: " + position.x + ", y: " + position.y + ", z: " + position.z);
		text18.setText("yaw: " + angle.yaw + ", pitch: " + angle.pitch);
	});
}

function updateSpeed() {
	runAsGUI(function() {
		text14.setText(gran * 20 + " блоков/сек.");
	});
}

function showDialog() {
	runAsGUI(function() {
		var dialog = new android.app.AlertDialog.Builder(context, 16974122); 
		dialog.setTitle("Setting");
		dialog.setMessage(android.text.Html.fromHtml("Мод позволяет полномастштабно управлять миром, "
			+ "строить, заливать, заменять, копировать блоки и многое другое. Строительство "
			+ "происходит в фоне, вы можете создавать свои шедевры прямо во время процесса. "
			+ "Используйте мод для любых целей, ведь главное - ваша фантазия!"
			+ "<br/><br/>Участники проекта:"
			+ "<br/><a href=\"vk.com/id268478382\">Макс Красавин</a> - главный разработчик"
			+ "<br/><a href=\"vk.com/id305567723\">Дмитрий Медведев</a> - автор идеи + основа"
			+ "<br/><br/>Важные ссылки:"
			+ "<br/><a href=\"vk.com/club148880110\">Группа</a> - новости, помощь и документация")); 
		dialog.setPositiveButton("Выход", function() {});
		dialog.create().show();
	});
}

function saveDialog(type) {
	runAsGUI(function() {
		var file = getNextProject();
		var dialog = new android.app.AlertDialog.Builder(context, 16974122); 
		dialog.setTitle("Сохранение");
		dialog.setMessage("Файл будет сохранен как " + file.getName().replace(".setp", "") + ", продолжить?");
		dialog.setPositiveButton("ОК", function() {
			try {
				saveAsProject(file);
				if(menuCanUpdate) updateMenu(type);
				showHint("Сохранено");
			} catch(e) {
				showHint("Временно не доступно");
			}
		});
		dialog.setNegativeButton("Выход", function() {});
		dialog.create().show();
	});
}

function loadDialog(type) {
	runAsGUI(function() {
		var list = getProjects();
		var dialog = new android.app.AlertDialog.Builder(context, 16974122); 
		dialog.setTitle("Загрузка");
		dialog.setItems(list.items, function(d, i) {
			try {
				loadFromProject(list.files[i]);
				setsovle = [true, true];
				if(menuCanUpdate) updateMenu(type);
				showHint("Загружено");
			} catch(e) {
				showHint("Файл поврежден");
			}
		});
		dialog.setNegativeButton("Выход", function() {});
		dialog.create().show();
	});
}

function removeButton() {
	runAsGUI(function() {
		if(this.CurrentButtonWindow) {
			CurrentButtonWindow.dismiss();
			CurrentButtonWindow = null;
		}
	});
}

function removeMenu() {
	runAsGUI(function() {
		if(this.CurrentMenuWindow) {
			CurrentMenuWindow.dismiss();
			CurrentMenuWindow = null;
		}
	});
}

function removeStop() {
	runAsGUI(function() {
		if(this.CurrentStopWindow) {
			CurrentStopWindow.dismiss();
			CurrentStopWindow = null;
		}
	});
}

function removeSetting() {
	runAsGUI(function() {
		if(this.CurrentSettingWindow) {
			updateGran = false;
			ModPE.showTipMessage(" ");
			CurrentSettingWindow.dismiss();
			CurrentSettingWindow = null;
		}
	});
}




/*                   *
 *   HOOKS & LOGIC   *
 *                   */

function formatInt(number) {
	if(number < 1000) return number;
	else if(number >= 1000000) return Math.floor(number / 1000000) + Math.floor(number % 1000000 / 100000) + "M";
	else if(number >= 100000) return Math.floor(number / 1000) + "K";
	else if(number >= 1000) return Math.floor(number / 1000) + "." + Math.floor(number % 1000 / 100) + "K";
}

function start() {
	var carried = Player.getCarriedItem();
	idLocal = carried.id;
	dataLocal = carried.data;
	koll_current = 0;
	tick = 0;
	
	xxa = 0;
	yya = 0;
	zza = 0;
	
	removeMenu();
	removeSetting();
	createStop();
}

function stop(not_show) {
	if(pos1[3] != null && pos2[3] != null) {
		pos1[3] = rule;
		pos2[3] = false;
	}
	
	if(functionNumber !== 5) replace = false;
	functionNumber = 0;
	removeStop();
	
	if(!not_show) {
		createButton();
	}
}

function loadFromProject(file) {
	eval("var parsed = " + Files.read(file));
	koll_total = parsed.sizes[0];
	xkol = parsed.sizes[1];
	ykol = parsed.sizes[2];
	zkol = parsed.sizes[3];
	blocks = parsed.blocks;
	build = parsed.type;
}

function saveAsProject(file) {
	var obj = JSON.stringify({
		type: build,
		sizes: [koll_total, xkol, ykol, zkol],
		blocks: blocks
	});
	
	Files.write(file, obj);
}

function getProjects() {
	var file = new java.io.File(Dirs.external + Dirs.data),
		list = file.listFiles(), files = [], projects = [];
	
	for(var i = 0; i < list.length; i++) {
		var name = list[i].getName();
		if(name.endsWith(".setp")) {
			files.push(list[i]);
			projects.push(name.replace(".setp", ""));
		}
	}
	
	return {
		items: projects,
		files: files
	};
}

function getNextProject() {
	for(var i = 1; ; i++) {
		var file = new java.io.File(Dirs.external + Dirs.data, "build_" + i + ".setp");
		if(!file.exists()) return file;
	}
}

Callback.addCallback("tick", function() {
	if(leaved) {
		leaved = false;
		if(pos1 == null) {
			pos1 = [getX(), getY(), getZ(), false];
			pos2 = pos1;
			updata();
		}
		
		updateSettings();
		if(rover) createButton();
	}
	if(rover) {
		if(updateGran) {
			updateSpeed();
			if(activeM > 1) activeM--;
			if(activeM == 1 && gran > 1) gran--;
			if(activeP > 1) activeP--;
			if(activeP == 1 && gran < 500) gran++;
		}
		
		if(pos1[3] == true && pos2[3] == false) {
			pos2 = [getX(), getY(), getZ(), false];
			particle();
		}
		
		if(pos1[3] == false && pos2[3] == true) {
			pos1 = [getX(), getY(), getZ(), false];
			particle();
		}
		
		if((pos1[3] == true && pos2[3] == true) || setsovle[1] == true) {
			particle();
		}
		
		if(rule == true) {
			particle();
			if(this.tick > 0) tick--;
			else {
				Game.tipMessage("§ax=" + xkol + ", y=" + ykol + ", z=" + zkol);
				tick = 5;
			}
		}
		
		if(functionNumber != 0) {   
			functions();
			updateStop();
		} else if(locationInfo) updateButton();
	}
});

function functions() {
	if(sovleGoFunctions) {
		for(var a = 0; a < gran; a++) {
			xa = xxa + x1;
			ya = yya + y1;
			za = zza + z1;
			koll_current++;
			
			if(functionNumber == 1) {
				World.setBlock(xa, ya, za, idLocal, dataLocal);
				if(koll_current >= koll_total) {
					stop();
					showHint("Заполнено " + koll_current + " блоков");
				}
			}

			if(functionNumber == 2) {
				var current = koll_current - 1;
				blocks[current * 2] = World.getBlockID(xa, ya, za);
				blocks[current * 2 + 1] = World.getBlockData(xa, ya, za);
				
				if(koll_current >= koll_total) {
					stop();
					showHint("Скопировано " + koll_total + " блоков");
					setsovle = [true, true];
				}
			}

			if(functionNumber == 3) {
				var current = koll_current - 1,
					pasteId = blocks[current * 2],
					pasteData = blocks[current * 2 + 1];
				
				if(pasteData) World.setBlock(xa, ya, za, pasteId || 0, pasteData);
				else if(pasteId) World.setBlock(xa, ya, za, pasteId);
				else if(parseAir) World.setBlock(xa, ya, za, 0);
				
				if(koll_current >= koll_total) {
					stop();
					setsovle[1] = false;
					showHint("Вставлено " + koll_total + " блоков");
				}
			}

			if(functionNumber == 4) {
				if(World.getBlockID(xa, ya, za) == 0) {
					World.setBlock(xa, ya, za, idLocal, dataLocal);
					koll_set++;
				}
				
				if(koll_current >= koll_total) {
					stop();
					showHint("Сканировано " + koll_total + " блоков, из них залито: " + koll_set);
				}
			}
			
			if(functionNumber == 5) {
				if(World.getBlockID(xa, ya, za) == id && World.getBlockData(xa, ya, za) == data) {
					World.setBlock(xa, ya, za, idLocal, dataLocal);
					koll_set++;
				}
				
				if(koll_current >= koll_total) {
					stop();
					showHint("Сканировано " + koll_total + " блоков, из них заменено: " + koll_set);
				}
			}
			
			if(functionNumber == 6) {
				var current = koll_current - 1;
				blocks[current * 2] = World.getBlockID(xa, ya, za);
				blocks[current * 2 + 1] = World.getBlockData(xa, ya, za);
				
				World.setBlock(xa, ya, za, 0);
				if(koll_current >= koll_total) {
					stop();
					showHint("Вырезано " + koll_total + " блоков");
					setsovle = [true, true];
				}
			}
			
			if(build == 0) {
				if(zza < zkol) {
					zza++;
				} else {
					zza = 0;
					if(yya < ykol) {
						yya++;
					} else {
						yya = 0;
						if(xxa < xkol) {
							xxa++;
						} else {
							xxa = 0;
						}
					}
				}
			} else if(build == 1) {
				if(xxa < xkol) {
					xxa++;
				} else {
					xxa = 0;
					if(yya < ykol) {
						yya++;
					} else {
						yya = 0;
						if(zza < zkol) {
							zza++;
						} else {
							zza = 0;
						}
					}
				}
			} else if(build == 2) {
				if(xxa < xkol) {
					xxa++;
				} else {
					xxa = 0;
					if(zza < zkol) {
						zza++;
					} else {
						zza = 0;
						if(yya < ykol) {
							yya++;
						} else {
							yya = 0;
						}
					}
				}
			}
		}
	}
}

function particle() {
	if((!pos1[3] || !pos2[3]) && setsovle[1] == false) {
		updata();
	}
	
	if(setsovle[1] == true && functionNumber != 3) {
		x1 = getX();
		y1 = getY();
		z1 = getZ();
	}
	
	if(ab < xkol) {
		ab++;
	} else {
		ab = 0;
	}
	
	if(bc < ykol) {
		bc++;
	} else {
		bc = 0;
	}
	
	if(cd < zkol) {
		cd++;
	} else {
		cd = 0;
	}
	
	Particles.addParticle(x1 + 0.5 + ab, y1 + 0.5, z1 + 0.5, Native.ParticleType.flame, 0, 0, 0, 2);
	Particles.addParticle(x1 + 0.5 + ab, y1 + 0.5 + ykol, z1 + 0.5, Native.ParticleType.flame, 0, 0, 0, 2);
	Particles.addParticle(x1 + 0.5 + ab, y1 + 0.5, z1 + 0.5 + zkol, Native.ParticleType.flame, 0, 0, 0, 2);
	Particles.addParticle(x1 + 0.5 + ab, y1 + 0.5 + ykol, z1 + 0.5 + zkol, Native.ParticleType.flame, 0, 0, 0, 2);
	
	Particles.addParticle(x1 + 0.5, y1 + 0.5 + bc, z1 + 0.5, Native.ParticleType.flame, 0, 0, 0, 2);
	Particles.addParticle(x1 + 0.5 + xkol, y1 + 0.5 + bc, z1 + 0.5, Native.ParticleType.flame, 0, 0, 0, 2);
	Particles.addParticle(x1 + 0.5, y1 + 0.5 + bc, z1 + 0.5 + zkol, Native.ParticleType.flame, 0, 0, 0, 2);
	Particles.addParticle(x1 + 0.5 + xkol, y1 + 0.5 + bc, z1 + 0.5 + zkol, Native.ParticleType.flame, 0, 0, 0, 2);
	
	Particles.addParticle(x1 + 0.5, y1 + 0.5, z1 + 0.5 + cd, Native.ParticleType.flame, 0, 0, 0, 2);
	Particles.addParticle(x1 + 0.5 + xkol, y1 + 0.5, z1 + 0.5 + cd, Native.ParticleType.flame, 0, 0, 0, 2);
	Particles.addParticle(x1 + 0.5, y1 + 0.5 + ykol, z1 + 0.5 + cd, Native.ParticleType.flame, 0, 0, 0, 2);
	Particles.addParticle(x1 + 0.5 + xkol, y1 + 0.5 + ykol, z1 + 0.5 + cd, Native.ParticleType.flame, 0, 0, 0, 2);
}

function updateSettings() {
	gran = 20;
	alpha = 1;
	build = 0;
}

function updata() {
	x1 = Math.min(pos1[0], pos2[0]);
	y1 = Math.min(pos1[1], pos2[1]);
	z1 = Math.min(pos1[2], pos2[2]);
	
	x2 = Math.max(pos2[0], pos1[0]);
	y2 = Math.max(pos2[1], pos1[1]);
	z2 = Math.max(pos2[2], pos1[2]);
	
	xkol = x2 - x1;
	ykol = y2 - y1;
	zkol = z2 - z1;
	
	koll_total = (xkol + 1) * (ykol + 1) * (zkol + 1);
}

function getX() {
	var position = Player.getPosition();
	return Math.floor(position.x);
}

function getY() {
	var position = Player.getPosition();
	return Math.floor(position.y - 1);
}

function getZ() {
	var position = Player.getPosition();
	return Math.floor(position.z);
}

Callback.addCallback("ItemUse", function(coords, item, block) {
	if(functionNumber == 0 && pos1[3] && pos2[3]) {
		id = block.id;
		data = block.data;
		replace = true;
		if(menuCanUpdate) updateMenu(type);
		showHint("Блок для замены выбран");
	}
});

Callback.addCallback("LevelLeft", function() {
	removeButton();
	removeMenu();
	removeStop();
	removeSetting();
	leaved = true;
});

Callback.addCallback("NativeCommand", function(cmd) {
	if(cmd == "start") {
		createButton();
		rover = true;
	}
});




/*                  *
 *   INITIALIZING   *
 *                  */

try {
	var file = new java.io.File(Dirs.external + Dirs.inner, "mc-typeface.ttf");
	typeface = android.graphics.Typeface.createFromFile(file);
} catch(e) {
	alert("шрифт не найден");
}

try {
	Files.createDir(Dirs.external + Dirs.data);
} catch(e) {
	alert("не удалось создать папку");
}
