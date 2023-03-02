import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

if (Object.keys(i18next.options).length === 0) {
    i18next.use(initReactI18next).use(LanguageDetector).init()
}

i18next.addResources('es', 'translation', {
    'TAP TO PLAY': 'TOCA PARA JUGAR',
    'How to play': 'Cómo jugar',
    Pause: 'Pausa',
    Resume: 'Reanudar',
    Exit: 'Salida',
    //
    Shop: 'Comercio',
    'Change Skin': 'Cambio de piel',
    Gift: 'Regalo',
    'Get Your Gift!': '¡Ten tu regalo!',
    Hours: 'Horas',
})

i18next.addResources('zh', 'translation', {
    'TAP TO PLAY': '點擊玩遊戲',
    'How to play': '怎麼玩',
    Pause: '暫停',
    Resume: '恢復',
    Exit: '退出',
    //
    Shop: '店鋪',
    'Change Skin': '更換皮膚',
    Gift: '禮物',
    'Get Your Gift!': '得到你的禮物！',
    Hours: '小時',
})

i18next.addResources('ko', 'translation', {
    'TAP TO PLAY': '탭하여 게임하기',
    'How to play': '게임 방법',
    Pause: '정지시키다',
    Resume: '재개하다',
    Exit: '종료',
    //
    Shop: '가게',
    'Change Skin': '스킨 변경',
    Gift: '선물',
    'Get Your Gift!': '선물을 받으세요!',
    Hours: '시간',
})

i18next.addResources('ja', 'translation', {
    'TAP TO PLAY': 'タッチで遊ぶ',
    'How to play': '遊び方',
    Pause: '一時停止',
    Resume: '再開する',
    Exit: 'やめる',
    //
    Shop: 'お店',
    'Change Skin': 'スキンを変更',
    Gift: 'ギフト',
    'Get Your Gift!': 'ギフトを手に入れよう!',
    Hours: '時間',
})
