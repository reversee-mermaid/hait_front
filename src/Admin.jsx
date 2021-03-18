import React, { useEffect, useState } from "react";
import { Redirect, Route, Switch, useHistory, useParams } from "react-router";
import { Link } from "react-router-dom";

import logo from './logo.svg'

const statusCode = {
  '-1': 'canceled',
  '0': 'requested',
  '1': 'confirmed',
  CANCELED: '-1',
  REQUESTED: '0',
  CONFIRMED: '1'
}

export default function Admin() {
  return (
    <div id="admin-app" className="flex-column">
      <Route exact path="/admin">
        <Redirect to="/admin/applications" />
      </Route>
      <Switch>
        <Route path="/admin/login" component={Login} />
        <Route component={Main} />
      </Switch>
    </div>
  )
}

function Main() {
  return (
    <>
      <Header />
      <main id="main">
        <Switch>
          <Route path="/admin/applications/:id" component={ApplicationDetail} />
          <Route path="/admin/applications" component={ApplicationList} />
        </Switch>
      </main>
    </>
  )
}

function Header() {
  const history = useHistory()
  const onClick = () => {
    fetch('/api/admin/logout')
      .then(res => {
        if (res.ok) {
          history.replace("/admin/login")
        }
      })
  }

  return (
    <header id="header" className="flex-row">
      <Link to="/admin" className="logo">
        <img src={logo} alt="h.ait logo" />
        <span>승인 신청 관리 페이지</span>
      </Link>
      <button onClick={onClick} className="btn btn-round">로그아웃</button>
    </header>
  )
}

function ApplicationDetail() {
  const [data, setData] = useState(null)
  const { id } = useParams()

  useEffect(() => {
    fetch(`/api/admin/applications/${id}`)
      .then(res => res.json())
      .then(({ data }) => setData(data))
  }, [])

  const onClick = (e) => {
    const { code } = e.target.dataset
    const param = { ...data, process_status: code }
    console.log(param)

    fetch(`/api/admin/applications`, {
      method: 'put',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(param)
    })
      .then(res => {
        if (res.ok) {
          setData(param)
        }
      })
  }

  return (
    <section className="content content-detail">
      <div className="content-header flex-row">
        <h2>승인 신청서</h2>
        {
          (data && data.process_status === 0) &&
          <div className="mailsender">
            <button onClick={onClick} data-code={statusCode.CANCELED} className="btn">거부</button>
            <button onClick={onClick} data-code={statusCode.CONFIRMED} className="btn">승인</button>
          </div>
        }
      </div>
      {
        data &&
        <article>
          <div>
            <span>처리상태</span>
            <span className={`status-label ${statusCode[data.process_status]}`}>{statusCode[data.process_status]}</span>
          </div>
          <div><span>번호</span><span>{data.pk}</span></div>
          <div><span>신청인</span><span>{data.owner_nm}</span></div>
          <div><span>이메일</span><span>{data.owner_email}</span></div>
          <div><span>연락처</span><span>{data.owner_contact}</span></div>
          <div><span>가게명</span><span>{data.rstrnt_nm}</span></div>
          <div><span>지역</span><span>{data.city_nm}</span></div>
          <div><span>신청일</span><span>{data.regdate}</span></div>
          <div>
            <span>기타 신청사항</span>
            <p>{data.more_info}</p>
          </div>
        </article>
      }
    </section>
  )
}

function ApplicationList() {
  const [list, setList] = useState(null)
  const [filter, setFilter] = useState(statusCode.REQUESTED)
  const history = useHistory()

  useEffect(() => {
    fetch(`/api/admin/applications?process_status=${filter}`)
      .then(res => {
        if (!res.ok) {
          history.replace('/admin/login')
        } else {
          return res.json()
        }
      })
      .then(({ data }) => setList(data))
      .catch(err => { })

  }, [filter])

  const onChange = (e) => {
    setFilter(e.target.value)
  }

  return (
    <section className="content content-list">
      <div className="content-header flex-row">
        <h2>승인 신청 목록</h2>
        <select onChange={onChange} className="filter-list">
          <option value={statusCode.REQUESTED}>대기 중</option>
          <option value={statusCode.CONFIRMED}>승인 완료</option>
          <option value={statusCode.CANCELED}>승인 취소</option>
        </select>
      </div>
      <table className="application-list">
        <thead>
          <tr>
            <th className="pk">번호</th>
            <th className="owner-nm">신청인</th>
            <th className="owner-email">이메일</th>
            <th className="owner-contact">연락처</th>
            <th className="rstrnt-nm">가게명</th>
            <th className="city">지역</th>
            <th className="regdate">신청일</th>
            <th className="status">처리상태</th>
          </tr>
        </thead>
        <tbody>
          {
            list && list.map(data => (
              <ApplicationItem key={data.pk} data={data} />
            ))
          }
        </tbody>
      </table>
    </section>
  )
}

function ApplicationItem({ data }) {
  const history = useHistory()
  const onClick = () => {
    history.push(`/admin/applications/${data.pk}`)
  }

  return (
    <tr onClick={onClick} className="application-item">
      <td>{data.pk}</td>
      <td>{data.owner_nm}</td>
      <td>{data.owner_email}</td>
      <td>{data.owner_contact}</td>
      <td>{data.rstrnt_nm}</td>
      <td>{data.city_nm}</td>
      <td>{data.regdate}</td>
      <td>
        <span className={`status-label-small ${statusCode[data.process_status]}`}>
          {statusCode[data.process_status]}
        </span>
      </td>
    </tr>
  )
}

function Login() {

  const history = useHistory()
  const [id, setId] = useState('')
  const [pw, setPw] = useState('')

  const onSubmit = (e) => {
    e.preventDefault()

    const data = {
      id: id,
      pw: pw
    }
    return fetch('/api/admin/login', {
      method: 'post',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(res => {
        if (res.ok) {
          history.push("/admin")
        }
      })
  }

  return (
    <main id="main">
      <section className="content content-login flex-column">
        <h2 className="content-title">관리자 로그인</h2>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            required
            value={id}
            onChange={(e) => setId(e.target.value)}
            placeholder="아이디" />
          <input
            type="password"
            required
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="비밀번호" />
          <button>로그인</button>
        </form>
      </section>
    </main>
  )
}