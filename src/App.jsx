import { useMemo, useState } from 'react'
import './App.css'

const savedKey = 'retro-game-map.saved'
const postKey = 'retro-game-map.posts'

const areas = ['すべて', '東京', '大阪', '群馬', '千葉', '神奈川', '京都', '山口', '埼玉']
const genres = ['すべて', 'レトロゲーム', '格闘ゲーム', 'シューティング', 'レトロ自販機', 'オートレストラン', '閉店アーカイブ']
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
    note: '公式サイトでレトロゲーム専門店として案内。スペースハリアー、グラディウス、ダライアスなど名作筐体の遠征需要が強い。',
    monetization: '店舗グッズ、周辺ホテル、梅田飲食、海外観光客向けモデルコース広告。',
  },
  {
    id: 'mikado-baba',
    name: '高田馬場ゲーセンミカド',
    area: '東京',
    station: '高田馬場',
    genre: '格闘ゲーム',
    status: '営業中',
    lastChecked: '2026-07-17',
    rating: 4.6,
    sourceUrl: 'https://mi-ka-do.net/',
    features: ['大会', '配信', 'レトロ対戦'],
    note: '大会・配信・レトロタイトルの文化が強く、来店者と配信視聴者の両方をつなげやすい。',
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
    note: '公式ページで300台超のビデオゲームを案内。レトロゲームの王国として紹介される文化もある。',
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
    note: 'プレイ施設ではなく販売・買取寄りだが、基板・筐体・レトロPC文化の受け皿として重要。',
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
    station: '成田市',
    genre: 'オートレストラン',
    status: '営業中',
    lastChecked: '2026-07-17',
    rating: 4.0,
    sourceUrl: 'https://jihanki.michikusa.jp/',
    features: ['弁当自販機', 'うどん', '昭和ロードサイド'],
    note: '昭和レトロ自販機の稼働状況リストで現存情報を追いやすい、首都圏から行きやすい施設。',
    monetization: '成田観光、レンタカー、近隣温浴、ドライブ保険、駐車場広告。',
  },
  {
    id: 'sagamihara-tire',
    name: '中古タイヤ市場 相模原店 自販機コーナー',
    area: '神奈川',
    station: '相模原市',
    genre: 'レトロ自販機',
    status: '営業中',
    lastChecked: '2026-07-17',
    rating: 4.3,
    sourceUrl: 'https://jihanki.michikusa.jp/',
    features: ['台数が多い', '家族向け', '駐車場'],
    note: '多種類の自販機を一度に楽しめる遠征向きスポット。写真投稿と食べ比べ記事で伸ばしやすい。',
    monetization: 'カー用品、タイヤ交換、レンタカー、家族向け飲食、動画企画スポンサー。',
  },
  {
    id: 'drive-in-daruma',
    name: 'ドライブインダルマ',
    area: '京都',
    station: '舞鶴市',
    genre: 'オートレストラン',
    status: '営業中',
    lastChecked: '2026-07-17',
    rating: 4.2,
    sourceUrl: 'https://jihanki.michikusa.jp/',
    features: ['ラーメン', 'うどん', 'ゲーム機', '昭和空間'],
    note: 'ロードサイドのオートレストラン文化を残す貴重な施設。時系列記事と遠征ルートで深掘りできる。',
    monetization: '舞鶴観光、海鮮飲食、宿泊、ドライブプラン、写真集・ZINE販売。',
  },
  {
    id: 'nagasawa-garden',
    name: '長沢ガーデン',
    area: '山口',
    station: '山口市',
    genre: 'レトロ自販機',
    status: '営業中',
    lastChecked: '2026-07-17',
    rating: 4.0,
    sourceUrl: 'https://jihanki.michikusa.jp/',
    features: ['うどん自販機', '宿泊', '温泉'],
    note: '食事・宿泊・温浴をまとめられるため、滞在型の収益導線に強い。',
    monetization: '宿泊予約、温泉、交通、山口観光、地域土産の送客。',
  },
  {
    id: 'tekken-taro',
    name: 'オートレストラン鉄剣タロー',
    area: '埼玉',
    station: '行田市',
    genre: '閉店アーカイブ',
    status: '閉店',
    lastChecked: '2026-07-17',
    rating: 4.2,
    sourceUrl: 'https://kumagaya.keizai.biz/headline/717/',
    features: ['2020年閉店', '昭和自販機', '思い出投稿'],
    note: '2020年に閉店した名店。閉店店の歴史、口コミ、写真投稿を保存するアーカイブの核にできる。',
    monetization: '閉店アーカイブ広告、思い出レビュー投稿、復刻グッズ、地域回遊記事。',
  },
]

