import { BackgroundTypes, IBackground, Time } from "../interfaces/ImageInterfaces"
import { useCallback } from "react"
import { colors, IColors, night_colors } from "../interfaces/colorInterfaces";

export const useColor = ()=>{

	function LightenDarkenColor(col:string, amt:number) {
		var usePound = false;
		if (col[0] === "#") {
			col = col.slice(1);
			usePound = true;
		}
		var num = parseInt(col,16);
		var r = (num >> 16) + amt;
		if (r > 255) r = 255;
		else if  (r < 0) r = 0;
		var b = ((num >> 8) & 0x00FF) + amt;
		if (b > 255) b = 255;
		else if  (b < 0) b = 0;
		var g = (num & 0x0000FF) + amt;
		if (g > 255) g = 255;
		else if (g < 0) g = 0;
		return (usePound?"#":"") + (g | (b << 8) | (r << 16)).toString(16);
	}

	const textColor = (fon:string)=>{
		let color = "gray"
		if (fon[0] === "#") {
			fon = fon.slice(1);
		}
		var num = parseInt(fon,16);
		var r = (num >> 16);
		var b = ((num >> 8) & 0x00FF);
		var g = (num & 0x0000FF);
		if ((r < 200||g < 200||b < 200))
		{
		  color="#fff";
		}
		return color;
	}

	const glassColor = (fon:string)=>{
		if (fon.length === 4)
			return fon + "a"
		return fon + "aa"
	}
	function setColors(data:IColors) {
		console.log("set color")
		document.body.style.setProperty('--color-base',data.color1)
		document.body.style.setProperty('--color-normal',data.color2)
		document.body.style.setProperty('--color-active',data.active)
		
		document.body.style.setProperty('--color-base-v2',LightenDarkenColor(data.color1,25))
		document.body.style.setProperty('--color-normal-v2',LightenDarkenColor(data.color2,25))
		document.body.style.setProperty('--color-active-v2',LightenDarkenColor(data.active,25))

		document.body.style.setProperty('--color-base-glass',glassColor(data.color1))
		document.body.style.setProperty('--color-normal-glass',glassColor(data.color2))
		document.body.style.setProperty('--color-active-glass',glassColor(data.active))
	  
		document.body.style.setProperty('--text-base',textColor(data.color1))
		document.body.style.setProperty('--text-normal',textColor(data.color2))
		document.body.style.setProperty('--text-active',textColor(data.active))
	}

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
	
	const setTheme = (data:{colors:IColors, night_colors:IColors}|null)=>{
		if (getTime() === Time.NIGHT || getTime() === Time.EVENING)
		{
			if (!data)
				setColors(night_colors)
			else
				setColors(data.night_colors)
		}
		else{
			if (!data)
				setColors(colors)
			else
				setColors(data.colors)
		}
	}

	return { setTheme, setColors }
}