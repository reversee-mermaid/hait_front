import RestaurantMenuRoundedIcon from '@material-ui/icons/RestaurantMenuRounded'
import LocationOnRoundedIcon from '@material-ui/icons/LocationOnRounded'
import CallRoundedIcon from '@material-ui/icons/CallRounded'
import AlternateEmailRoundedIcon from '@material-ui/icons/AlternateEmailRounded'
import PersonRoundedIcon from '@material-ui/icons/PersonRounded'
import { Link } from 'react-router-dom'
import { useCallback, useContext, useEffect, useState } from 'react'
import { api } from '../utils/owner-api'
import { rstrntContext } from './Main'

export default function Setting() {
  return (
    <section className="content content-setting">
      <div className="inner">
        <RstrntInfo />
        <OwnerInfo />
        <p className="small_link">기본 정보가 변경되었나요? <Link to="">정보수정 요청</Link></p>
      </div>
    </section>
  )
}

function RstrntInfo() {
  const { state: rstrnt, dispatch } = useContext(rstrntContext)

  const fileHandle = useCallback((e) => {
    const formData = new FormData()
    formData.append('file', e.target.files[0])

    api.updRstrnt(formData, ({ status, data }) => {
      if (status === 200) {
        dispatch({ type: 'SET_PROFILE_IMG', data: data.profile_img })
      }
    })
  }, [])

  const moreInfoSubmit = useCallback((e) => {
    e.preventDefault()
    api.updRstrnt(new FormData(e.target), ({ status, data }) => {
      if (status === 200) {
        dispatch({ type: 'SET_MORE_INFO', data: data.more_info })
      }
    })
  }, [])

  const moreInfoHandle = useCallback((e) => {
    dispatch({ type: 'SET_MORE_INFO', data: e.target.value })
  }, [])

  return (
    <div className="rstrnt-info">
      <h2>Restaurant Information</h2>
      <form className="profile-form">
        <div className="card card-circle">
          <img src={`/resources/img/rstrnt/${rstrnt.pk}/${rstrnt.profile_img}`} alt="profile image" />
        </div>
        <input type="file" id="file" name="file" accept="image/*" onChange={fileHandle} />
        <label htmlFor="file" className="btn btn-round">사진 수정</label>
      </form>
      <div className="static-info">
        <p><RestaurantMenuRoundedIcon />{rstrnt.nm}</p>
        <p><CallRoundedIcon />{rstrnt.contact}</p>
        <p><LocationOnRoundedIcon />{rstrnt.location}</p>
      </div>
      <form className="more-info-form" onSubmit={moreInfoSubmit} encType="multipart/form-data">
        <textarea name="more_info" placeholder='소개글을 입력해주세요'
          value={rstrnt.more_info} onChange={moreInfoHandle} />
        <button>소개글 등록</button>
      </form>
    </div>
  )
}

function OwnerInfo() {
  const [ownerInfo, setOwnerInfo] = useState({})

  useEffect(() => {
    api.getOwnerInfo(({ status, data }) => {
      if (status === 200) {
        setOwnerInfo(data)
      }
    })
  }, [])

  return (
    <div className="owner-info">
      <h2>Owner Information</h2>
      <div className="top">
        <div className="static-info">
          <p><PersonRoundedIcon />{ownerInfo.nm}</p>
          <p><CallRoundedIcon />{ownerInfo.contact}</p>
          <p><AlternateEmailRoundedIcon />{ownerInfo.email}</p>
        </div>
      </div>
    </div>
  )
}