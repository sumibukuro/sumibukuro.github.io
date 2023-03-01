import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import Modal from './Modal'

export default {
    title: 'Modal',
    component: Modal,
} as ComponentMeta<typeof Modal>
const Template: ComponentStory<typeof Modal> = (args) => <Modal {...args}>children</Modal>

export const Default = Template.bind({})
Default.args = {
    caption: 'Default',
    onClose: action('onClose()'),
    center: true,
}
