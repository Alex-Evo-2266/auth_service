export interface IImage{
	id: number
	title: string
	url: string
}

export enum BackgroundTypes {
	BASE = "BASE",
	MORNING = "MORNING",
	DAY = "DAY",
	EVENING = "EVENING",
	NIGHT = "NIGHT"
}

export interface IBackground{
	url: string
	type: BackgroundTypes
	title: string
}

export enum Time {
	MORNING = "MORNING",
	DAY = "DAY",
	EVENING = "EVENING",
	NIGHT = "NIGHT"
}