const timeline = [
  { year: '1960-70年代', title: 'ロードサイドに自販機食堂・オートレストランが広がる', text: '長距離ドライバーや深夜利用者向けに、うどん・ラーメン・トーストなどの調理自販機、ゲーム機、休憩スペースが集まった。' },
  { year: '1980-90年代', title: 'ゲームセンター文化と合流', text: 'ビデオゲーム、格闘ゲーム、シューティング筐体が各地で稼働。現在のレトロゲーム遠征の原風景になる。' },
  { year: '2000年代', title: '老朽化と閉店が進む', text: '機械の部品不足、後継者不足、道路環境の変化により閉店が増加。口コミや個人サイトの記録価値が高まる。' },
  { year: '2020年代', title: 'SNSと動画で再発見される', text: '昭和レトロ、聖地巡礼、閉店前に行きたい場所としてバズりやすくなり、現存店の稼働確認とUGCが重要になる。' },
]

const revenuePlans = [
  { name: '遠征予約', text: '宿泊、レンタカー、高速バス、航空券、駐車場を施設カードから自然に案内。' },
  { name: '地域送客', text: '近隣飲食、温浴、道の駅、観光スポットを回遊ルートとして掲載。' },
  { name: 'グッズ・買取', text: 'レトロゲーム販売、基板買取、復刻ステッカー、写真集、ZINEを導線化。' },
  { name: '確認済み掲載', text: '店舗向けに営業時間、稼働筐体、告知枠を有料で更新できるプランを用意。' },
]

const buzzIdeas = [
  '都道府県別「まだ行ける昭和スポット」ランキング',
  '閉店前に行きたい店の思い出レビュー募集',
  '100円で遊べる名作筐体マップ',
  'レトロ自販機の食べ比べ投稿キャンペーン',
  '遠征ルートを投稿して宿・交通導線へつなげる',
]

const faq = [
  ['AIに引用されやすくするには？', '店名、地域、営業状況、確認日、一次情報リンク、口コミ要約を短く構造化して掲載します。'],
  ['UGCはどう増やす？', '写真、稼働確認、閉店情報、思い出レビューを軽く投稿できる形にして、確認待ちから掲載へ回します。'],
  ['バズりやすい切り口は？', '閉店前に行きたい、昭和からの時系列、現存店ランキング、遠征モデルコースが拡散されやすいです。'],
]

const safeParse = (value, fallback) => {
  try {
    return JSON.parse(value) ?? fallback
  } catch {
    return fallback
  }
}

