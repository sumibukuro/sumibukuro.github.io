import { CSSProperties, ReactNode } from 'react'
import classnames from 'classnames'
import styles from './ErrorPage.module.scss'
import { Link } from 'react-router-dom'
import CenterLayout from '../../layouts/CenterLayout/CenterLayout'
import { Helmet } from 'react-helmet'

interface Props {
    children?: ReactNode
    className?: string
    style?: CSSProperties
    //
    title?: string
}

function ErrorPage({ className, style, children, title }: Props): JSX.Element {
    return (
        <>
            <Helmet>
                <title>{title ?? 'Error'} | sumibukuro</title>
            </Helmet>
            <CenterLayout className={classnames(styles.ErrorPage, className)} style={style}>
                <h1>{title ?? 'Error'}</h1>
                {children}
                <Link to="/">Home</Link>
            </CenterLayout>
        </>
    )
}

export default ErrorPage
