import { useMemo, useState } from 'react'
import './App.css'

const savedKey = 'retro-game-map.saved'
const postKey = 'retro-game-map.posts'

const areas = ['すべて', '東京', '大阪', '群馬', '千葉', '神奈川', '京都', '山口', '名古屋']
const genres = ['すべて', 'レトロゲーム', '格ゲー', 'シューティング', 'レトロ自販機', 'オートレストラン', '閉店アーカイブ']
const statuses = ['すべて', '営業中', '要確認', '閉店']

const facilities = [
  {
    id: 'royal-osaka',
    name: 'ロイヤルゲームセンター',
    area: '大阪',
    station: '大阪 / 梅田',
    genre: 'レトロゲーム',
    status: '営業中',
    lastChecked: '2026-07-17',
    rating: 4.7,
    sourceUrl: 'https://royalgamecenter.com/en/',
    features: ['80-90年代中心', '全台レトロ筐体', '大阪駅前第3ビル'],
    note: '公式サイトでレトロゲーム専門店と案内。ストII、グラディウス、ダライアスなどの名作訴求が強い。',
    monetization: '店舗グッズ、周辺ホテル、梅田飲食、海外観光客向けモデルコース広告。',
  },
  {
    id: 'mikado-baba',
    name: '高田馬場ゲーセンミカド',
    area: '東京',
    station: '高田馬場',
    genre: '格ゲー',
    status: '営業中',
    lastChecked: '2026-07-17',
    rating: 4.6,
    sourceUrl: 'https://mi-ka-do.net/',
    features: ['大会', '配信', 'レトロ対戦'],
    note: '大会・配信・レトロタイトルの文脈が強く、遠征者と配信視聴者の導線を作りやすい。',
    monetization: '大会告知枠、配信導線、周辺宿・飲食・交通アフィリエイト。',
  },
  {
    id: 'hey-akihabara',
    name: '秋葉原Hey',
    area: '東京',
    station: '秋葉原',
    genre: 'シューティング',
    status: '営業中',
    lastChecked: '2026-07-17',
    rating: 4.5,
    sourceUrl: 'https://www.taito.co.jp/en/store/topics/00001703/659/4',
    features: ['ビデオゲーム300台超', '稼働情報', '配信'],
    note: '公式ページで300台超のビデオゲームを案内。レトロゲームの王国として紹介される文脈もある。',
    monetization: '秋葉原回遊、レトロショップ送客、稼働ゲーム検索、周辺カフェ広告。',
  },
  {
    id: 'beep-akihabara',
    name: 'BEEP秋葉原',
    area: '東京',
    station: '秋葉原 / 末広町',
    genre: 'レトロゲーム',
    status: '営業中',
    lastChecked: '2026-07-17',
    rating: 4.4,
    sourceUrl: 'https://www.akihabara-beep.com/',
    features: ['基板販売', '筐体買取', 'レトロPC'],
    note: 'プレイ施設ではなく販売・買取寄りだが、基板・筐体・レトロゲーム文化の収益導線として重要。',
    monetization: '買取査定送客、通販導線、基板・筐体販売、修理記事広告。',
  },
  {
    id: 'marumiya',
    name: '丸美屋自販機コーナー',
    area: '群馬',
    station: 'みどり市',
    genre: 'レトロ自販機',
    status: '営業中',
    lastChecked: '2026-07-17',
    rating: 4.1,
    sourceUrl: 'https://map.yahoo.co.jp/v3/place/eCBBtYnb45g/review',
    features: ['24時間', 'うどん', 'トースト', '口コミ多数'],
    note: 'Yahoo!マップで24時間営業とレビュー評価を確認。現役レトロ自販機の代表候補。',
    monetization: '地図広告、ガソリンスタンド、ドライブ宿、道の駅、口コミ連動広告。',
  },
  {
    id: 'shioya',
    name: 'オートパーラーシオヤ',
    area: '千葉',
    station: '成田',
    genre: 'オートレストラン',
    status: '営業中',
    lastChecked: '2026-07-17',
    rating: 4.2,
    sourceUrl: 'https://jihanki.michikusa.jp/',
    features: ['成田', 'レトロ自販機', '遠征向け'],
    note: '現役稼働リストに掲載。成田空港やレンタカー導線と相性が良い。',
    monetization: '成田空港、レンタカー、宿泊、ドライブ観光のアフィリエイト。',
  },
  {
    id: 'chuko-tire',
    name: '中古タイヤ市場 自販機コーナー',
    area: '神奈川',
    station: '相模原',
    genre: 'レトロ自販機',
    status: '営業中',
    lastChecked: '2026-07-17',
    rating: 4.6,
    sourceUrl: 'https://jihanki.michikusa.jp/',
    features: ['大型スポット', 'ハンバーガー', 'トースト', 'めん類'],
    note: '待ち時間に休める場所として自販機コーナーが設置された文脈があり、体験記事化しやすい。',
    monetization: '現地物販、修理/メンテ記事、ドライブ広告、周辺飲食誘導。',
  },
  {
    id: 'drivein-daruma',
    name: 'ドライブインダルマ',
    area: '京都',
    station: '舞鶴',
    genre: 'オートレストラン',
    status: '営業中',
    lastChecked: '2026-07-17',
    rating: 4.5,
    sourceUrl: 'https://jihanki.michikusa.jp/',
    features: ['西日本代表格', 'レトロ自販機', '観光導線'],
    note: '西日本の現役レトロ自販機遠征候補。舞鶴観光や宿泊と組み合わせやすい。',
    monetization: '舞鶴観光、宿泊、レンタカー、海鮮飲食への送客。',
  },
  {
    id: 'nagasawa-garden',
    name: '長沢ガーデン',
    area: '山口',
    station: '山口',
    genre: 'レトロ自販機',
    status: '営業中',
    lastChecked: '2026-07-17',
    rating: 4.2,
    sourceUrl: 'https://jihanki.michikusa.jp/',
    features: ['西日本遠征', '宿泊/温泉文脈', '道路旅'],
    note: '現役稼働リスト掲載。道路旅・温泉・宿泊と収益導線を組みやすい。',
    monetization: '温泉、宿泊、道路旅用品、地域広告。',
  },
  {
    id: 'tekkentaro',
    name: 'オートレストラン鉄剣タロー',
    area: '埼玉',
    station: '行田',
    genre: '閉店アーカイブ',
    status: '閉店',
    lastChecked: '2026-07-17',
    rating: 0,
    sourceUrl: 'https://kumagaya.keizai.biz/headline/717/',
    features: ['1988年開業', '2020年閉店', '昭和遺産'],
    note: '昭和63年開業、2020年5月31日に閉店。閉店店も歴史・口コミ・代替地案内として価値がある。',
    monetization: '閉店アーカイブ、近隣代替施設、関連書籍/映像/グッズ導線。',
  },
]

