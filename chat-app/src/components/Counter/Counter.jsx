import React, { useState } from 'react'
import styles from "../Counter/Counter.module.scss"

function Counter() {
    const [count, setCount] = useState(0)


    const increment = () => setCount(count + 1)
    const decrement = () => setCount(count - 1)
    const restCount = () => setCount(0)
  return (
    <div>
        <div className={styles.counterContainer}>
      <h2 className={styles.title}>Count: {count}</h2>
      <div className={styles.buttonGroup}>
      <button className={styles.button} onClick={increment}>Increment</button>
      <button className={styles.button} onClick={decrement}>Decrement</button>
      <button className={styles.button} onClick={restCount}>reset</button>
      </div>
    </div>


    </div>
  )
}

export default Counter

