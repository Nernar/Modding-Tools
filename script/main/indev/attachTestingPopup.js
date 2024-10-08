const attachTestingPopup = function() {
	let unique = new UniqueWindow();
	unique.TYPE = "FragmentTestingWindow";
	unique.setFocusable(true);
	unique.setBackground("popup");

	let frame = new ScrollFragment();

	frame.addFragment(new CategoryTitleFragment().setText("Selection"));
	frame.addFragment(new ThinButtonFragment().setText("Item 1"));
	frame.addFragment(new ThinButtonFragment().setText("Item 2").setBackground("popupSelectionSelected"));
	frame.addFragment(new ThinButtonFragment().setText("Item 3"));

	frame.addFragment(new SolidButtonFragment().setText("Item 1"));
	frame.addFragment(new SolidButtonFragment().setText("Item 2").setBackground("popupSelectionSelected"));
	frame.addFragment(Fragment.parseJson({
		type: "categoryTitle",
		text: "Json category"
	}));
	frame.addFragment(Fragment.parseJson({
		text: "Item 3"
	}, null, "solidButton"));

	frame.addFragment(new PropertyInputFragment());
	frame.addFragment(new PropertyInputFragment().setHint("value").setBackground("popupSelectionLocked"));
	frame.addFragment(new ExplanatoryFragment().setText("Did you know that among wildlife, goats are considered the most intelligent animals? Their hooves allow them to climb the rocky slopes of the mountains without any problems. I don’t know how goats without hooves could repeat the same. Okay, I deceived you, but you read this fictitious fact, which means that you clearly have little interest or laziness. But you are not a goat."));
	frame.addFragment(new PropertyInputFragment().setText("0.0f").setHint("float"));

	let groupX = new AxisGroupFragment().setAxis("x");
	groupX.addFragment(new SliderFragment());
	groupX.addFragment(new SliderFragment().setValue(1));
	groupX.addFragment(new CounterFragment().setValue("gg"));
	groupX.addFragment(new SliderFragment().setModifiers([16, 32, 64]).setValue(1));
	frame.addFragment(groupX);

	let groupY = new AxisGroupFragment().setAxis("y (nope)");
	groupY.addFragment(new CounterFragment());
	groupY.addFragment(new CounterFragment().setValue(1));
	groupY.addFragment(new SliderFragment().setValue("gg"));
	groupY.addFragment(new CounterFragment().setModifiers([16, 32, 64]).setValue(1));
	frame.addFragment(groupY);

	frame.addFragment(new SliderFragment());
	frame.addFragment(new SliderFragment().setValue(1));
	frame.addFragment(new CounterFragment().setValue("gg"));
	frame.addFragment(new SliderFragment().setModifiers([16, 32, 64]).setValue(1));

	frame.addFragment(new CounterFragment());
	frame.addFragment(new CounterFragment().setValue(1));
	frame.addFragment(new SliderFragment().setValue("gg"));
	frame.addFragment(new CounterFragment().setModifiers([16, 32, 64]).setValue(1));

	frame.addFragment(new AngleCircleFragment());

	let group = new AxisGroupFragment().setAxis("nope");
	group.addFragment(new SliderFragment());
	group.addFragment(new SolidButtonFragment().setText("Item 1"));
	group.addFragment(new SliderFragment().setValue(1));
	group.addFragment(new ThinButtonFragment().setText("Item 2").setBackground("popupSelectionQueued"));
	group.addFragment(new CounterFragment().setValue("gg"));
	group.addFragment(new SliderFragment().setModifiers([16, 32, 64]).setValue(1));
	group.addFragment(new SolidButtonFragment().setText("Item 3"));
	frame.addFragment(group);

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
	groupDelta.addFragment(new SolidButtonFragment().setText("Hardcoded"));
	frame.addFragment(groupDelta);

	unique.setFragment(frame);
	unique.attach();
};
