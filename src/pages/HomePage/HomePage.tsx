import { CSSProperties, ReactNode } from 'react'
import classnames from 'classnames'
import styles from './HomePage.module.scss'
import { Link } from 'react-router-dom'
import CenterLayout from '../../layouts/CenterLayout/CenterLayout'
import { Helmet } from 'react-helmet'

interface Props {
    children?: ReactNode
    className?: string
    style?: CSSProperties
}

function HomePage({ className, style }: Props): JSX.Element {
    return (
        <>
            <Helmet>
                <title>sumibukuro - Squid games!</title>
            </Helmet>
            <CenterLayout className={classnames(styles.HomePage, className)} style={style}>
                <h1>sumibukuro</h1>
                <p>Squid games!</p>
                <div className={styles.HomePage__Links}>
                    <Link to="/karasuzo">KARASUZO!</Link>
                </div>
            </CenterLayout>
        </>
    )
}

export default HomePage
