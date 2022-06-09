return function() {
	let unique = new UniqueWindow();
	unique.TYPE = "FragmentTestingWindow";
	/*
	for (let element in this) {
		tryoutSafety(function() {
			let next = this[element];
			if (typeof next != "function" || !next.prototype instanceof Fragment) {
				return;
			}
			let instance = new next();
			if (instance == null) {
				return;
			}
			let container = instance.getContainer();
			if (instance == null) {
				return;
			}
			unique.setFragment(instance);
		});
	}
	*/
	let frame = new ScrollFragment();
	
	frame.addElementFragment(new ThinButtonFragment().setText("Item 1"));
	frame.addElementFragment(new ThinButtonFragment().setText("Item 2").setBackground("popupSelectionSelected"));
	frame.addElementFragment(new ThinButtonFragment().setText("Item 3"));
	
	frame.addElementFragment(new SolidButtonFragment().setText("Item 1"));
	frame.addElementFragment(new SolidButtonFragment().setText("Item 2").setBackground("popupSelectionSelected"));
	frame.addElementFragment(new SolidButtonFragment().setText("Item 3"));
	
	frame.addElementFragment(new PropertyInputFragment());
	frame.addElementFragment(new PropertyInputFragment().setHint("value").setBackground("popupSelectionLocked"));
	frame.addElementFragment(new PropertyInputFragment().setText("0.0f").setHint("float"));
	
	let groupX = new AxisGroupFragment().setAxis("x");
	groupX.addElementFragment(new SliderFragment());
	groupX.addElementFragment(new SliderFragment().setValue(1));
	groupX.addElementFragment(new CounterFragment().setValue("gg"));
	groupX.addElementFragment(new SliderFragment().setModifiers([16, 32, 64]).setValue(1));
	frame.addElementFragment(groupX);
	
	let groupY = new AxisGroupFragment().setAxis("y (nope)");
	groupY.addElementFragment(new CounterFragment());
	groupY.addElementFragment(new CounterFragment().setValue(1));
	groupY.addElementFragment(new SliderFragment().setValue("gg"));
	groupY.addElementFragment(new CounterFragment().setModifiers([16, 32, 64]).setValue(1));
	frame.addElementFragment(groupY);
	
	frame.addElementFragment(new SliderFragment());
	frame.addElementFragment(new SliderFragment().setValue(1));
	frame.addElementFragment(new CounterFragment().setValue("gg"));
	frame.addElementFragment(new SliderFragment().setModifiers([16, 32, 64]).setValue(1));
	
	frame.addElementFragment(new CounterFragment());
	frame.addElementFragment(new CounterFragment().setValue(1));
	frame.addElementFragment(new SliderFragment().setValue("gg"));
	frame.addElementFragment(new CounterFragment().setModifiers([16, 32, 64]).setValue(1));
	
	let group = new AxisGroupFragment().setAxis("nope");
	group.addElementFragment(new SliderFragment());
	group.addElementFragment(new SolidButtonFragment().setText("Item 1"));
	group.addElementFragment(new SliderFragment().setValue(1));
	group.addElementFragment(new ThinButtonFragment().setText("Item 2").setBackground("popupSelectionQueued"));
	group.addElementFragment(new CounterFragment().setValue("gg"));
	group.addElementFragment(new SliderFragment().setModifiers([16, 32, 64]).setValue(1));
	group.addElementFragment(new SolidButtonFragment().setText("Item 3"));
	frame.addElementFragment(group);
	
	unique.setFragment(frame);
	unique.show();
};
