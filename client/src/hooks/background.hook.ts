import { BackgroundTypes, IBackground, Time } from "../interfaces/ImageInterfaces"
import defFon from '../img/fon-base.jpg'
import { useCallback } from "react"

const defaultBackground:IBackground = {
	url: defFon,
	type: BackgroundTypes.BASE,
	title: "base"
}

export const useBackgraund = ()=>{
	
	const getTime = useCallback(():Time=>{
		var Digital=new Date()
		var hours=Digital.getHours()
		if (hours>=5&&hours<11)
			return Time.MORNING
		if (hours>=12&&hours<17) 
			return Time.DAY
		if (hours>=17&&hours<22) 
			return Time.EVENING
		if (hours>=22||hours<5) 
			return Time.NIGHT
		return Time.DAY
	},[])

	const filterBackgrounds = useCallback((backgraunds:IBackground[], type:BackgroundTypes):IBackground | null=>{
		let cond = backgraunds.filter((item)=>item.type === type)
		if(cond && cond[0])
			return cond[0]
		return null
	},[])

	const convertTimetoBackgroundTypes = useCallback((time:Time):BackgroundTypes=>BackgroundTypes[time],[])

	const getBackground = useCallback((backgraunds:IBackground[], special:boolean)=>{
		let image:IBackground | null
		if (special)
		{
			image = filterBackgrounds(backgraunds, BackgroundTypes.BASE)
		}
		else{
			const time = getTime()
			image = filterBackgrounds(backgraunds, convertTimetoBackgroundTypes(time))
		}
		return image ?? defaultBackground
	},[getTime, filterBackgrounds, convertTimetoBackgroundTypes])

	const updateBackground = useCallback((backgraunds:IBackground[], special: boolean = false)=>{
		const image = getBackground(backgraunds, special)
		document.body.style.background = `url(${image.url})`
		document.body.style.backgroundSize = `cover`
		document.body.style.backgroundAttachment = `fixed`
	},[getBackground])

	return { getBackground, updateBackground }
}