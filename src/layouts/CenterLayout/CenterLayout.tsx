import { CSSProperties, ReactNode } from 'react'
import classnames from 'classnames'
import styles from './CenterLayout.module.scss'

interface Props {
    children?: ReactNode
    className?: string
    style?: CSSProperties
}

function CenterLayout({ children, className, style }: Props): JSX.Element {
    return (
        <div className={classnames(styles.CenterLayout, className)} style={style}>
            {children}
        </div>
    )
}

export default CenterLayout
