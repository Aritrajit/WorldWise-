import styles from './Button.module.css'

export default function Button({ onClick, children, type }) {
  return (
      <button onClick={onClick} className={`${styles.btn}
      ${styles[type]}`}>
          {children}
    </button>
  )
}
