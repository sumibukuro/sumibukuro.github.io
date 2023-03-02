import { PerspectiveCamera, Scene, SpotLight, WebGLRenderer } from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import 'tone/build/Tone'
import * as Tone from 'tone'

declare global {
    interface Window {
        Tone: typeof Tone
    }
}

export const SCENE: { [id: string]: number } = {
    SPLASH: 0,
    HOME: 1,
    PLAYING: 2,
    GAMEOVER: 3,
}

export interface Settings {
    mute: boolean
    quality: string
    difficulty: string
    skinColor: string
    giftExpired: number
    //
    bestScore: number
    coins: number
}

export interface AddSettings {
    mute?: boolean
    quality?: string
    difficulty?: string
    skinColor?: string
    giftExpired?: number
    //
    bestScore?: number
    coins?: number
}

export interface GameOptions {
    title?: string
    container?: HTMLElement
    onUpdate?: (reason: string) => void
    onTap?: (x: number, y: number) => void
}

class ThreeGame {
    onUpdate: (reason: string) => void
    onTap: (x: number, y: number) => void

    renderer: WebGLRenderer
    scene: Scene
    camera: PerspectiveCamera
    spotLight: SpotLight

    settings: Settings
    gameScene: number
    framerate: number
    background: string
    container: HTMLElement
    score: number
    title: string
    locked: boolean
    starCanvas: HTMLCanvasElement
    synth?: Tone.PolySynth
    frameCount: number
    lastTickTime: number
    timeRatio: number

    constructor(options: GameOptions = {}) {
        this.onUpdate = options.onUpdate ?? (() => {})
        this.onTap = options.onTap ?? (() => {})
        this.container = options.container ?? document.createElement('div')
        this.title = options.title ?? 'Game'
        this.framerate = 2
        this.gameScene = location.protocol.match(/^https:/) ? SCENE.SPLASH : SCENE.HOME
        this.background = '#000'
        this.locked = true
        this.frameCount = 0

        // Reset
        this.score = 0
        this.lastTickTime = new Date().getTime()
        this.timeRatio = 1

        // Settings
        this.settings = {
            quality: undefined,
            skinColor: undefined,
            mute: undefined,
            difficulty: undefined,
            bestScore: undefined,
            coins: undefined,
            giftExpired: undefined,
        }
        this.loadSettings()

        // Stars
        const starCanvas = (this.starCanvas = document.createElement('canvas'))
        starCanvas.style.zIndex = '-1'
        this.container.appendChild(starCanvas)

        // 3D
        const scene = (this.scene = new Scene())
        const spotLight = (this.spotLight = new SpotLight('#ffffff', 1))
        spotLight.lookAt(scene.position)
        spotLight.castShadow = true
        scene.add(spotLight)
        // const amibientLight = new AmbientLight('#ffffff', 0.1)
        // scene.add(amibientLight)
        const aspect = window.innerWidth / window.innerHeight
        // const camera = new OrthographicCamera(-d * aspect, d * aspect, d, -d, 1, 1000)
        this.camera = new PerspectiveCamera(75, aspect, 1, 1000)
        this.initRenderer()
        window.addEventListener('resize', () => this.onWindowResize(), false)
        window.addEventListener('orientationchange', () => this.onWindowResize(), false)
        this.onWindowResize()
        this.saveSettings({ quality: this.settings.quality })

        this.render()
        this.tick()
    }

    // Init
    protected initRenderer() {
        if (this.renderer) {
            this.renderer.domElement.remove()
        }
        const renderer = (this.renderer = new WebGLRenderer({
            alpha: true,
            antialias: this.settings.quality !== 'low',
        }))
        renderer.setClearColor(0x000000, 0)
        renderer.setSize(window.innerWidth, window.innerHeight)
        renderer.setPixelRatio(this.settings.quality === 'high' ? 2 : this.settings.quality === 'low' ? 0.5 : 1)
        renderer.shadowMap.enabled = this.settings.quality === 'high'
        const tap = (e: TouchEvent | MouseEvent) => {
            if (e.target !== renderer.domElement) {
                return
            }
            const rect = (e.target as HTMLElement).getBoundingClientRect()
            const pageX = 'targetTouches' in e && e.targetTouches.length ? e.targetTouches[0].pageX : 'pageX' in e ? e.pageX : 0
            const pageY = 'targetTouches' in e && e.targetTouches.length ? e.targetTouches[0].pageY : 'pageY' in e ? e.pageY : 0
            const x = pageX - rect.left
            const y = pageY - rect.top
            this.onTap(x, y)
        }
        renderer.domElement.addEventListener(typeof renderer.domElement.ontouchstart !== 'undefined' ? 'touchstart' : 'mousedown', (e) => tap(e))
        this.container.appendChild(renderer.domElement)
        this.render()
    }

