import { Route, Switch, useRouteMatch, Link, useLocation, useHistory, useParams } from "react-router-dom"

import logo from './logo.svg'
import img from './default.jpg'
import { useEffect, useMemo, useState } from "react"

function Header({ pagename }) {
  return (
    <header id="header">
      <h1><Link to="/customer"><img src={logo} alt="logo" /></Link></h1>
      <h2>{pagename}</h2>
    </header>
  )
}

function Customer() {
  return (
    <div id="customer-app" className="flex-column">
      <Switch>
        <Route exact path="/customer" component={Index} />
        <Route component={Main} />
        {/* <Route path={`${path}/search`} component={Search} /> */}
        {/* <Route path={`${path}/rstrnt/:id/reserv`} component={Reserv} />
        <Route path={`${path}/rstrnt/:id`} component={Detail} />
        <Route path={`${path}/result/:id`} component={Result} /> */}
      </Switch>
    </div>
  )
}

// index
function Index() {
  return (
    <main id="main">
      <section className="content content-visual">
        <div className="text">
          <small>I hate wait!</small>
          <h1>H.ait</h1>
          <p>이제,</p>
          <p>안에서 편하게 기다리자</p>
        </div>
        <Link className="btn btn-round" to={`/customer/restaurants`}>가게 찾기</Link>
      </section>
    </main>
  )
}

function Main() {
  const [pagename, setPagename] = useState(null);

  return (
    <>
      <Header pagename={pagename} />
      <main id="main">
        <Switch>
          <Route path="/customer/restaurants/:id/reserv">
            <Reserv setPagename={setPagename} />
          </Route>
          <Route path="/customer/restaurants/:id">
            <RstrntDetail setPagename={setPagename} />
          </Route>
          <Route path="/customer/restaurants">
            <RstrntList setPagename={setPagename} />
          </Route>
          <Route path="/customer/result/:id">
            <Result setPagename={setPagename}/>
          </Route>
        </Switch>
      </main>
    </>
  )
}

function RstrntList({ setPagename }) {

  const [cities, setCities] = useState(null)
  const [list, setList] = useState(null)

  useEffect(() => {
    setPagename('가게 찾기')

    fetch(`/api/home/cities`)
      .then(res => {
        if (res.ok) {
          return res.json()
        }
      })
      .then(({ cities }) => {
        setCities(
          cities.map(({ pk, nm }) => (
            <option key={pk} value={pk}>{nm}</option>
          ))
        )
      })
      .catch(err => { })

    // fetch("/api/customer/restaurants")
    //   .then(res => {
    //     if (res.ok) {
    //       return res.json()
    //     }
    //   })
    //   .then(json => {
    //     setList(
    //       json.map((data) => (
    //         <ListItem key={data.pk} data={data} />
    //       ))
    //     )
    //   })
  }, [])

  return (
    <>
      <div className="search-form flex-row">
        <input type="text" placeholder="가게명" />
        <select>
          <option>지역</option>
          {cities ? cities : null}
        </select>
      </div>

      <section className="content content-list">
        <ul className="list">
          {list}
        </ul>
      </section>
    </>
  )
}

function ListItem({ data }) {
  const history = useHistory()

  const { pk, profile_img, nm, location, contact } = data

  const onClick = () => {
    history.push(`/customer/restaurants/${pk}`)
  }
  return (
    <li className="list-item" onClick={onClick}>
      <img src={profile_img || img} alt={`${nm} - profile image`} />
      <div className="info">
        <strong>{nm}</strong>
        <p>{location}</p>
        <p>{contact}</p>
      </div>
    </li>
  )
}

// rstrnt detail
function RstrntDetail({ setPagename }) {
  const { id } = useParams()
  // const [data, setData] = useState(null)

  useEffect(() => {
    setPagename('가게 정보')

    // fetch(`/api/customer/restaurants/${id}`)
    //   .then(res => {
    //     if(res.ok) {
    //       return res.json()
    //     }
    //   })
    //   .then(data => setData(data))
  }, [])

  const data = {
    pk: 1,
    profile: null,
    nm: '해피치즈스마일',
    contact: '030-303-3030',
    addr: '강동철의 감자탕 우측 골목',
    more_info: '우리 이 맛있는 스마일은 사실 해피해피 감자탕이에요!',
    reserv_total: 23,
  }

  const { url } = useRouteMatch()
  // const { id } = useParams()
  return (
    <section className="content content-detail">
      <div className="card-container">
        <div className="card card-circle profile-img">
          {
            data.profile &&
            <img src={data.profile} alt="profile" />
          }
        </div>
        <div className="card card-circle realtime-total">
          <p>대기 중</p>
          <strong>23</strong>
          <p>팀</p>
        </div>
      </div>
      <div className="info">
        <h2>{data.nm}</h2>
        <p><i>📞</i>{data.contact}</p>
        <p><i>📍</i>{data.addr}</p>
        <p><i>📝</i>{data.more_info}</p>
      </div>
      <Link className="btn" to={`${url}/reserv`}>예약하기</Link>
    </section>
  )
}

// rstrnt reserv
function Reserv({ setPagename }) {
  // const { url } = useRouteMatch()
  // const { id } = useParams()

  useEffect(() => {
    setPagename('예약하기')
  }, [])
  const data = {
    profile: '',
    nm: '해피치즈스마일',
  }

  const onClick = (e) => {
    e.preventDefault()
  }

  return (
    <section className="content content-reserv">
      <div className="info">
        <div className="card card-circle profile-img">
          {
            data.profile_img &&
            <img src={img} alt="profile" />
          }
        </div>
        <p><strong>{data.nm}</strong><span>에 예약합니다.</span></p>
      </div>
      <form>
        <input type="tel" placeholder="연락처" required/>
        <select required>
          <option value="">인원수</option>
          <option value="1">1 명</option>
          <option value="2">2 명</option>
          <option value="3">3 명</option>
          <option value="4">4 명</option>
          <option value="5">5 명</option>
        </select>
        <label><input type="checkbox" required/>정보 제공에 동의합니다.</label>
        <button className="btn" onClick={onClick}>예약하기</button>
      </form>
    </section>
  )
}

// rstrnt reserv result
function Result({setPagename}) {

  useEffect(() => {
    setPagename('예약 결과')
  }, [])
  const data = {
    rstrnt_nm: '해피치즈스마일',
    rstrnt_contact: '1010389012',
    rstrnt_addr: 'dfasdfdsf',
    reserv_no: 23,
    reserv_contact: '01010101',
    reserv_headcount: 3,
    team: 2
  }

  return (
    <>
      <section className="content content-result">
        <div className="main-info">
          <p><strong className="rstrnt-nm">{data.rstrnt_nm}</strong>에</p>
          <p>대기번호 <strong className="reserv-no">#{data.reserv_no}</strong>번으로</p>
          <p>예약 되었습니다.</p>
          <small><i>🥎</i>변동사항 발생 시 매장으로 직접 연락 바랍니다.<i>🥎</i></small>
        </div>
        <h3>상세 정보</h3>
        <div className="reserv-info">
          <p>연락처: {data.reserv_contact}</p>
          <p>인원수: {data.reserv_headcount}명</p>
          <p>대기번호: {data.reserv_no}번</p>
          <p>남은 대기 팀: {data.team}팀</p>
        </div>
        <div className="rstrnt-info">
          <p>가게명: {data.rstrnt_nm}</p>
          <p>가게 연락처: {data.rstrnt_contact}</p>
          <p>가게 주소: {data.rstrnt_addr}</p>
        </div>
      </section>
    </>
  )
}

export default Customer