const autoTimeline = [
  '昭和後期: 幹線道路沿いに、食事・休憩・ゲームを兼ねたオートレストラン文化が広がる。',
  '1988年: 鉄剣タローが国道17号熊谷バイパス沿いに開業。',
  '2010年代: SNSや動画でレトロ自販機巡礼が再注目される。',
  '2020年5月31日: 鉄剣タローが32年間の営業に幕。',
  '2026年7月: 現役稼働リストや地図口コミを参照しながら、現存店と閉店アーカイブを併記する段階。',
]

const revenueFunnels = [
  { title: '遠征宿・交通アフィリエイト', detail: '最寄駅、駐車場、喫煙可ホテル、深夜飲食を施設カードから直接案内する。' },
  { title: '地図・回遊広告', detail: '喫煙所、ガソリンスタンド、コインパーキング、レンタカー、道の駅を周辺導線として掲載する。' },
  { title: 'グッズ・通販・買取導線', detail: 'Tシャツ、基板、筐体パーツ、レトロゲーム通販、買取査定へ送客する。' },
  { title: 'UGC確認サブスク', detail: '閉店報告、稼働筐体更新、写真投稿、管理者確認済みバッジを会員機能にする。' },
  { title: 'イベント・大会告知', detail: '対戦会、配信、大会、遠征モデルコースを有料掲載できる枠にする。' },
]

const buzzIdeas = [
  '「まだ行ける昭和自販機」都道府県別ランキング',
  '閉店前に行きたいレトロゲーセン投稿キャンペーン',
  '100円で遊べる名作筐体マップ',
  '遠征勢の宿・喫煙・深夜飯セット投稿',
  '閉店店の思い出レビューを保存する追悼ページ',
]

const faqs = [
  {
    q: '現存するレトロゲームセンターはどう探す？',
    a: '公式サイト、店舗SNS、稼働ゲーム情報、口コミ、ユーザー投稿を照合し、営業中・要確認・閉店に分けて確認します。',
  },
  {
    q: 'レトロ自販機とオートレストランの違いは？',
    a: 'レトロ自販機はうどん、トースト、ハンバーガーなどの古い調理販売機を指し、オートレストランは食事・休憩・ゲーム機を含むロードサイド型施設として使われることがあります。',
  },
  {
    q: 'このサイトの収益化ポイントは？',
    a: '遠征宿、交通、駐車場、飲食、グッズ、買取査定、イベント告知、確認済み掲載枠などです。',
  },
]

