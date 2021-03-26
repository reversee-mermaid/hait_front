import { useCallback, useState } from "react"
import { useHistory } from "react-router"
import { Link } from "react-router-dom"

import { api } from '../utils/owner-api' 

export default function Login() {
  const [message, setMessage] = useState('')
  const [formFields, setFormFields] = useState({ email: '', pw: '' })

  const history = useHistory()

  const onSubmit = useCallback((e) => {
    e.preventDefault()

    api.login(formFields, ({status, message}) => {
      if(status === 200) {
        return history.push('/owner/main')
      }
      setMessage(message)
    })
  })

  const fieldHandle = useCallback((e) => {
    setFormFields({ ...formFields, [e.target.name]: e.target.value })
  })

  return (
    <main id="main">
      <section className="content content-login flex-column">
        <h2 className="content-title">사장님으로 로그인</h2>
        <p className="err-message">{message}</p>
        <form onSubmit={onSubmit}>
          <input type="email" name="email" placeholder="이메일"
            value={formFields.email} onChange={fieldHandle}/>
          <input type="password" name="pw" placeholder="비밀번호"
            value={formFields.pw} onChange={fieldHandle}/>
          <button className="btn">로그인</button>
        </form>
        <p className="small_link">
          아직 가게 등록을 하지 않으셨나요?
        <Link className="link" to="/home/application" target="_blank">
          가게등록
        </Link>
        </p>
      </section>
    </main>
  )
}