import { useContext, useEffect, useState } from "react"
import { useHistory } from "react-router"

import RestaurantMenuRoundedIcon from '@material-ui/icons/RestaurantMenuRounded'
import LocationOnRoundedIcon from '@material-ui/icons/LocationOnRounded'
import CallRoundedIcon from '@material-ui/icons/CallRounded'

import { api } from "../utils/customer-api"
import { pagenameContext } from './Main'

export default function List() {
  const { setPagename } = useContext(pagenameContext)
  const [cities, setCities] = useState(null)
  const [list, setList] = useState(null)

  useEffect(() => {
    setPagename('가게 찾기')

    api.getCities(({ cities }) => {
      const list = cities.map(({ pk, nm }) => (
        <option key={pk} value={pk}>{nm}</option>
      ))
      setCities(list)
    })

    api.getRstrntAll(({ status, message, data }) => {
      if (status === 200) {
        const list = data.map(rstrnt => (
          <Item key={rstrnt.pk} data={rstrnt} />
        ))
        setList(list)
      }
    })
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

function Item({ data }) {
  const history = useHistory()

  const { pk, profile_img, nm, location, contact } = data

  const onClick = () => {
    history.push(`/customer/restaurants/${pk}`)
  }

  return (
    <li className="list-item" onClick={onClick}>
      <img src={`/resources/img/rstrnt/${pk}/${profile_img}`} alt={`${nm} - profile image`} />
      <div className="info">
        <strong><RestaurantMenuRoundedIcon/>{nm}</strong>
        <p><LocationOnRoundedIcon/>{location}</p>
        <p><CallRoundedIcon/>{contact}</p>
      </div>
    </li>
  )
}