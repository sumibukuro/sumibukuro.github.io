import { CSSProperties, ReactNode, useCallback, useMemo } from 'react'
import classnames from 'classnames'
import styles from './Settings.module.scss'
import { useTranslation } from 'react-i18next'
import ThreeGame from '../../layouts/DefaultLayout/lib/ThreeGame'
import './Settings.i18n'

interface Props {
  children?: ReactNode
  className?: string
  style?: CSSProperties
  //
  game?: ThreeGame
  onClose?: () => void
}

function Settings({ className, style, game, onClose }: Props): JSX.Element {
  const { t, i18n } = useTranslation()
  const inCordova = location.origin === 'https://localhost' || location.origin === 'file://'

  // Version
  const version = useMemo(() => {
    let version = 'DEMO'
    document.querySelectorAll('script').forEach((el) => {
      const matches = el.src.match(/\/main-(\w+)/)
      if (matches) {
        version = matches[1].slice(0, 6)
      }
    })
    return version
  }, [])

  // Update App
  const updateApp = useCallback(() => {
    caches.keys().then((cacheNames) => {
      cacheNames.forEach((cacheName) => {
        caches.delete(cacheName)
      })
    })
    location.reload()
    onClose()
  }, [])

  return (
    <div className={classnames(styles.Settings, className)} style={style}>
      <dl>
        <dt>{t('Difficulty')}</dt>
        <dd>
          <select value={game?.settings.difficulty} onChange={(e) => game?.saveSettings({ difficulty: e.target.value })}>
            <option value="easy">{t('Easy')}</option>
            <option value="normal">{t('Normal')}</option>
            <option value="hard">{t('Hard')}</option>
          </select>
        </dd>
        <dt>{t('Language')}</dt>
        <dd>
          <select value={i18n.language} onChange={(e) => i18n.changeLanguage(e.target.value)}>
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="zh">中文 (繁體)</option>
            <option value="ko">한국어</option>
            <option value="ja">日本語</option>
          </select>
        </dd>
        <dt>{t('Quality')}</dt>
        <dd>
          <select value={game?.settings.quality} onChange={(e) => game?.saveSettings({ quality: e.target.value })}>
            <option value="low">{t('Low')}</option>
            <option value="medium">{t('Medium')}</option>
            <option value="high">{t('High')}</option>
          </select>
        </dd>
        <dt>{t('Version')}</dt>
        <dd>
          <span>{version}</span>
          {!inCordova && <button onClick={updateApp}>{t('Update')}</button>}
        </dd>
        <dt>{t('Best Score')}</dt>
        <dd>
          <button
            onClick={() => {
              game?.saveSettings({ bestScore: 0 })
              onClose()
            }}
          >
            {t('Clear')}
          </button>
        </dd>
        <dt>{t('Skin Color')}</dt>
        <dd>
          <button
            onClick={() => {
              game?.saveSettings({ skinColor: '#fff' })
              onClose()
            }}
          >
            {t('Reset')}
          </button>
        </dd>
        <dt>{t('Privacy Policy')}</dt>
        <dd>
          <a href="https://shinwajushi.com/privacy/mobile-casual-games/en.html" target="_blank">
            {t('Open')}
          </a>
        </dd>
      </dl>
    </div>
  )
}

export default Settings
