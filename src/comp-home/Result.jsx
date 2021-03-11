import { Link } from "react-router-dom";

export default function Result() {
  return (
    <section className="content content-result flex-column">
      <h2 className="content-title">신청 완료</h2>

      <p>승인 신청이 완료되었습니다. 승인 검토는 최대 3일 소요 됩니다.</p>
      <p>신청 결과는 이메일로 발송됩니다.</p>

      <p className="small-link">
        H.ait가 처음이신가요? <Link to="/">H.ait 둘러보기</Link>
      </p>
    </section>
  )
}