const sourceLinks = [
  { label: '昭和レトロ自販機 稼働状況＆閉店マップ', url: 'https://jihanki.michikusa.jp/' },
  { label: '熊谷経済新聞 鉄剣タロー閉店記事', url: 'https://kumagaya.keizai.biz/headline/717/' },
  { label: '埼玉新聞 鉄剣タロー閉店詳細', url: 'https://www.saitama-np.co.jp/articles/4833/postDetail' },
  { label: 'Yahoo!マップ 丸美屋口コミ', url: 'https://map.yahoo.co.jp/v3/place/eCBBtYnb45g/review' },
  { label: 'ロイヤルゲームセンター公式', url: 'https://royalgamecenter.com/en/' },
  { label: 'ゲーセンミカド公式', url: 'https://mi-ka-do.net/' },
  { label: '秋葉原Hey公式', url: 'https://www.taito.co.jp/en/store/topics/00001703/659/4' },
  { label: 'BEEP秋葉原公式', url: 'https://www.akihabara-beep.com/' },
]

function readObject(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback
  } catch {
    return fallback
  }
}

function statusClass(status) {
  return { 営業中: 'open', 要確認: 'review', 閉店: 'closed' }[status] ?? 'review'
}

function App() {
  const [query, setQuery] = useState('大阪')
  const [area, setArea] = useState('すべて')
  const [genre, setGenre] = useState('すべて')
  const [status, setStatus] = useState('すべて')
  const [saved, setSaved] = useState(() => readObject(savedKey, {}))
  const [posts, setPosts] = useState(() => readObject(postKey, []))
  const [postForm, setPostForm] = useState({ name: '', area: '', type: 'レトロ自販機', memo: '' })

  const filteredFacilities = useMemo(() => {
    const text = query.trim().toLowerCase()
    return facilities
      .filter((facility) => area === 'すべて' || facility.area === area)
      .filter((facility) => genre === 'すべて' || facility.genre === genre)
      .filter((facility) => status === 'すべて' || facility.status === status)
      .filter((facility) => {
        const haystack = `${facility.name} ${facility.area} ${facility.station} ${facility.genre} ${facility.features.join(' ')} ${facility.note}`.toLowerCase()
        return !text || haystack.includes(text)
      })
      .sort((a, b) => {
        const rank = { 営業中: 3, 要確認: 2, 閉店: 1 }
        return rank[b.status] - rank[a.status] || b.rating - a.rating
      })
  }, [area, genre, query, status])

  const displayFacilities = filteredFacilities.length ? filteredFacilities : facilities
  const featured = displayFacilities[0]
  const savedCount = Object.values(saved).filter(Boolean).length
  const liveCount = displayFacilities.filter((item) => item.status === '営業中').length
  const vendingCount = displayFacilities.filter((item) => item.genre.includes('自販機') || item.genre === 'オートレストラン').length

  const toggleSaved = (id) => {
    setSaved((current) => {
      const next = { ...current, [id]: !current[id] }
      localStorage.setItem(savedKey, JSON.stringify(next))
      return next
    })
  }

  const addPost = (event) => {
    event.preventDefault()
    if (!postForm.name.trim() || !postForm.area.trim()) return
    const nextPost = {
      id: crypto.randomUUID(),
      ...postForm,
      name: postForm.name.trim(),
      area: postForm.area.trim(),
      memo: postForm.memo.trim(),
      status: '確認待ち',
    }
    const nextPosts = [nextPost, ...posts]
    setPosts(nextPosts)
    localStorage.setItem(postKey, JSON.stringify(nextPosts))
    setPostForm({ name: '', area: '', type: 'レトロ自販機', memo: '' })
  }

  return (
    <main className="app-shell">
      <header className="hero">
        <div>
          <span className="brand">Retro Game Map</span>
          <h1>現存レトロゲームと昭和自販機を、閉店前に探せる地図。</h1>
          <p>営業中、要確認、閉店アーカイブを分けて、口コミ・遠征宿・喫煙・飲食・収益導線までまとめます。</p>
        </div>
        <aside className="feature-card">
          <span>今日の注目</span>
          <strong>{featured.name}</strong>
          <p>{featured.area} / {featured.station} / {featured.status}</p>
        </aside>
      </header>

      <section className="search-panel" aria-label="施設検索">
        <label>
          地域・駅・筐体・自販機
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="例: 大阪、格ゲー、うどん自販機" />
        </label>
        <label>
          エリア
          <select value={area} onChange={(event) => setArea(event.target.value)}>
            {areas.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <label>
          ジャンル
          <select value={genre} onChange={(event) => setGenre(event.target.value)}>
            {genres.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
        <label>
          状態
          <select value={status} onChange={(event) => setStatus(event.target.value)}>
            {statuses.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
      </section>

      <section className="summary-grid" aria-label="検索サマリー">
        <article><span>営業中</span><strong>{liveCount}</strong></article>
        <article><span>自販機系</span><strong>{vendingCount}</strong></article>
        <article><span>保存済み</span><strong>{savedCount}</strong></article>
      </section>

      <section className="history-section">
        <div className="section-heading">
          <span className="brand">Showa archive</span>
          <h2>昭和オートレストラン時系列</h2>
        </div>
        <ol className="timeline-list">
          {autoTimeline.map((item) => <li key={item}>{item}</li>)}
        </ol>
      </section>

      <section className="directory-section">
        <div className="section-heading">
          <span className="brand">Live directory</span>
          <h2>現存施設リストと収益導線</h2>
        </div>
        <div className="arcade-list">
          {displayFacilities.map((facility) => (
            <article className="arcade-card" key={facility.id}>
              <div className="card-top">
                <span className={`status ${statusClass(facility.status)}`}>{facility.status}</span>
                <span className="checked">確認日 {facility.lastChecked}</span>
              </div>
              <h2>{facility.name}</h2>
              <p>{facility.note}</p>
              <div className="metric-row">
                <span>{facility.area} / {facility.station}</span>
                <span>{facility.genre}</span>
                <span>{facility.rating ? `評価 ${facility.rating}` : 'アーカイブ'}</span>
              </div>
              <div className="tag-row">
                {facility.features.map((feature) => <span key={feature}>{feature}</span>)}
              </div>
              <div className="review-note">収益導線: {facility.monetization}</div>
              <div className="actions">
                <button type="button" onClick={() => toggleSaved(facility.id)}>{saved[facility.id] ? '保存済み' : '保存する'}</button>
                <a href={facility.sourceUrl} target="_blank" rel="noreferrer">公式・参照元</a>
                <a href={`https://www.google.com/maps/search/${encodeURIComponent(`${facility.area} ${facility.name}`)}`} target="_blank" rel="noreferrer">地図で開く</a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="ugc-section">
        <div className="section-heading">
          <span className="brand">UGC growth</span>
          <h2>ユーザー投稿で現存確認を増やす</h2>
        </div>
        <form className="ugc-form" onSubmit={addPost}>
          <input value={postForm.name} onChange={(event) => setPostForm({ ...postForm, name: event.target.value })} placeholder="施設名・自販機コーナー名" />
          <input value={postForm.area} onChange={(event) => setPostForm({ ...postForm, area: event.target.value })} placeholder="地域・最寄駅" />
          <select value={postForm.type} onChange={(event) => setPostForm({ ...postForm, type: event.target.value })}>
            <option>レトロ自販機</option>
            <option>レトロゲーム</option>
            <option>閉店報告</option>
            <option>稼働筐体更新</option>
          </select>
          <input value={postForm.memo} onChange={(event) => setPostForm({ ...postForm, memo: event.target.value })} placeholder="口コミ・稼働状況・写真メモ" />
          <button type="submit">投稿する</button>
        </form>
        <div className="post-grid">
          {posts.map((post) => (
            <article key={post.id}>
              <span>{post.status}</span>
              <strong>{post.name}</strong>
              <small>{post.area} / {post.type}</small>
              <p>{post.memo || '管理者確認待ちです。'}</p>
            </article>
          ))}
          {posts.length === 0 && <p className="empty-text">投稿すると、確認待ちリストとしてここに表示されます。</p>}
        </div>
      </section>

      <section className="growth-grid">
        <article className="revenue-panel">
          <h3>収益導線</h3>
          <div>
            {revenueFunnels.map((item) => (
              <article key={item.title}>
                <strong>{item.title}</strong>
                <p>{item.detail}</p>
              </article>
            ))}
          </div>
        </article>
        <article className="buzz-panel">
          <h3>バズ施策</h3>
          <ul>
            {buzzIdeas.map((idea) => <li key={idea}>{idea}</li>)}
          </ul>
        </article>
      </section>

      <section className="seo-section">
        <div className="section-heading">
          <span className="brand">SEO / AIO / LLMO</span>
          <h2>AIに引用されやすいFAQと要約</h2>
        </div>
        <p className="answer-box">
          Retro Game Mapは、現存するレトロゲームセンター、昭和レトロ自販機、オートレストラン、閉店アーカイブを営業状態別に整理する遠征向け検索サイトです。
        </p>
        <div className="faq-grid">
          {faqs.map((faq) => (
            <article key={faq.q}>
              <h3>{faq.q}</h3>
              <p>{faq.a}</p>
            </article>
          ))}
        </div>
        <div className="source-list">
          <h3>参照リンク</h3>
          {sourceLinks.map((source) => (
            <a href={source.url} key={source.url} target="_blank" rel="noreferrer">{source.label}</a>
          ))}
        </div>
      </section>
    </main>
  )
}

export default App
