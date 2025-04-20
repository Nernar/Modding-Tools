interface IDrawable<ABC = IDrawable<any>> {
	alpha?: CallableJsonProperty1<ABC, number>;
	alias?: CallableJsonProperty1<ABC, boolean>;
	mirrored?: CallableJsonProperty1<ABC, boolean>;
	interpolation?: CallableJsonProperty1<ABC, boolean>;
	tint?: CallableJsonProperty1<ABC, string | number>;
	mipmap?: CallableJsonProperty1<ABC, boolean>;
	filter?: CallableJsonProperty1<ABC, Nullable<android.graphics.ColorFilter>>;
	tile?: CallableJsonProperty1<ABC, android.graphics.Shader.TileMode | [android.graphics.Shader.TileMode, android.graphics.Shader.TileMode]>;
	gravity?: CallableJsonProperty1<ABC, number>;
	direction?: CallableJsonProperty1<ABC, number>;
	xfermode?: CallableJsonProperty1<ABC, Nullable<android.graphics.Xfermode>>;
	level?: CallableJsonProperty1<ABC, number>;
	state?: CallableJsonProperty1<ABC, number | number[]>;
	visible?: CallableJsonProperty1<ABC, boolean | [boolean, boolean]>;
}

interface ILayerDrawable<ABC = ILayerDrawable<any>> extends IDrawable<ABC> {
	layers?: CallableJsonProperty1<ABC, Nullable<IDrawableJson | IDrawableJson[]>>;
}

interface IClipDrawable<ABC = IClipDrawable<any>> extends IDrawable<ABC> {
	drawable?: CallableJsonProperty1<ABC, Nullable<IDrawableJson>>;
	location?: CallableJsonProperty1<ABC, number>;
	side?: CallableJsonProperty1<ABC, string | number>;
}

interface IColorDrawable<ABC = IColorDrawable<any>> extends IDrawable<ABC> {
	color?: CallableJsonProperty1<ABC, string | number>;
}

interface IBitmapDrawable<ABC = IBitmapDrawable<any>> extends IDrawable<ABC> {
	bitmap?: CallableJsonProperty1<ABC, Nullable<android.graphics.Bitmap | string>>;
	options?: CallableJsonProperty1<ABC, android.graphics.Bitmap.Config>;
	corrupted?: CallableJsonProperty1<ABC, android.graphics.Bitmap | string>;
}

type IAnimationDrawableFrame<ABC = IAnimationDrawable> = IDrawable<ABC> | {
	duration?: CallableJsonProperty1<IAnimationDrawable, number>;
};

interface IAnimationDrawable<ABC = IAnimationDrawable<any>> extends IDrawable<ABC> {
	frames?: CallableJsonProperty1<ABC, Nullable<IAnimationDrawableFrame | IAnimationDrawableFrame[]>>;
	duration?: CallableJsonProperty1<ABC, number>;
	startingWhenProcess?: CallableJsonProperty1<ABC, boolean>;
	stoppingWhenCompleted?: CallableJsonProperty1<ABC, boolean>;
	enterFadeDuration?: CallableJsonProperty1<ABC, number>;
	exitFadeDuration?: CallableJsonProperty1<ABC, number>;
	oneShot?: CallableJsonProperty1<ABC, boolean>;
}

type IDrawableJson = string | number
	| (IColorDrawable & { color: IColorDrawable["color"] })
	| (IBitmapDrawable & { bitmap: IBitmapDrawable["bitmap"] })
	| (ILayerDrawable & { layers: ILayerDrawable["layers"] })
	| (IAnimationDrawable & { frames: IAnimationDrawable["frames"] })
	| (IClipDrawable & (
		| { side: IClipDrawable["side"] }
		| { location: IClipDrawable["location"] }
		| {
			side: IClipDrawable["side"],
			location: IClipDrawable["location"]
		})
	);
