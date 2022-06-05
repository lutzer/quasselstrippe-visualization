import * as THREE from 'three'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

async function setup() {
    const scene = new THREE.Scene()

    // setup camera
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z = 4

    const light = new THREE.PointLight()
    light.position.set(2.5, 7.5, 15)
    scene.add(light)

    const envLight = new THREE.AmbientLight( 0x404040 ); // soft white light
    scene.add( envLight );

    const renderer = new THREE.WebGLRenderer()
    renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(renderer.domElement)

    //setup camera controls
    const controls = new OrbitControls(camera, renderer.domElement)

    var dose: THREE.Group = await loadAsset_Dose('./assets/dose3.obj')
    scene.add(dose)

    window.addEventListener('resize', onWindowResize, false)
    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
        renderer.render(scene, camera)
    }

    (function update(time: number) {
        requestAnimationFrame(update)
    
        if (dose) {
            dose.rotation.y = Math.sin(time * 0.001) * 0.1
            dose.rotation.z += 0.01
        }
        
        controls.update()
        renderer.render(scene, camera)
    })(0)
}

setup()

async function loadAsset_Dose(path: string) : Promise<THREE.Group> {
    return new Promise( (resolve, reject) => {
        const objLoader = new OBJLoader()
        objLoader.load(
            path,
            (obj) => {
    
                obj.children.forEach((c,i) => {
                    if (i < 2)
                        (c as THREE.Mesh).material = new THREE.MeshStandardMaterial({
                            color: 0xebbd34,
                            wireframe: false,
                        })
                    else
                    (c as THREE.Mesh).material = new THREE.MeshStandardMaterial({
                        color: 0xff0000,
                        wireframe: false,
                    })
                })
                obj.scale.set(0.007,0.007,0.007)
                obj.translateY(1)
                obj.rotateX(Math.PI/2.5)
                resolve(obj);
            },
            () => {},
            (err) => reject(err)
        )
    })
}
