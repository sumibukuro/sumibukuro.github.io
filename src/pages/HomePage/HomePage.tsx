import { CSSProperties, ReactNode } from 'react'
import classnames from 'classnames'
import styles from './HomePage.module.scss'
import { Link } from 'react-router-dom'

interface Props {
    children?: ReactNode
    className?: string
    style?: CSSProperties
}

function HomePage({ className, style }: Props): JSX.Element {
    return (
        <div className={classnames(styles.HomePage, className)} style={style}>
            <h1>sumibukuro</h1>
            <Link to="/karasuzo">/karasuzo</Link>
        </div>
    )
}

export default HomePage
