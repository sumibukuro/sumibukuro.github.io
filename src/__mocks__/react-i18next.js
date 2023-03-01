// eslint-disable-next-line no-undef
module.exports = {
    useTranslation: () => {
        return {
            t: (str) => str,
            i18n: {
                changeLanguage: () => new Promise(() => {}),
            },
        }
    },
    initReactI18next: {
        type: '3rdParty',
        init: () => {},
    },
}
