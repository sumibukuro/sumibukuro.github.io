import { Vector3, CircleGeometry, Mesh, MeshLambertMaterial, TextureLoader, PlaneGeometry, MeshBasicMaterial, DoubleSide } from 'three'
import BananaModel from '../../../models/banana.glb'
import KarasuzokuModel from '../../../models/karasuzoku_stop.glb'
import SurumeImage from '../../../models/surume.png'
import ThreeGame, { GameOptions } from '../../../layouts/ThreeGameLayout/lib/ThreeGame'

interface KarasuzoGameOptions extends GameOptions {
    onScore: (score: number) => void
    onDead: () => void
}

class KarasuzoGame extends ThreeGame {
    onScore: (score: number) => void
    onDead: () => void

    karasuzoku?: THREE.Group
    surumeModelTemplate?: THREE.Mesh
    bananaModelTemplate?: THREE.Group
    bananas: THREE.Group[]
    surumes: THREE.Mesh[]

    d: number
    totalScore: number
    targetPosition: THREE.Vector3

    constructor(options: KarasuzoGameOptions) {
        super({
            ...options,
            onTap: (x, y) => {
                const per = Math.max(-1, Math.min(1, (x - window.innerWidth / 2) / (window.innerHeight / 3)))
                this.targetPosition = new Vector3(this.d * per, 0, 0)
                options.onTap(x, y)
            },
        })

        this.onScore = options.onScore ?? (() => {})
        this.onDead = options.onDead ?? (() => {})
        this.d = 3

        // Reset
        this.targetPosition = new Vector3(0, 0, 0)
        this.bananas = []
        this.surumes = []
        this.totalScore = 0
        this.updateBackground()

        // 3D
        this.camera.position.set(0, this.d / 2, this.d * 2.5)
        this.camera.lookAt(new Vector3(0, this.d, 0))
        this.spotLight.position.set(0, this.d * 5, 0)
        const ground = new Mesh(new CircleGeometry(this.d * 1.2, 32), new MeshLambertMaterial({ color: '#ffffff', transparent: true, opacity: 0.05 }))
        ground.rotation.set(-Math.PI / 2, 0, 0)
        // ground.scale.set(1, 0.3, 1)
        ground.receiveShadow = true
        this.scene.add(ground)
    }

    // Init
    async initAsync() {
        const karasuzoku = (this.karasuzoku = await this.loadGLTF(KarasuzokuModel))
        karasuzoku.children.forEach((child) => {
            child.castShadow = true
            const meshChild = <THREE.Mesh>child
            if (meshChild.isMesh && !child.name.startsWith('_')) {
                meshChild.material = new MeshBasicMaterial({ color: this.settings.skinColor })
            }
        })
        this.scene.add(karasuzoku)
        this.surumeModelTemplate = new Mesh(new PlaneGeometry(0.5, 1.5), new MeshBasicMaterial({ map: new TextureLoader().load(SurumeImage), side: DoubleSide, transparent: true }))
        this.surumeModelTemplate.castShadow = true
        this.bananaModelTemplate = await this.loadGLTF(BananaModel)
        this.bananaModelTemplate.children.forEach((child) => (child.castShadow = true))
        this.render()
    }

    // Reset
    async reset() {
        super.reset()
        this.targetPosition = new Vector3(0, 0, 0)
        this.updateBackground()
        this.initSynthFromClickEvent()
        this.renderStars()
        this.playSound('E4')

        // Karasuzoku
        const karasuzoku = this.karasuzoku
        karasuzoku.position.set(0, 0, 0)
        karasuzoku.rotation.set(0, 0, 0)

        // Surume
        this.surumes.forEach((surume) => {
            this.scene.remove(surume)
        })
        const surumes = (this.surumes = [])
        for (let i = 0; i < 2; i++) {
            const surume = this.surumeModelTemplate.clone()
            surume.position.x = -this.d / 2 + this.d * Math.random()
            surume.position.y = this.d
            surume.rotation.x = -Math.PI / 3
            surume.rotation.z = Math.PI / 2
            this.scene.add(surume)
            surumes.push(surume)
        }

        // Banana
        this.bananas.forEach((banana) => {
            this.scene.remove(banana)
        })
        const bananas = (this.bananas = [])
        const maxBananas = this.settings.difficulty === 'easy' ? 2 : this.settings.difficulty === 'normal' ? 3 : 4
        for (let i = 0; i < maxBananas; i++) {
            const banana = this.bananaModelTemplate.clone(true)
            if (i !== 0) {
                banana.position.x = this.d
            }
            banana.position.y = this.d * 3
            banana.userData.positionSpeed = 0.025 + Math.random() * 0.025
            banana.userData.rotationSpeed = Math.random() < 0.1 ? 0 : 0.025 + Math.random() * 0.025
            const child = <THREE.Mesh>banana.children[0]
            if (child.isMesh) {
                banana.userData.defaultMaterial = child.material
                banana.userData.subMaterial = new MeshBasicMaterial({ color: '#cc8833' })
            }
            this.scene.add(banana)
            bananas.push(banana)
        }

        // Unlock
        this.onScore(this.score)
        this.locked = false
    }

