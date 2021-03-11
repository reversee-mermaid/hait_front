import { Link } from "react-router-dom"

export default function Index() {
  return (
    <section className="content content-index">
      <Link className="btn btn-round" to="/owner">사장님으로 시작하기</Link>
      <Link className="btn btn-round" to="/customer">손님으로 시작하기</Link>
    </section>
  )
}