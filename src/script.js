import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color(0xffffff)

// Objects
addContainer(4,4,4, scene)
addBox(1,1,2, 0,0,0, 0x2faf49, 'Box ABC', scene)
addBox(1,4,1, 1,0,0, 0xfab666, 'Box DEF', scene)
addBox(3,1,1, 0,1,0, 0x509ed8, 'Box GHI', scene)
addBox(2,3,3, 1,1,0, 0xf1c232, 'Box JKL', scene)
addBox(1,1,4, 1,3,0, 0x509ed8, 'Box MNO', scene)
addBox(2,2,1, 2,0,3, 0x2faf49, 'Box PQR', scene)

// Lights
scene.add(new THREE.AmbientLight( 0xffffff ))

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 8
camera.position.y = 4
camera.position.z = -8
scene.add(camera)

const pointLight = new THREE.PointLight( 0xffffff, 0.25 );
camera.add( pointLight );

// Controls
const controls = new OrbitControls(camera, canvas)
controls.update()

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 16))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Update Orbital Controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

function wireIt(object){
    var geo = new THREE.EdgesGeometry( object.geometry )
    var mat = new THREE.LineBasicMaterial( { color: 0x000000, linewidth: 4 } )
    var wireframe = new THREE.LineSegments( geo, mat )
    wireframe.renderOrder = 1
    object.add( wireframe )
}

function addBox(l, w, h, x, y, z, color, name, scene){
    const cubeGeo = new THREE.BoxGeometry(w,h,l)

    // Materials
    const cubeMat = new THREE.MeshStandardMaterial({color: color
    // ,transparent: true, opacity: 0.2
    })

    // Mesh
    const cube = new THREE.Mesh(cubeGeo, cubeMat)

    cube.position.set(x + w / 2, z + h / 2, y + l / 2)

    wireIt(cube)

    addText(name, cube, l, w)
    addTextOnSide(name, cube, l, w)

    scene.add(cube)
}

function addContainer(l, w, h, scene){
    const containerGeo = new THREE.BoxGeometry(4,4,4,4,4,4)
    const wireframe = new THREE.WireframeGeometry( containerGeo );
    var mat = new THREE.LineBasicMaterial( { color: 0x000000, linewidth: 4 } )
    const container = new THREE.LineSegments( wireframe , mat);
    container.material.depthTest = true;
    container.material.opacity = 0.25;
    container.material.transparent = true;

    container.position.set(0 + l / 2, 0 + h / 2, 0 + w / 2)

    scene.add(container)
}

function addText(text, cube, l, w) {
    var loader = new THREE.FontLoader()
    loader.load( 'helvetiker_regular.typeface.json', function ( font ) {
        const textSize = 0.2
        var textGeo = new THREE.TextGeometry( text, {
            font: font,

            size: textSize,
            height: 0,
            curveSegments: 100,
        } );

        var textMaterial = new THREE.MeshPhongMaterial( { color: 0x000000 } );

        textGeo.computeBoundingBox()
        const textWidth = textGeo.boundingBox.max.x

        if (textWidth > w) {
            return;
        }

        var textMesh = new THREE.Mesh( textGeo, textMaterial );
        textMesh.position.set(0 + textWidth / 2 ,0 - textSize / 2, 0 - l / 2 - 0.01)
        textMesh.rotation.y = Math.PI

        cube.add( textMesh );
    } )
}

function addTextOnSide(text, cube, l, w) {
    var loader = new THREE.FontLoader()
    loader.load( 'helvetiker_regular.typeface.json', function ( font ) {
        const textSize = 0.2
        var textGeo = new THREE.TextGeometry( text, {
            font: font,

            size: textSize,
            height: 0,
            curveSegments: 100,
        } );

        var textMaterial = new THREE.MeshPhongMaterial( { color: 0xff0000 } );

        textGeo.computeBoundingBox()
        const textWidth = textGeo.boundingBox.max.x

        if (textWidth > l) {
            return;
        }

        var textMesh = new THREE.Mesh( textGeo, textMaterial );
        textMesh.position.set(0 - w / 2 - 0.01 ,0 - textSize / 2, 0 - textWidth / 2)
        textMesh.rotation.y = Math.PI + (Math.PI / 2)

        cube.add( textMesh );
    } )
}


