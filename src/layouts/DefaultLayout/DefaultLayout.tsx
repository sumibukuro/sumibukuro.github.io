import { CSSProperties, ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import classnames from 'classnames'
import styles from './DefaultLayout.module.scss'
import Logo from '../../components/Logo/Logo.svg'
import { GoMute, GoUnmute, GoGear, GoThumbsup, GoGift, GoRuby, GoQuestion } from 'react-icons/go'
import { useTranslation } from 'react-i18next'
import Modal from '../../components/Modal/Modal'
import ThreeGame, { SCENE } from './lib/ThreeGame'
import Settings from '../../components/Settings/Settings'
import './DefaultLayout.i18n'

interface Props {
    children?: ReactNode
    className?: string
    style?: CSSProperties
    //
    title: string
    appLink?: string
    coinEmoji?: string
    game: ThreeGame
    onReady: (container: HTMLElement) => void
}

function DefaultLayout({ children, className, style, title, coinEmoji = '💰', appLink, game, onReady }: Props): JSX.Element {
    const screenRef = useRef()
    const [isVisibleSettings, setIsVisibleSettings] = useState<boolean>(false)
    const [isVisibleUsage, setIsVisibleUsage] = useState<boolean>(false)
    const [isVisibleShop, setIsVisibleShop] = useState<boolean>(false)
    const [isVisibleGift, setIsVisibleGift] = useState<boolean>(false)
    const [paused, setPaused] = useState<boolean>(false)
    const { t } = useTranslation()
    const inCordova = location.origin === 'https://localhost' || location.origin === 'file://'

    useEffect(() => {
        if (!screenRef || !screenRef.current) {
            return
        }
        const container = screenRef.current
        onReady(container)
    }, [screenRef])

    // Change Skin
    const changeSkinCoins = 200
    const changeSkin = useCallback(() => {
        if (!game || game.settings.coins < changeSkinCoins) {
            return
        }
        let color = '#fff'
        do {
            color = `hsl(${20 * Math.floor(Math.random() * 18)}, ${60 + 20 * Math.floor(Math.random() * 3)}%, ${60 + 20 * Math.floor(Math.random() * 2)}%)`
        } while (color === game.settings.skinColor)
        game.playSound('C5')
        game.saveSettings({ skinColor: color, coins: game.settings.coins - changeSkinCoins })
        setIsVisibleShop(false)
    }, [game])

    //
    const giftCoins = 100
    const getGift = useCallback(() => {
        if (!game || game.settings.giftExpired > Date.now()) {
            return
        }
        game.playSound('C5')
        game.saveSettings({ giftExpired: Date.now() + 1000 * 60 * 60 * 12, coins: game.settings.coins + giftCoins })
    }, [game])

    return (
        <div className={classnames(styles.DefaultLayout, className)} style={{ ...style, background: game?.background }}>
            <div className={styles.DefaultLayout__Screen} ref={screenRef}></div>
            {!inCordova && (
                <div className={styles.DefaultLayout__PR}>
                    <div className={styles.DefaultLayout__PR__Image}>PR</div>
                </div>
            )}
            {!game ? (
                <div className={styles.DefaultLayout__Loading}></div>
            ) : game.gameScene === SCENE.SPLASH ? (
                <div className={classnames(styles.DefaultLayout__Loading, styles['DefaultLayout__Loading--Splash'])}>
                    <Logo className={styles.DefaultLayout__Loading__Logo}></Logo>
                </div>
            ) : game.gameScene === SCENE.HOME ? (
                <>
                    <h1 className={styles.DefaultLayout__Heading}>{game.title}</h1>
                    <div className={styles.DefaultLayout__SubHeading}>{game.settings.bestScore > 0 ? `${t('Best Score')} ${game.settings.bestScore}` : t('TAP TO PLAY')}</div>
                    <div className={styles.DefaultLayout__BottomButtons}>
                        {appLink && (
                            <a className={classnames(styles.DefaultLayout__IconButton, styles['DefaultLayout__IconButton--AppLink'])} style={{ animation: `${styles['fade-in-bottom-btn']} 0.2s ease 0.1s forwards` }} href={appLink} target="_blank">
                                <GoThumbsup></GoThumbsup>
                            </a>
                        )}
                        <div
                            className={classnames(styles.DefaultLayout__IconButton, styles['DefaultLayout__IconButton--Usage'])}
                            style={{ animation: `${styles['fade-in-bottom-btn']} 0.2s ease 0.2s forwards` }}
                            onClick={() => setIsVisibleUsage(!isVisibleUsage)}
                        >
                            <GoQuestion></GoQuestion>
                        </div>
                        <div
                            className={classnames(styles.DefaultLayout__IconButton, styles['DefaultLayout__IconButton--Shop'])}
                            style={{ animation: `${styles['fade-in-bottom-btn']} 0.2s ease 0.3s forwards` }}
                            onClick={() => setIsVisibleShop(!isVisibleShop)}
                        >
                            <GoRuby></GoRuby>
                        </div>
                        <div className={styles.DefaultLayout__IconButton} onClick={() => game.saveSettings({ mute: !game.settings.mute })} style={{ animation: `${styles['fade-in-bottom-btn']} 0.2s ease 0.4s forwards` }}>
                            {game.settings.mute ? <GoMute></GoMute> : <GoUnmute></GoUnmute>}
                        </div>
                        <div
                            className={classnames(styles.DefaultLayout__IconButton, styles['DefaultLayout__IconButton--Settings'])}
                            style={{ animation: `${styles['fade-in-bottom-btn']} 0.2s ease 0.5s forwards` }}
                            onClick={() => setIsVisibleSettings(!isVisibleSettings)}
                        >
                            <GoGear></GoGear>
                        </div>
                        <div
                            className={classnames(styles.DefaultLayout__IconButton, styles['DefaultLayout__IconButton--Gift'], game.settings.giftExpired < Date.now() && styles['DefaultLayout__IconButton--GiftEnabled'])}
                            style={{ animation: `${styles['fade-in-bottom-btn']} 0.2s ease 0.6s forwards` }}
                            onClick={() => setIsVisibleGift(!isVisibleGift)}
                        >
                            <GoGift></GoGift>
                        </div>
                    </div>
                    {isVisibleUsage && (
                        <Modal className={styles.DefaultLayout__Usage} caption={t('How to play')} onClose={() => setIsVisibleUsage(false)}>
                            {children}
                        </Modal>
                    )}
                    {isVisibleShop && (
                        <Modal className={styles.DefaultLayout__Shop} caption={t('Shop')} onClose={() => setIsVisibleShop(false)} center>
                            <p>
                                {coinEmoji} {game.settings.coins}
                            </p>
                            <p>
                                <button disabled={game.settings.coins < changeSkinCoins} onClick={() => changeSkin()}>
                                    {t('Change Skin')} -{changeSkinCoins}
                                </button>
                            </p>
                        </Modal>
                    )}
                    {isVisibleGift && (
                        <Modal className={styles.DefaultLayout__Gift} caption={t('Gift')} onClose={() => setIsVisibleGift(false)} center>
                            <p>
                                {coinEmoji} {game.settings.coins}
                            </p>
                            <p>
                                <button disabled={game.settings.giftExpired > Date.now()} onClick={() => getGift()}>
                                    {t('Get Your Gift!')} +{giftCoins}
                                </button>
                            </p>
                            {game.settings.giftExpired > Date.now() && (
                                <div>
                                    ⏳ {((game.settings.giftExpired - Date.now()) / 1000 / 60 / 60).toFixed(2)} {t('Hours')}
                                </div>
                            )}
                        </Modal>
                    )}
                    {isVisibleSettings && (
                        <Modal className={styles.DefaultLayout__Settings} caption={t('Settings')} onClose={() => setIsVisibleSettings(false)}>
                            <Settings game={game} onClose={() => setIsVisibleSettings(false)}></Settings>
                        </Modal>
                    )}
                </>
            ) : game.gameScene === SCENE.PLAYING ? (
                <>
                    <h1 className={classnames(styles.DefaultLayout__Heading, game.settings.bestScore > 0 && game.settings.bestScore < game.score && styles['DefaultLayout__Heading--Shine'])}>{game.title}</h1>
                    {!game.locked && (
                        <div
                            className={classnames(styles.DefaultLayout__IconButton, styles['DefaultLayout__IconButton--Pause'])}
                            onClick={() => {
                                game.locked = true
                                setPaused(true)
                            }}
                        ></div>
                    )}
                    {paused && (
                        <Modal className={styles.DefaultLayout__Pause} caption={t('Pause')} center>
                            <button
                                onClick={() => {
                                    game.locked = false
                                    setPaused(false)
                                }}
                            >
                                {t('Resume')}
                            </button>
                            <button
                                onClick={() => {
                                    setPaused(false)
                                    game.setGameScene(SCENE.HOME, title)
                                }}
                            >
                                {t('Exit')}
                            </button>
                        </Modal>
                    )}
                </>
            ) : (
                <div></div>
            )}
        </div>
    )
}

export default DefaultLayout
