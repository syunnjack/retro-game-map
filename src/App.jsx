import { useMemo, useState } from 'react'
import './App.css'

const savedKey = 'retro-game-map.saved'

const areas = ['すべて', '大阪', '名古屋', '静岡', '東京', '愛知']
const genres = ['すべて', 'レトロ筐体', '格ゲー', '音ゲー', '自販機', 'ゲーム喫茶', 'プライズ']
const statuses = ['すべて', '営業中', '要確認', '閉店']

const arcades = [
  {
    id: 'osaka-retro-mania',
    name: 'オオサカレトロゲーム横丁',
    area: '大阪',
    station: '日本橋',
    genre: 'レトロ筐体',
    status: '営業中',
    lastChecked: '2026-07-10',
    walk: 5,
    cabinets: 46,
    rating: 4.7,
    smoke: '近隣喫煙所あり',
    food: '周辺に食堂多数',
    stay: '難波エリア宿へ徒歩圏',
    tags: ['大型筐体', '格ゲー', '遠征向け'],
    note: '画像多めの紹介より、筐体リストと駅からの導線を先に見せる想定。',
  },
  {
    id: 'nagoya-button-cafe',
    name: '名古屋ボタン喫茶',
    area: '名古屋',
    station: '大須観音',
    genre: 'ゲーム喫茶',
    status: '要確認',
    lastChecked: '2026-06-21',
    walk: 8,
    cabinets: 12,
    rating: 4.1,
    smoke: '喫煙不可',
    food: '店内軽食',
    stay: '名駅・栄の宿が便利',
    tags: ['喫茶', 'テーブル筐体', '営業時間注意'],
    note: '営業時間変更の投稿があり、管理者確認待ちの施設。',
  },
  {
    id: 'shizuoka-auto-vendor',
    name: '静岡なつかし自販機コーナー',
    area: '静岡',
    station: '静岡',
    genre: '自販機',
    status: '営業中',
    lastChecked: '2026-07-03',
    walk: 14,
    cabinets: 8,
    rating: 4.5,
    smoke: '屋外喫煙可',
    food: '自販機フード',
    stay: '駅前ホテル推奨',
    tags: ['24時間', '写真投稿', '駐車場'],
    note: '懐かし自販機をアンカーリンクで素早く確認できるモデルケース。',
  },
  {
    id: 'tokyo-versus-basement',
    name: '新宿バーサス地下',
    area: '東京',
    station: '新宿',
    genre: '格ゲー',
    status: '営業中',
    lastChecked: '2026-07-14',
    walk: 6,
    cabinets: 28,
    rating: 4.3,
    smoke: '喫煙ブース徒歩3分',
    food: '深夜飲食あり',
    stay: 'カプセル多数',
    tags: ['対戦台', '大会情報', '深夜'],
    note: '遠征勢向けに大会予定、宿、喫煙、飲食を同じ画面で見せる。',
  },
  {
    id: 'aichi-prize-park',
    name: '愛知プライズパーク',
    area: '愛知',
    station: '岡崎',
    genre: 'プライズ',
    status: '要確認',
    lastChecked: '2026-05-18',
    walk: 12,
    cabinets: 35,
    rating: 3.9,
    smoke: '不明',
    food: '近隣コンビニ',
    stay: '車移動推奨',
    tags: ['景品', '閉店確認待ち', '駐車場'],
    note: 'リンク切れ報告あり。閉店情報bot風に確認フローへ回す。',
  },
  {
    id: 'old-arcade-west',
    name: '西口クラシックゲーム館',
    area: '名古屋',
    station: '名古屋',
    genre: '音ゲー',
    status: '閉店',
    lastChecked: '2026-04-02',
    walk: 7,
    cabinets: 0,
    rating: 0,
    smoke: '閉店',
    food: '閉店',
    stay: '跡地確認のみ',
    tags: ['閉店', '跡地', '要アーカイブ'],
    note: '閉店済み。過去情報として残し、近隣の代替施設へ誘導する。',
  },
]

