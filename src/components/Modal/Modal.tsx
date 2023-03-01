import { CSSProperties, ReactNode } from 'react'
import classnames from 'classnames'
import styles from './Modal.module.scss'

interface Props {
  children?: ReactNode
  className?: string
  style?: CSSProperties
  //
  caption?: string
  onClose?: () => void
  center?: boolean
}

function Modal({ children, className, style, caption, onClose, center }: Props): JSX.Element {
  return (
    <div className={classnames(styles.Modal, className)} style={style} onClick={(e) => onClose && (e.target as HTMLElement).classList.contains(styles.Modal) && onClose()}>
      <div className={styles.Modal__Inner}>
        <div className={classnames(styles.Modal__Head, onClose && styles['Modal__Head--Left'])}>
          <h2 className={styles.Modal__Head__Caption}>{caption}</h2>
          {onClose && (
            <button className={styles.Modal__Head__CloseButton} onClick={() => onClose()}>
              ×
            </button>
          )}
        </div>
        <div className={classnames(styles.Modal__Body, center && styles['Modal__Body--Center'])}>{children}</div>
      </div>
    </div>
  )
}

export default Modal
