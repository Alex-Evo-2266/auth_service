
export interface IUser{
	id: number | null
	name: string
	surname: string
	email: string
	level: number
	imageURL: string
}

export interface IOutUser{
	name: string
	surname: string
	email: string
	imageId?: number
}