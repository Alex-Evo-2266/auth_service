import React, {useEffect,useRef,useState} from 'react'
import { useDispatch } from 'react-redux';
import {methods, useHttp} from '../hooks/http.hook'
import { useTypeSelector } from '../hooks/useTypeSelector';
import { IAuthState } from '../interfaces/authInterfaces';
import { AlertType, AlertTypeAction } from '../store/reducers/alertReducer';

interface ImagesInputProps{
  update: ()=>void
}

export const ImagesInput:React.FC<ImagesInputProps> = ({update}) =>{
	const dataAuth:IAuthState = useTypeSelector(state=>state.auth)
  const {request, error, clearError} = useHttp();
  const inputRef = useRef<HTMLInputElement>(null)
  const dispatch = useDispatch()
  const imgConteiner = useRef<HTMLDivElement>(null)
  const [filesArr,setFiles] = useState<File[]>([])

  const byteToSize = (bytes:any)=>{
    const size = ["Bytes","KB","MB","GB","TB"]
    if(!bytes) return "0 Bytes"
    let i: number = parseInt(String(Math.floor(Math.log(bytes) / Math.log(1024))))
    return Math.round(bytes / Math.pow(1024,i)) + " " + size[i]
  }

  async function handleFiles(event:React.ChangeEvent<HTMLInputElement>){
    if (!event.target.files) return ;
    let files = Array.from(event.target.files)
    setFiles(files)
    let conteiner = imgConteiner.current
    if (!conteiner) return ;
    conteiner.innerHTML=""
    files.forEach(file => {
      if(!file.type.match('image')){
        return
      }
      const reader = new FileReader()

      reader.onload = ev =>{
        if (!conteiner) return ;
        let div = document.createElement('div');
        div.classList.add("image-preview")
        div.insertAdjacentHTML("afterbegin", `<div data-name=${file.name} class="preview-remove">&times</div>`)
        div.insertAdjacentHTML("afterbegin", `<div class="preview-info"><span>${file.name}</span><span>${byteToSize(file.size)}</span></div>`)
        div.insertAdjacentHTML("afterbegin", `<img src="${ev?.target?.result}" alt="${file.name}"/>`)
        conteiner.append(div)
      }

      reader.readAsDataURL(file)
    });
  }

  const imgClick = (event:any)=>{
    const name = event?.target?.dataset?.name
    if (!name) return;
    let files = filesArr.filter(file=>file.name!==name)
    setFiles(files)
    const block = imgConteiner?.current?.querySelector(`[data-name="${name}"]`)?.closest(".image-preview")
    if (!block) return;
    block.classList.add("removeing")
    setTimeout(function () {
      block.remove()
    }, 300);

  }

  const sendFile = async()=>{
    for (const file of filesArr) {
      var data = new FormData();
      data.append("file",file)
      data.append('name',file.name)
      const ret = await request(`/api/images/create`, methods.POST, data,{Authorization: `Bearer ${dataAuth.token}`},true)
      if(ret==="ok"){
        const block = imgConteiner?.current?.querySelector(`[data-name="${file.name}"]`)?.closest(".image-preview")
        if (!block) return;
        block.classList.add("removeing")
        setTimeout(function () {
          block.remove()
        }, 300);
      }
    }
    setFiles([])
    if(typeof(update)==="function"){
      setTimeout(function () {
        update()
      }, 200);
    }
  }

  useEffect(()=>{
    if (!error) return ;
			dispatch({type:AlertTypeAction.ALERT_SHOW, payload:{type:AlertType.ERROR, title: "fetch error", text:error}})
    return ()=>{
      clearError();
    }
  },[error, clearError, dispatch])

  const inputClick = ()=>{
    inputRef?.current?.click()
  }

  return(
    <div className="cartImageInput">
      <h2>Загрузить изображение</h2>
      <input ref={inputRef} multiple={true} type="file" id="fileElem" accept="image/*" onChange={handleFiles}/>
      <div ref={imgConteiner} className="fileList" onClick={imgClick}></div>
      <div className="btnConteiner">
      {
        (filesArr&&filesArr[0])?
        <button className="btn" onClick={sendFile}>загрузить</button>:
        null
      }
      <button style={{marginLeft: "10px"}} className="btn border" onClick={inputClick}>открыть</button>
      </div>
    </div>
  )
}
