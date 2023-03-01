import { CSSProperties, ReactNode, useCallback, useState } from 'react'
import classnames from 'classnames'
import styles from './KarasuzoPage.module.scss'
import DefaultLayout from '../../layouts/DefaultLayout/DefaultLayout'
import KarasuzoGame from './games/KarasuzoGame'
import useForceUpdate from 'use-force-update'
import { SCENE } from '../../layouts/DefaultLayout/lib/ThreeGame'
import { useTranslation } from 'react-i18next'
import Logo from '../../components/Logo/Logo.svg'
import './KarasuzoPage.i18n'
import { Helmet } from 'react-helmet'

const title = 'KARASUZO!'

interface Props {
    children?: ReactNode
    className?: string
    style?: CSSProperties
}

function KarasuzoPage({ className, style }: Props): JSX.Element {
    const forceUpdate = useForceUpdate()
    const [game, setGame] = useState<KarasuzoGame>()
    const { t } = useTranslation()

    const onReady = useCallback((container: HTMLElement) => {
        const game = new KarasuzoGame({
            container,
            title,
            onUpdate: () => forceUpdate(),
            onScore: (score) => game.setTitle(score.toString()),
            onDead: () => {
                setTimeout(() => game.setGameScene(SCENE.HOME, title), 2000)
            },
            onTap: () => {
                if (game.gameScene === SCENE.HOME) {
                    game.reset()
                    game.setGameScene(SCENE.PLAYING)
                }
            },
        })
        game.initAsync().then(() => {
            setGame(game)
            window.setTimeout(() => {
                if (game.gameScene === SCENE.SPLASH) {
                    game.setGameScene(SCENE.HOME, title)
                }
            }, 2500)
        })
    }, [])

    return (
        <>
            <Helmet>
                <title>{title}</title>
            </Helmet>
            <DefaultLayout className={classnames(styles.KarasuzoPage, className)} style={style} title="KARASUZO!" coinEmoji="🦑" game={game} onReady={onReady}>
                <div className={styles.KarasuzoPage__Usage}>
                    <p className={classnames(styles.KarasuzoPage__Usage__Text, styles['KarasuzoPage__Usage__Text--Move'])}>👆 {t('Move to tapped location')} 💨</p>
                    <p className={classnames(styles.KarasuzoPage__Usage__Text, styles['KarasuzoPage__Usage__Text--Squid'])}>🦑 {t('Get dried squids!')} 👌</p>
                    <p className={classnames(styles.KarasuzoPage__Usage__Text, styles['KarasuzoPage__Usage__Text--Banana'])}>❌ {t("Don't hit the banana!")} 🍌</p>
                </div>
                <div className={styles.KarasuzoPage__Copyright}>
                    <Logo className={styles.KarasuzoPage__Copyright__Logo}></Logo>
                    <br /> Copyright ©︎ 2023 Shinwajushi
                    <br />
                    App:
                    <span>shinwajushi.com</span>
                    <br />
                    Character:
                    <span>@karasu_zo</span>
                    <br />
                    Character Design:
                    <span>@moronimae</span>
                </div>
            </DefaultLayout>
        </>
    )
}

export default KarasuzoPage
