import { createVuetify } from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { aliases, mdi } from 'vuetify/iconsets/mdi';


const odysseiaTheme = {
    dark: false,
    colors: {
        primary: '#1c61d1',
        secondary: '#1cd18c',
        triadic: '#1CBCD1',
        accent: '#8c9eff',
        error: '#d1311c',
        footer: '#5C6F7A',
        textprimary: "#394B6b",
        textaccented: "#394B6b",
        textsecondary: "#64789E",
        background: '#e0f7fa',
    },
};

export default createVuetify({
    icons: {
        defaultSet: 'mdi',
        aliases,
        sets: {
            mdi,
        },
    },
    theme: {
        defaultTheme: 'odysseiaTheme',
        themes: {
            odysseiaTheme,
        },
    },
});