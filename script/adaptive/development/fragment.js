return function() {
	let unique = new UniqueWindow();
	unique.TYPE = "FragmentTestingWindow";
	unique.setFocusable(true);
	
	let frame = new ScrollFragment();
	
	frame.addElementFragment(new CategoryTitleFragment().setText("Selection"));
	frame.addElementFragment(new ThinButtonFragment().setText("Item 1"));
	frame.addElementFragment(new ThinButtonFragment().setText("Item 2").setBackground("popupSelectionSelected"));
	frame.addElementFragment(new ThinButtonFragment().setText("Item 3"));
	
	frame.addElementFragment(new SolidButtonFragment().setText("Item 1"));
	frame.addElementFragment(new SolidButtonFragment().setText("Item 2").setBackground("popupSelectionSelected"));
	frame.addElementFragment(Fragment.parseJson({
		type: "categoryTitle",
		text: "Json category"
	}));
	frame.addElementFragment(Fragment.parseJson({
		text: "Item 3"
	}, null, "solidButton"));
	
	frame.addElementFragment(new PropertyInputFragment());
	frame.addElementFragment(new PropertyInputFragment().setHint("value").setBackground("popupSelectionLocked"));
	frame.addElementFragment(new ExplanatoryFragment().setText("Did you know that among wildlife, goats are considered the most intelligent animals? Their hooves allow them to climb the rocky slopes of the mountains without any problems. I don’t know how goats without hooves could repeat the same. Okay, I deceived you, but you read this fictitious fact, which means that you clearly have little interest or laziness. But you are not a goat."));
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
	
	let groupDelta = AxisGroupFragment.parseJson({
		background: "popupSelectionSelected",
		elements: [
			{
				type: "explanatory",
				text: "Explanatory text is not needed, but snippet needs to be tested."
			},
			{
				value: 66,
				background: "popupSelectionLocked"
			},
			{
				modifiers: [16, 64]
			}
		]
	});
	groupDelta.addElementFragment(new SolidButtonFragment().setText("Hardcoded"));
	frame.addElementFragment(groupDelta);
	
	unique.setFragment(frame);
	unique.show();
};
