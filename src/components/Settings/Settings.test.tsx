import '@testing-library/jest-dom'
import { render } from '@testing-library/react'
import Settings from './Settings'

describe('Settings', () => {
  it('className props', () => {
    const className = 'Test'
    const { container } = render(<Settings className={className}></Settings>)
    expect(container.getElementsByClassName(className)[0]).toBeInTheDocument()
  })

  it('style props', () => {
    const color = 'hotpink'
    const { container } = render(<Settings style={{ color }}></Settings>)
    expect((container.querySelector('.Settings') as HTMLElement).style.color).toBe(color)
  })
})
