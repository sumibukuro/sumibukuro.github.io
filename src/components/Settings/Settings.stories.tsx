import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import Settings from './Settings'
import ThreeGame from '../../layouts/DefaultLayout/lib/ThreeGame'

export default {
    title: 'Settings',
    component: Settings,
} as ComponentMeta<typeof Settings>
const Template: ComponentStory<typeof Settings> = (args) => <Settings {...args}>children</Settings>

export const Default = Template.bind({})
Default.args = {
    game: new ThreeGame(),
    onClose: action('onClose()'),
}
