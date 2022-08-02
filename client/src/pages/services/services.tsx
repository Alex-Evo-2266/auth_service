import React, { useCallback, useEffect, useState } from "react";
import { Loading } from "../../components/loading";
import { ServiceItem } from "../../components/serviceItem";
import { useAlert } from "../../hooks/alert.hook";
import { methods, useHttp } from "../../hooks/http.hook";
import { useTypeSelector } from "../../hooks/useTypeSelector";
import { IAuthState } from "../../interfaces/authInterfaces";
import { IService } from "../../interfaces/services";
import { AlertType } from "../../store/reducers/alertReducer";
import { AddServicePage } from "./newServices";
import { ServicePage } from "./service";

export const ServicesPage:React.FC = () =>{
	const dataAuth:IAuthState = useTypeSelector(state=>state.auth)
	const { request, error, clearError, loading } = useHttp()
	const alert = useAlert()
	const [services, setServices] = useState<IService[]>([])
	const [createServiceVisible, setCreateServiceVisible] = useState<boolean>(false)
	const [service, setService] = useState<IService | null>(null)

	useEffect(()=>{
		if (error)
			alert.show(AlertType.ERROR, "fetch error", error)
		return ()=>{
	 		clearError();
		}
	},[error, clearError, alert])

	const getApps = useCallback(async () => {
		const data = await request("/api/app", methods.GET, null, {Authorization: `Bearer ${dataAuth.token}`})
		if (data)
		{
			setServices(data)
			console.log(service, data)
		}

	},[request, dataAuth.token, service])

	useEffect(()=>{
		getApps()
	},[getApps])

	const hide = ()=>{
		setCreateServiceVisible(false)
	}

	const show = ()=>{
		setCreateServiceVisible(true)
	}

	if (loading)
		return <Loading/>

	if (createServiceVisible)
		return <AddServicePage hide={hide} update={getApps}/>
	
	if (service)
		return <ServicePage data={service} hide={()=>setService(null)} update={getApps}/>
	
	return(
		<>
		<ul className="services-list">
			{
				services.map((item, index)=>(
					<li className="service-item-container" key={index} onClick={()=>setService(item)}>
						<ServiceItem data={item}/>
					</li>
					))
			}
		</ul>
		<div onClick={show} className="floating-btn">+</div>
		</>
	)
}