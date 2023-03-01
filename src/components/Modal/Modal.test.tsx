import '@testing-library/jest-dom'
import { fireEvent, render, screen } from '@testing-library/react'
import Modal from './Modal'

describe('Modal', () => {
    it('children props', () => {
        const text = 'Test'
        render(<Modal>{text}</Modal>)
        expect(screen.getByText(text)).toBeInTheDocument()
    })

    it('className props', () => {
        const className = 'Test'
        const { container } = render(<Modal className={className}></Modal>)
        expect(container.getElementsByClassName(className)[0]).toBeInTheDocument()
    })

    it('style props', () => {
        const color = 'hotpink'
        const { container } = render(<Modal style={{ color }}></Modal>)
        expect((container.querySelector('.Modal') as HTMLElement).style.color).toBe(color)
    })

    it('caption props', () => {
        render(<Modal caption="Test" />)
        expect(screen.getByText('Test')).toBeInTheDocument()
    })

    it('onClose props', () => {
        const onClose = jest.fn()
        const { container } = render(<Modal onClose={onClose} />)
        fireEvent.click(container.querySelector('.Modal'))
        expect(onClose).toHaveBeenCalledTimes(1)
    })

    it('center props', () => {
        render(<Modal center>Test</Modal>)
        const modalBody = screen.getByText('Test')
        expect(modalBody.classList.toString()).toMatch(/Center/)
    })
})
