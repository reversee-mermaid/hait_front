import { useCallback, useEffect, useRef, useState } from "react"
import { useHistory } from "react-router"

import { api } from '../utils/owner-api' 
import { setPreview } from '../utils/preview'

export default function InitialSetting() {
  const history = useHistory()
  const container = useRef()
  const [data, setData] = useState(null)
  const [formFields, setFormFields] = useState({
    file: '',
    location: '',
    contact: '',
    more_info: '',
    reset_pw: '',
  })

  useEffect(() => {
    api.getInitialInfo(({status, data}) => {
      if(status === 200) setData(data)
    })
  }, [])

  const onSubmit = useCallback((e) => {
    e.preventDefault()

    const formData = new FormData(e.target)
    formData.append('pk', data.pk)
    formData.append('owner_pk', data.owner_pk)

    api.initialSetting(formData, ({status}) => {
      if(status === 200) history.push("/owner")
    })
  })

  const fieldHandle = useCallback(({target}) => {
    if (target.name === 'file') {
      setPreview(container.current, target.files[0])
    }
    setFormFields({...formFields, [target.name]: target.value})
  })

  return (
    <main id="main">
      <section className="content content-initial flex-column">
        <h2 className="content-title">Welcome to {data && data.nm}!</h2>
        <small>서비스 시작 전 초기 설정이 필요합니다.</small>
        <form onSubmit={onSubmit}>
          <div ref={container} className="card card-circle"></div>
          
          <input type="file" name="file" accept="image/*"
            value={formFields.file} onChange={fieldHandle} />
          
          <input type="text" name="location" required placeholder="매장 주소"
            value={formFields.location} onChange={fieldHandle}/>
          
          <input type="tel" name="contact" required placeholder="매장 전화번호"
            value={formFields.contact} onChange={fieldHandle}/>
          
          <textarea name="more_info" placeholder="기타 매장 정보"
            value={formFields.more_info} onChange={fieldHandle}/>
          
          <input type="password" name="reset_pw" required placeholder="새 비밀번호"
             value={formFields.reset_pw} onChange={fieldHandle}/>

          <button className="btn">시작하기</button>
        </form>
      </section>
    </main>
  )
}