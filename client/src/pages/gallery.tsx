import React,{useState,useEffect,useCallback} from 'react'
import {methods, useHttp} from '../hooks/http.hook'
import {ImagesInput} from '../components/inputImages'
import { useTypeSelector } from '../hooks/useTypeSelector'
import { useDispatch } from 'react-redux'
import { MenuTypesActions } from '../store/reducers/menuReducer'

interface IUrls{
	id: number
	title: string
	image: string
}

export const GalleryPage:React.FC = () => {
	const dispatch = useDispatch()
	const authData = useTypeSelector(state=>state.auth)
	const {request, error, clearError} = useHttp();
	const [urls,setUrls] = useState<IUrls[]>([])

	const getUrl = useCallback(async()=>{
		try {
			const data = await request(`/api/images`, methods.GET, null,{Authorization: `Bearer ${authData.token}`})
			setUrls(data)
		} catch (e) {
			console.error(e);
		}
	},[authData.token,request])

  const deleteImg = async (id:number)=>{
    await request(`/api/images/${id}`, methods.DELETE, null,{Authorization: `Bearer ${authData.token}`})
    await getUrl()
  }

  const ditail = (event:React.MouseEvent<HTMLDivElement>, item:IUrls)=>{
    console.log(item, event)
  }

	useEffect(()=>{
		getUrl()
	},[getUrl])

  useEffect(()=>{
    if (!error) return ;
    console.error(error)
    return ()=>{
      clearError();
    }
  },[error, clearError])

  useEffect(()=>{
    dispatch({type:MenuTypesActions.MENU_SET_NAME, payload:{title:"Galery"}})
  },[dispatch])

  return(
    <div className="gallery">
      <ImagesInput update={getUrl}/>
      <div className="galleryContent">
      {
        (urls&&urls[0])?
        urls.map((item,index)=>{
          return(
            <div key={index} className="imageBx" onClick={(event)=>ditail(event, item)}>
              <img src={item.image} alt={item.title} data-type="rootimg"/>
              <div className="preview-remove" onClick={()=>deleteImg(item.id)}>
              <i className="fas fa-times"></i>
              </div>
              <div className="preview-info"><span>{item.title}</span></div>
            </div>
          )
        }):null
      }
      </div>
    </div>
  )
}
