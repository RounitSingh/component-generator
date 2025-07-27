import { LiveProvider, LiveEditor, LiveError, LivePreview } from 'react-live'
import * as React from 'react'

const scope = { React, useState: React.useState }

const code = `
const styles = {
  container: {
    padding: '1rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontFamily: 'Arial, sans-serif',
    maxWidth: '300px',
    margin: '0 auto',
    textAlign: 'center'
  },
  countText: {
    fontSize: '1.5rem',
    margin: '0 0 1rem 0',
    color: '#333'
  },
  button: {
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'background-color 0.3s',
    ':hover': {
      backgroundColor: '#45a049'
    }
  }
}

const IncrementButton = () => {
  const [count, setCount] = React.useState(0)
 
  const incrementCount = () => {
    setCount((prevCount) => prevCount + 1)
  }
  
  return (
    <div style={styles.container}>
      <p style={styles.countText}>Count: {count}</p>
      <button style={styles.button} onClick={incrementCount}>
        Increment
      </button>
    </div>
  )
}

render(<IncrementButton />)`;

function ReactLiveCheck() {
  return (
    <LiveProvider code={code} scope={scope} noInline>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <LiveEditor style={{ fontFamily: 'monospace', fontSize: 16 }} />
        <div>
          <LivePreview />
          <LiveError style={{ color: 'red' }} />
        </div>
      </div>
    </LiveProvider>
  )
}

export default ReactLiveCheck;