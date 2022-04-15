import React,{useState,useEffect,useCallback} from 'react'
import {methods, useHttp} from '../../hooks/http.hook'
import {ImagesInput} from '../../components/inputImages'
import { useTypeSelector } from '../../hooks/useTypeSelector'
import { useDispatch } from 'react-redux'
import { MenuTypesActions } from '../../store/reducers/menuReducer'
import { AlertType, AlertTypeAction } from '../../store/reducers/alertReducer'
import { DialogType, DialogTypeAction } from '../../store/reducers/dialogReducer'
import { useAlert } from '../../hooks/alert.hook'
import { IImage } from '../../interfaces/ImageInterfaces'
import { DetailImage } from './detailImage'
import { useUserConfig } from '../../hooks/userConfig.hook'

export const GalleryPage:React.FC = () => {
	const dispatch = useDispatch()
  const alert = useAlert()
	const authData = useTypeSelector(state=>state.auth)
	const {request, error, clearError} = useHttp();
	const [images,setImages] = useState<IImage[]>([])
  const [image, setImage] = useState<IImage | null | undefined>(null)
  const { updata } = useUserConfig()

	const getUrl = useCallback(async()=>{
		try {
			const data:IImage[] = await request(`/api/images`, methods.GET, null,{Authorization: `Bearer ${authData.token}`})
			setImages(data)
		} catch (e) {
			dispatch({type:AlertTypeAction.ALERT_SHOW, payload:{type:AlertType.ERROR, title: "fetch error", text:e}})
		}
	},[authData.token,request])

  const deleteImg = (id:number)=>{
    dispatch({type: DialogTypeAction.DIALOG_SHOW, payload:{type:DialogType.ALERT, title:"Delete image", text:"delete image?", callback:async()=>{
      await request(`/api/images/${id}`, methods.DELETE, null,{Authorization: `Bearer ${authData.token}`})
      await getUrl()
      updata()
    }}})
  }

  const ditail = (item:IImage)=>{
    setImage(item)
  }

  const closeDetail = ()=>setImage(null)

  const next = ()=>{
    if (image)
      setImage(images[images.indexOf(image) + 1])
	}

	const prev = ()=>{
		if (image)
      setImage(images[images.indexOf(image) - 1])
	}

	useEffect(()=>{
		getUrl()
	},[getUrl])

  useEffect(()=>{
    if (!error) return ;
			alert.show(AlertType.ERROR, "fetch error", error)
    return ()=>{
      clearError();
    }
  },[error, clearError])

  useEffect(()=>{
    dispatch({type:MenuTypesActions.MENU_SET_NAME, payload:{title:"Galery"}})
  },[dispatch])

  return(
    <>
    {
      (image)?
      <DetailImage image={image} next={next} prev={prev} hide={closeDetail}/>:
      null
    }
      <div className="gallery">
        <ImagesInput update={getUrl}/>
        <div className="galleryContent">
        {
          (images&&images[0])?
          images.map((item,index)=>{
            return(
              <div key={index} className="image-preview gallery-image">
                <img src={item.url} alt={item.title} data-type="rootimg" onClick={()=>ditail(item)}/>
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
    </>
  )
}