    // Tick
    protected tick(): boolean {
        if (super.tick()) {
            return true
        }
        const tr = this.timeRatio
        const karasuzoku = this.karasuzoku
        if (karasuzoku) {
            karasuzoku.position.lerp(this.targetPosition, 0.05 * tr)
            karasuzoku.rotation.y += 0.025 * (karasuzoku.position.x < 0 ? 1 : -1) * tr
        }
        // Surume
        this.surumes.forEach((surume) => {
            if (surume.position.y > 0.2) {
                surume.position.y -= 0.025 * tr
                if (surume.position.y < 0.2) {
                    surume.position.y = 0.2
                }
            }
            const surumeDist = Math.sqrt(Math.pow(surume.position.y - karasuzoku.position.y, 2) + Math.pow(surume.position.x - karasuzoku.position.x, 2))
            if (surumeDist < 0.5) {
                surume.position.x = -this.d / 2 + this.d * Math.random()
                surume.position.y = this.d
                this.score++
                this.totalScore++
                const notes = ['C4', 'D4', 'E4', 'G4', 'A4', 'C5']
                this.updateBackground()
                this.renderStars()
                this.playSound(notes[Math.floor(Math.random() * notes.length)])
                this.onScore(this.score)
            }
        })
        // Banana
        this.bananas.forEach((banana) => {
            banana.position.y -= banana.userData.positionSpeed * tr
            banana.rotation.y += banana.userData.rotationSpeed * tr
            if (banana.position.y < 0) {
                // Up
                banana.position.x = -this.d + Math.random() * this.d * 2
                banana.position.y = this.d * 3
                banana.position.z = 0
                banana.userData.positionSpeed = 0.025 + Math.random() * 0.05
                banana.userData.rotationSpeed = Math.random() < 0.1 ? 0 : 0.025 + Math.random() * 0.025
                const child = <THREE.Mesh>banana.children[0]
                if (child.isMesh) {
                    const isDefaultBanana = this.settings.difficulty === 'easy' ? true : this.settings.difficulty === 'normal' ? Math.random() <= 0.8 : false
                    child.material = isDefaultBanana ? banana.userData.defaultMaterial : banana.userData.subMaterial
                }
            }
            const karasuDist = Math.sqrt(Math.pow(banana.position.y - (karasuzoku.position.y + 1), 2) + Math.pow(banana.position.x - karasuzoku.position.x, 2))
            if (karasuDist < 0.7) {
                this.die()
            }
        })
        this.render()
        return false
    }

    die() {
        this.locked = true
        this.karasuzoku.position.set(this.karasuzoku.position.x + 0.8, 0.2, 0)
        this.karasuzoku.rotation.set(-Math.PI / 4, 0, Math.PI / 2)
        this.saveSettings({
            bestScore: Math.max(this.settings.bestScore, this.score),
            coins: this.settings.coins + this.score,
        })
        this.render()
        this.playSound('A2')
        this.onDead()
    }

    private updateBackground() {
        const h = (220 + (this.score || 0) * 1) % 360
        this.background = `linear-gradient(to bottom, hsl(${h}, 30%, 30%) 0%, hsl(${h}, 40%, 40%) 65%, #aaccee 100%)`
    }

    updateSkinColor(skinColor: string) {
        this.karasuzoku.children.forEach((child) => {
            const meshChild = <THREE.Mesh>child
            if (meshChild.isMesh && !child.name.startsWith('_')) {
                meshChild.material = new MeshBasicMaterial({ color: skinColor })
            }
        })
        this.render()
    }
}

export default KarasuzoGame