const autoRestaurants = [
  {
    id: 'marumiya',
    name: '丸美屋自販機コーナー',
    area: '群馬',
    status: '営業中',
    era: '昭和型ロードサイド自販機文化の現存例',
    timeline: [
      '昭和後期: 幹線道路沿いの休憩・食事スポットとして自販機コーナー文化が広がる',
      '2026年7月: 現役稼働リストに掲載。Yahoo!マップでも24時間営業・レビュー評価が確認できる',
    ],
    review: 'Yahoo!マップで4.1、53件の総合評価。うどん・トースト・ラーメンなどの体験レビューが多い。',
    sourceUrl: 'https://map.yahoo.co.jp/v3/place/eCBBtYnb45g/review',
  },
  {
    id: 'shioya',
    name: 'オートパーラーシオヤ',
    area: '千葉',
    status: '営業中',
    era: '成田周辺の現存レトロ自販機スポット',
    timeline: [
      '昭和後期: オートレストラン型のロードサイド需要を背景に類似業態が各地に展開',
      '2026年7月: 現役稼働リストに掲載。遠征先として確認対象',
    ],
    review: '現地訪問前に最新口コミと営業時間確認が必要。自販機巡りの定番候補として扱う。',
    sourceUrl: 'https://jihanki.michikusa.jp/',
  },
  {
    id: 'tekkentaro',
    name: 'オートレストラン鉄剣タロー',
    area: '埼玉',
    status: '閉店',
    era: '昭和63年開業、レトロ自販機の聖地的存在',
    timeline: [
      '1988年7月: 国道17号熊谷バイパス沿いに開業',
      '2020年4月: 新型コロナ対応で臨時休業',
      '2020年5月31日: 32年間の営業に幕',
      '2023年以降: 跡地・継承店のレビューが投稿され、記憶のアーカイブ対象になる',
    ],
    review: '食べログ旧店舗ページは閉店扱いで37件のレビュー。閉店後の関連食堂にも訪問レビューが残る。',
    sourceUrl: 'https://kumagaya.keizai.biz/headline/717/',
  },
]

const sourceLinks = [
  { label: '昭和レトロ自販機 稼働状況＆閉店マップ', url: 'https://jihanki.michikusa.jp/' },
  { label: '熊谷経済新聞 鉄剣タロー閉店記事', url: 'https://kumagaya.keizai.biz/headline/717/' },
  { label: '埼玉新聞 鉄剣タロー閉店詳細', url: 'https://www.saitama-np.co.jp/articles/4833/postDetail' },
  { label: 'Yahoo!マップ 丸美屋口コミ', url: 'https://map.yahoo.co.jp/v3/place/eCBBtYnb45g/review' },
  { label: '食べログ 鉄剣タロー旧店舗', url: 'https://tabelog.com/en/saitama/A1104/A110403/11039199/' },
]

function readSaved() {
  try {
    return JSON.parse(localStorage.getItem(savedKey)) ?? {}
  } catch {
    return {}
  }
}

function statusClass(status) {
  return {
    営業中: 'open',
    要確認: 'review',
    閉店: 'closed',
  }[status] ?? 'review'
}