function App() {
  const [query, setQuery] = useState('')
  const [area, setArea] = useState('すべて')
  const [genre, setGenre] = useState('すべて')
  const [status, setStatus] = useState('すべて')
  const [saved, setSaved] = useState(() => safeParse(localStorage.getItem(savedKey), []))
  const [posts, setPosts] = useState(() => safeParse(localStorage.getItem(postKey), []))
  const [form, setForm] = useState({ name: '', area: '', type: '稼働確認', memo: '' })

  const filtered = useMemo(() => {
    const keyword = query.trim().toLowerCase()
    return facilities.filter((item) => {
      const matchesKeyword = !keyword || [item.name, item.area, item.station, item.genre, item.note, ...item.features].join(' ').toLowerCase().includes(keyword)
      return matchesKeyword && (area === 'すべて' || item.area === area) && (genre === 'すべて' || item.genre === genre) && (status === 'すべて' || item.status === status)
    })
  }, [area, genre, query, status])

  const stats = useMemo(() => {
    const open = facilities.filter((item) => item.status === '営業中').length
    const vending = facilities.filter((item) => item.genre === 'レトロ自販機' || item.genre === 'オートレストラン').length
    return { total: facilities.length, open, vending, archived: facilities.length - open }
  }, [])

  const toggleSaved = (id) => {
    const next = saved.includes(id) ? saved.filter((savedId) => savedId !== id) : [...saved, id]
    setSaved(next)
    localStorage.setItem(savedKey, JSON.stringify(next))
  }

  const submitPost = (event) => {
    event.preventDefault()
    if (!form.name.trim() || !form.memo.trim()) return
    const nextPost = { ...form, id: crypto.randomUUID(), createdAt: new Date().toLocaleDateString('ja-JP'), status: '確認待ち' }
    const next = [nextPost, ...posts].slice(0, 8)
    setPosts(next)
    localStorage.setItem(postKey, JSON.stringify(next))
    setForm({ name: '', area: '', type: '稼働確認', memo: '' })
  }

  return (
    <main className="app-shell">
      <section className="hero">
        <div>
          <span className="brand">Retro Game Map</span>
          <h1>現存するレトロゲームと昭和自販機を、閉店史ごと探せる地図。</h1>
          <p>
            レトロゲームセンター、オートレストラン、レトロ自販機、閉店した名店の記録を横断検索。UGCで最新状況を集め、遠征予約・地域送客・グッズ販売へつなげます。
          </p>
        </div>
        <aside className="feature-card">
          <span>AI回答向け要約</span>
          <strong>営業状況・確認日・出典つき</strong>
          <p>LLMOを意識し、AIが引用しやすい短文回答とFAQをページ内に配置しています。</p>
        </aside>
      </section>

      <section className="search-panel" aria-label="施設検索">
        <label>
          キーワード
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="店名・地域・筐体・自販機" />
        </label>
        <label>
          エリア
          <select value={area} onChange={(event) => setArea(event.target.value)}>
            {areas.map((value) => <option key={value}>{value}</option>)}
          </select>
        </label>
        <label>
          ジャンル
          <select value={genre} onChange={(event) => setGenre(event.target.value)}>
            {genres.map((value) => <option key={value}>{value}</option>)}
          </select>
        </label>
        <label>
          状況
          <select value={status} onChange={(event) => setStatus(event.target.value)}>
            {statuses.map((value) => <option key={value}>{value}</option>)}
          </select>
        </label>
      </section>

      <section className="summary-grid" aria-label="サイト指標">
        <article><span>掲載候補</span><strong>{stats.total}</strong><p>現存店と閉店アーカイブ</p></article>
        <article><span>営業中</span><strong>{stats.open}</strong><p>遠征導線を置ける施設</p></article>
        <article><span>昭和自販機系</span><strong>{stats.vending}</strong><p>レトロ自販機とオートレストラン</p></article>
        <article><span>閉店史</span><strong>{stats.archived}</strong><p>口コミと思い出投稿で蓄積</p></article>
      </section>

      <section className="history-section">
        <div>
          <span className="brand">Timeline</span>
          <h2>昭和から続くオートレストラン文化の時系列</h2>
          <p>検索流入だけでなく、AIが説明しやすい背景情報として時代ごとの文脈を整理します。</p>
        </div>
        <div className="timeline-list">
          {timeline.map((item) => (
            <article key={item.year}>
              <span>{item.year}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="directory-section">
        <div>
          <span className="brand">Directory</span>
          <h2>現存店・閉店店リスト</h2>
          <p>公式情報、稼働状況、口コミ、遠征時の収益導線を施設ごとにまとめます。</p>
        </div>
        <div className="content-grid">
          {filtered.map((item) => (
            <article className="arcade-card" key={item.id}>
              <div className="card-topline">
                <span>{item.area}</span>
                <span className={item.status === '閉店' ? 'status closed' : 'status'}>{item.status}</span>
              </div>
              <h3>{item.name}</h3>
              <p>{item.note}</p>
              <div className="tag-row">
                {item.features.map((feature) => <span key={feature}>{feature}</span>)}
              </div>
              <div className="metric-row">
                <span>{item.station}</span>
                <strong>{item.rating.toFixed(1)}</strong>
              </div>
              <p className="monetization">{item.monetization}</p>
              <div className="actions">
                <a className="source-link" href={item.sourceUrl} target="_blank" rel="noreferrer">出典を見る</a>
                <button type="button" onClick={() => toggleSaved(item.id)}>
                  {saved.includes(item.id) ? '保存済み' : '行きたい'}
                </button>
              </div>
              <small className="checked">確認日: {item.lastChecked}</small>
            </article>
          ))}
        </div>
      </section>

      <section className="ugc-section">
        <div>
          <span className="brand">UGC Loop</span>
          <h2>稼働確認・閉店情報・思い出レビューを投稿</h2>
          <p>投稿を起点に、最新情報の更新、ランキング記事、SNS拡散、店舗向け有料掲載へつなげます。</p>
        </div>
        <form className="ugc-form" onSubmit={submitPost}>
          <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="施設名" />
          <input value={form.area} onChange={(event) => setForm({ ...form, area: event.target.value })} placeholder="都道府県・市区町村" />
          <select value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value })}>
            <option>稼働確認</option>
            <option>閉店情報</option>
            <option>口コミ・レビュー</option>
            <option>写真投稿</option>
          </select>
          <input value={form.memo} onChange={(event) => setForm({ ...form, memo: event.target.value })} placeholder="見たもの・遊んだ筐体・自販機メニュー" />
          <button type="submit">投稿する</button>
        </form>
        <div className="post-grid">
          {posts.length === 0 && <p className="empty-text">まだ投稿はありません。最初の稼働確認を投稿できます。</p>}
          {posts.map((post) => (
            <article key={post.id}>
              <span>{post.type} / {post.status}</span>
              <h3>{post.name}</h3>
              <p>{post.memo}</p>
              <small>{post.area || 'エリア未入力'} / {post.createdAt}</small>
            </article>
          ))}
        </div>
      </section>

      <section className="growth-grid">
        <div className="revenue-panel">
          <h3>収益導線</h3>
          <div>
            {revenuePlans.map((plan) => (
              <article key={plan.name}>
                <strong>{plan.name}</strong>
                <p>{plan.text}</p>
              </article>
            ))}
          </div>
        </div>
        <div className="buzz-panel">
          <h3>バズ施策</h3>
          <ul>
            {buzzIdeas.map((idea) => <li key={idea}>{idea}</li>)}
          </ul>
        </div>
      </section>

      <section className="seo-section">
        <div className="answer-box">
          <span className="brand">AIO / LLMO Answer</span>
          <h2>レトロゲームセンターとレトロ自販機を探すなら、営業中・閉店・確認日・口コミを同時に見るのが近道です。</h2>
          <p>
            Retro Game Mapは、施設名、地域、ジャンル、営業状況、確認日、出典リンク、口コミ投稿を1ページに集約し、検索エンジンとAI回答の両方に伝わる形で整理します。
          </p>
        </div>
        <div className="faq-grid">
          {faq.map(([question, answer]) => (
            <article key={question}>
              <h3>{question}</h3>
              <p>{answer}</p>
            </article>
          ))}
        </div>
        <div className="source-list">
          <h3>参照・確認元</h3>
          <a href="https://jihanki.michikusa.jp/" target="_blank" rel="noreferrer">昭和レトロ自販機稼働状況＆閉店マップ</a>
          <a href="https://kumagaya.keizai.biz/headline/717/" target="_blank" rel="noreferrer">熊谷経済新聞: 鉄剣タロー閉店</a>
          <a href="https://www.saitama-np.co.jp/articles/4833/postDetail" target="_blank" rel="noreferrer">埼玉新聞: 鉄剣タロー閉店記事</a>
          <a href="https://royalgamecenter.com/en/" target="_blank" rel="noreferrer">ロイヤルゲームセンター公式</a>
          <a href="https://mi-ka-do.net/" target="_blank" rel="noreferrer">ゲーセンミカド公式</a>
          <a href="https://www.taito.co.jp/en/store/topics/00001703/659/4" target="_blank" rel="noreferrer">タイトー: 秋葉原Hey</a>
        </div>
      </section>
    </main>
  )
}

export default App
