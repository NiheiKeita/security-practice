import type { Preview } from "@storybook/react"
import "../resources/css/app.css"
import { initialize, mswLoader } from 'msw-storybook-addon'

initialize()

const preview: Preview = {
    parameters: {
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
    },
    loaders: [mswLoader],
}

global.route = (name, params, absolute) => {
    return `/${name}`
}

export default preview