    // Reset
    reset() {
        this.lastTickTime = new Date().getTime()
        this.timeRatio = 1
        this.score = 0
    }

    // Resize
    private onWindowResize() {
        this.starCanvas.width = window.innerWidth
        this.starCanvas.height = window.innerHeight
        this.renderStars()

        const aspect = window.innerWidth / window.innerHeight
        this.camera.aspect = aspect
        // camera.left = -d * aspect
        // camera.right = d * aspect
        // camera.top = d
        // camera.bottom = -d
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        this.render()
    }

    // Stars
    renderStars() {
        const ctx = this.starCanvas.getContext('2d')
        ctx.clearRect(0, 0, this.starCanvas.width, this.starCanvas.height)
        for (let i = 0; i < 50; i++) {
            const x = Math.floor(Math.random() * this.starCanvas.width)
            const y = Math.floor(Math.random() * this.starCanvas.height)
            ctx.save()
            const sizeRatio = Math.random()
            ctx.strokeStyle = '#fff'
            ctx.globalAlpha = 0.2 * Math.random()
            ctx.lineWidth = 3 * sizeRatio
            ctx.lineCap = 'round'
            ctx.beginPath()
            ctx.moveTo(x - 1.5 * sizeRatio, y)
            ctx.lineTo(x + 1.5 * sizeRatio, y)
            ctx.moveTo(x, y - 1.5 * sizeRatio)
            ctx.lineTo(x, y + 1.5 * sizeRatio)
            ctx.stroke()
            ctx.closePath()
            ctx.restore()
        }
    }

    // Set
    public setGameScene(gameScene: number, title?: string) {
        this.gameScene = gameScene
        this.title = title
        this.onUpdate('setGameScene()')
    }

    // Set
    public setTitle(title: string) {
        this.title = title
        this.onUpdate('setTitle()')
    }

    protected render() {
        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera)
        }
    }

    // Tick
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected tick(): boolean {
        requestAnimationFrame(() => this.tick())
        this.frameCount = (this.frameCount + 1) % 240
        if (this.frameCount % Math.floor(60 / this.framerate) !== 0) {
            return true
        }
        if (this.locked) {
            return true
        }
        // Ratio
        const currentTime = new Date().getTime()
        if (this.lastTickTime > 0) {
            this.timeRatio = (currentTime - this.lastTickTime) / (1000 / 60)
        }
        this.lastTickTime = currentTime
        return false
    }

    // 3D
    protected loadGLTF(path: string): Promise<THREE.Group> {
        return new Promise((resolve) => {
            const loader = new GLTFLoader()
            loader.load(path, (gltf) => resolve(gltf.scene))
        })
    }

    // Sound
    protected initSynthFromClickEvent() {
        this.synth = new window.Tone.PolySynth().toDestination()
    }

    // Sound
    public playSound(note: string) {
        if (this.settings.mute) {
            return
        }
        if (!this.synth) {
            this.initSynthFromClickEvent()
        }
        this.synth?.triggerAttackRelease(note, '32n')
    }

    // Settings
    private loadSettings() {
        this.settings = JSON.parse(localStorage.getItem('KRSZ_SETTINGS') || 'null') || {
            mute: true,
            quality: 'medium',
            difficulty: 'normal',
            skinColor: '#fff',
            giftExpired: 0,
            bestScore: 0,
            coins: 0,
        }
    }

    // Settings
    public saveSettings(addSettings: AddSettings) {
        if (typeof addSettings.mute === 'boolean') {
            this.settings.mute = addSettings.mute
        }
        if (typeof addSettings.quality === 'string') {
            this.settings.quality = addSettings.quality
            this.framerate = this.settings.quality === 'low' ? 15 : this.settings.quality === 'medium' ? 30 : this.settings.quality === 'high' ? 60 : 120
            this.initRenderer()
        }
        if (typeof addSettings.difficulty === 'string') {
            this.settings.difficulty = addSettings.difficulty
        }
        if (typeof addSettings.skinColor === 'string') {
            this.settings.skinColor = addSettings.skinColor
            this.updateSkinColor(addSettings.skinColor)
        }
        if (typeof addSettings.bestScore === 'number') {
            this.settings.bestScore = addSettings.bestScore
        }
        if (typeof addSettings.coins === 'number') {
            this.settings.coins = addSettings.coins
        }
        if (typeof addSettings.giftExpired === 'number') {
            this.settings.giftExpired = addSettings.giftExpired
        }
        localStorage.setItem('KRSZ_SETTINGS', JSON.stringify(this.settings))
        this.onUpdate('saveSettings()')
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    protected updateSkinColor(skinColor: string) {}
}

export default ThreeGame
