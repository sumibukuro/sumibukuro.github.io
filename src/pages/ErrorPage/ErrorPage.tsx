import { CSSProperties, ReactNode } from 'react'
import classnames from 'classnames'
import styles from './ErrorPage.module.scss'
import { Link } from 'react-router-dom'

interface Props {
    children?: ReactNode
    className?: string
    style?: CSSProperties
}

function ErrorPage({ className, style }: Props): JSX.Element {
    return (
        <div className={classnames(styles.ErrorPage, className)} style={style}>
            <h1>Error</h1>
            <Link to="/">Home</Link>
        </div>
    )
}

export default ErrorPage
