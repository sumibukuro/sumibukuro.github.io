import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

if (Object.keys(i18next.options).length === 0) {
    i18next.use(initReactI18next).use(LanguageDetector).init()
}

i18next.addResources('es', 'translation', {
    Settings: 'Ajustes',
    Difficulty: 'Dificultad',
    Easy: 'Fácil',
    Normal: 'Normal',
    Hard: 'Difícil',
    Language: 'Idioma',
    Quality: 'Calidad',
    Low: 'Baja',
    Medium: 'Media',
    High: 'Alta',
    'Best Score': 'Mejor puntuación',
    Clear: 'Borrar',
    'Skin Color': 'Color de piel',
    Reset: 'Reiniciar',
    Version: 'Versión',
    Update: 'Actualizar',
    'Privacy Policy': 'política de privacidad',
    Open: 'Abrir',
})

i18next.addResources('zh', 'translation', {
    Settings: '設置',
    Difficulty: '困難',
    Easy: '簡單',
    Normal: '普通',
    Hard: '難',
    Language: '語言',
    Quality: '質量',
    Low: '低',
    Medium: '中等',
    High: '高',
    'Best Score': '最佳得分',
    Clear: '清除',
    'Skin Color': '膚色',
    Reset: '重置',
    Version: '版本',
    Update: '更新',
    'Privacy Policy': '隱私政策',
    Open: '打開',
})

i18next.addResources('ko', 'translation', {
    Settings: '설정',
    Difficulty: '난이도',
    Easy: '쉬운',
    Normal: '정상',
    Hard: '어려운',
    Language: '언어',
    Quality: '품질',
    Low: '저',
    Medium: '중간',
    High: '고',
    'Best Score': '최고 점수',
    Clear: '지우다',
    'Skin Color': '피부색',
    Reset: '초기화',
    Version: '버전',
    Update: '업데이트',
    'Privacy Policy': '개인 정보 정책',
    Open: '열기',
})

i18next.addResources('ja', 'translation', {
    Settings: '設定',
    Difficulty: '難易度',
    Easy: 'かんたん',
    Normal: 'ふつう',
    Hard: 'むずかしい',
    Language: '言語',
    Quality: '品質',
    Low: '低い',
    Medium: '標準',
    High: '高い',
    'Best Score': '最高スコア',
    Clear: 'クリア',
    'Skin Color': '肌の色',
    Reset: 'リセット',
    Version: 'バージョン',
    Update: '更新',
    'Privacy Policy': 'プライバシーポリシー',
    Open: '開く',
})
