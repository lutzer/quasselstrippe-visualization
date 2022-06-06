import * as THREE from 'three'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import axios from "axios"
import * as _ from 'lodash'
import { has, random } from 'lodash'

const API_ADDRESS = "/api/submissions/"
const API_FETCH_INTERVAL = 5000

type Submission = {
    id : string,
    data : { time: number, value: string, topic: string }[],
    timestamp: number
}

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

    // add dose
    var dose: THREE.Group = await loadAsset_Dose('./assets/dose3.obj')
    scene.add(dose)

    //add cable
    // const geometry = createCableSpline(50)
    // const material = new THREE.LineBasicMaterial( { color: 0xff0000 } );
    // const curveObject = new THREE.Line( geometry, material );
    // scene.add(curveObject)

    // fetch submissions every few seconds
    setInterval(() => {
        fetchSubmissions().then((entries) => {
            let submission = _.sample(entries)
            if (submission)
                displaySubmission(submission, _.random(0, submission.data.length))
        }).catch((err) => console.error(err))
    }, API_FETCH_INTERVAL)
    

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
            dose.rotation.z += 0.015
        }
        
        controls.update()
        renderer.render(scene, camera)
    })(0)
}

setup()

function createCableSpline( numberOfPoints: number) : THREE.BufferGeometry {
    const curve = new THREE.CatmullRomCurve3( [
        new THREE.Vector3( -10, 0, 10 ),
        new THREE.Vector3( -5, 5, 5 ),
        new THREE.Vector3( 0, 0, 0 ),
        new THREE.Vector3( 5, -5, 5 ),
        new THREE.Vector3( 10, 0, 10 )
    ] );
    const points = curve.getPoints(numberOfPoints);
    return new THREE.BufferGeometry().setFromPoints( points );
}

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

async function fetchSubmissions() : Promise<Submission[]> {

    const queryString = window.location.search; 
    const urlParams = new URLSearchParams(queryString);
    const username = urlParams.get('username') || ""
    const password = urlParams.get('password') || ""

    let result = await axios.get(API_ADDRESS, {
        auth: {
            username: username,
            password: password
          }
    })
    return result.data.entries.map((e : any) => e.data);
}

function displaySubmission(submission: Submission, entryIndex: number) {
    if (submission.data.length < entryIndex)
        return
    let entry = submission.data[entryIndex];
    if (!_.has(entry,"topic") || !_.has(entry,"value"))
        return;
    
    var questionElement = document.getElementById("question");
    var answerElement = document.getElementById("answer");

    if (questionElement)
        questionElement.innerHTML = submission.data[entryIndex].topic || ""
    if (answerElement)
        answerElement.innerHTML = submission.data[entryIndex].value || ""
}
