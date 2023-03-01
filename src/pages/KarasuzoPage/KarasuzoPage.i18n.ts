import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

if (Object.keys(i18next.options).length === 0) {
    i18next.use(initReactI18next).use(LanguageDetector).init()
}

i18next.addResources('es', 'translation', {
    'Get dried squids!': '¡Consigue calamares secos!',
    'Move to tapped location': 'Mover a la ubicación tocada',
    "Don't hit the banana!": '¡No le pegues al plátano!',
})

i18next.addResources('zh', 'translation', {
    'Get dried squids!': '得到干魷魚！',
    'Move to tapped location': '移動到點擊的位置',
    "Don't hit the banana!": '不要打香蕉！',
})

i18next.addResources('ko', 'translation', {
    'Get dried squids!': '말린오징어를 겟!',
    'Move to tapped location': '탭한 위치로 이동',
    "Don't hit the banana!": '바나나를 치지 마라!',
})

i18next.addResources('ja', 'translation', {
    'Get dried squids!': 'スルメを手に入れろ!',
    'Move to tapped location': 'タップした場所に移動',
    "Don't hit the banana!": 'バナナに当たるな!',
})