function App() {
  const [query, setQuery] = useState('大阪')
  const [area, setArea] = useState('すべて')
  const [genre, setGenre] = useState('すべて')
  const [status, setStatus] = useState('すべて')
  const [saved, setSaved] = useState(readSaved)

  const filteredArcades = useMemo(() => {
    const text = query.trim().toLowerCase()
    return arcades
      .filter((arcade) => area === 'すべて' || arcade.area === area)
      .filter((arcade) => genre === 'すべて' || arcade.genre === genre)
      .filter((arcade) => status === 'すべて' || arcade.status === status)
      .filter((arcade) => {
        const haystack = `${arcade.name} ${arcade.area} ${arcade.station} ${arcade.genre} ${arcade.tags.join(' ')} ${arcade.note}`.toLowerCase()
        return !text || haystack.includes(text)
      })
      .sort((a, b) => {
        const statusWeight = { 営業中: 3, 要確認: 2, 閉店: 1 }
        return statusWeight[b.status] - statusWeight[a.status] || b.rating - a.rating || a.walk - b.walk
      })
  }, [area, genre, query, status])

  const displayArcades = filteredArcades.length ? filteredArcades : arcades
  const savedCount = Object.values(saved).filter(Boolean).length
  const openCount = displayArcades.filter((arcade) => arcade.status === '営業中').length
  const reviewCount = displayArcades.filter((arcade) => arcade.status === '要確認').length
  const featured = displayArcades[0]

  const toggleSaved = (arcadeId) => {
    setSaved((current) => {
      const next = { ...current, [arcadeId]: !current[arcadeId] }
      localStorage.setItem(savedKey, JSON.stringify(next))
      return next
    })
  }

  return (
    <main className="app-shell">
      <header className="hero">
        <div>
          <span className="brand">Retro Game Map</span>
          <h1>レトロゲーセンの現存確認と遠征メモを一つに。</h1>
          <p>営業中、閉店、要確認を分けて、筐体・喫煙・飲食・宿までまとめて確認できる遠征向けマップです。</p>
        </div>
        <aside className="feature-card">
          <span>注目施設</span>
          <strong>{featured.name}</strong>
          <p>{featured.station}駅 徒歩{featured.walk}分 / {featured.genre} / {featured.status}</p>
        </aside>
      </header>

      <section className="search-panel" aria-label="施設検索">
        <label>
          地域・駅・筐体
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="例: 大阪、格ゲー、自販機" />
        </label>
        <label>
          エリア
          <select value={area} onChange={(event) => setArea(event.target.value)}>
            {areas.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <label>
          ジャンル
          <select value={genre} onChange={(event) => setGenre(event.target.value)}>
            {genres.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <label>
          状態
          <select value={status} onChange={(event) => setStatus(event.target.value)}>
            {statuses.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
      </section>

      <section className="summary-grid" aria-label="検索サマリー">
        <article>
          <span>営業中</span>
          <strong>{openCount}</strong>
        </article>
        <article>
          <span>要確認</span>
          <strong>{reviewCount}</strong>
        </article>
        <article>
          <span>保存済み</span>
          <strong>{savedCount}</strong>
        </article>
      </section>

      <section className="history-section" aria-label="昭和オートレストラン時系列">
        <div className="section-heading">
          <span className="brand">Auto restaurant archive</span>
          <h2>昭和から続くオートレストランの現存・閉店アーカイブ</h2>
        </div>
        <div className="auto-grid">
          {autoRestaurants.map((place) => (
            <article className="auto-card" key={place.id}>
              <div className="card-top">
                <span className={`status ${statusClass(place.status)}`}>{place.status}</span>
                <span className="checked">{place.area}</span>
              </div>
              <h3>{place.name}</h3>
              <p>{place.era}</p>
              <ol>
                {place.timeline.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
              <div className="review-note">{place.review}</div>
              <a className="source-link" href={place.sourceUrl} target="_blank" rel="noreferrer">参照元を見る</a>
            </article>
          ))}
        </div>
      </section>

      <section className="content-grid">
        <div className="arcade-list" aria-label="施設一覧">
          {displayArcades.map((arcade) => (
            <article className="arcade-card" key={arcade.id}>
              <div className="card-top">
                <span className={`status ${statusClass(arcade.status)}`}>{arcade.status}</span>
                <span className="checked">確認日 {arcade.lastChecked}</span>
              </div>
              <h2>{arcade.name}</h2>
              <p>{arcade.note}</p>
              <div className="metric-row">
                <span>{arcade.station}駅 徒歩{arcade.walk}分</span>
                <span>{arcade.genre}</span>
                <span>筐体 {arcade.cabinets}台</span>
                <span>{arcade.rating ? `評価 ${arcade.rating}` : '評価停止'}</span>
              </div>
              <div className="support-grid">
                <span>{arcade.smoke}</span>
                <span>{arcade.food}</span>
                <span>{arcade.stay}</span>
              </div>
              <div className="tag-row">
                {arcade.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
              <div className="actions">
                <button type="button" onClick={() => toggleSaved(arcade.id)}>{saved[arcade.id] ? '保存済み' : '保存する'}</button>
                <a href={`https://www.google.com/maps/search/${encodeURIComponent(`${arcade.area} ${arcade.name}`)}`} target="_blank" rel="noreferrer">
                  地図で開く
                </a>
              </div>
            </article>
          ))}
        </div>

        <aside className="side-panel">
          <h2>確認フロー</h2>
          <div className="flow-list">
            <span>ユーザー投稿</span>
            <span>リンク切れ・閉店報告</span>
            <span>管理者確認</span>
            <span>営業中 / 要確認 / 閉店へ反映</span>
          </div>
          <div className="route-map" aria-label="遠征導線">
            <span className="node station">駅</span>
            <span className="line" />
            <span className="node arcade">施設</span>
            <span className="line" />
            <span className="node stay">宿</span>
          </div>
          <div className="source-list">
            <h3>参照リンク</h3>
            {sourceLinks.map((source) => (
              <a href={source.url} key={source.url} target="_blank" rel="noreferrer">{source.label}</a>
            ))}
          </div>
        </aside>
      </section>
    </main>
  )
}

export default App
