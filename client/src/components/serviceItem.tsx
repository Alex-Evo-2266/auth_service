import React from "react";
import { IService } from "../interfaces/services";

interface IProp{
	data: IService
}

export const ServiceItem:React.FC<IProp> = (props:IProp) =>{

	return(
		<>
			<h5>{props.data.title}</h5>
			<p>redirect_uris: {props.data.default_redirect_uri}</p>
		</>
	)
}