/*
 * Walkabout - A WebGL implementation of walking around on a terrain using standard FPS controls.
 * Copyright (C) 2013 Jeff Tickle
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * This example is based on http://mrdoob.github.com/three.js/examples/webgl_geometry_terrain.html.
 * Someone please let me know if I am in some kind of license violation here, but I figured since
 * these are example implementations of a GPLv3 library, you know...
 */
if(!Detector.webgl) {
    Detector.addGetWebGLMessage();
    document.getElementById('container').innerHTML = "";
}

var container, stats;

var camera, controls, scene, renderer, gravity;

var terrain;

var worldWidth = (64 * 128), worldDepth = (64 * 128)
var worldHalfWidth = worldWidth / 2, worldHalfDepth = worldDepth / 2;

var clock = new THREE.Clock();

init();
animate();

function init() {
    container = document.getElementById( 'container' );

    camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 20000 );
    camera.position.y = (2 * 128) + (10*128);

    scene = new THREE.Scene();

    terrain = new THREE.Terrain(worldWidth, worldDepth);
    scene.add( terrain.mesh );

    gravity = new THREE.Gravity(camera, 1);
    controls = new THREE.FPSControls(camera, gravity);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );

    container.innerHTML = "";

    container.appendChild( renderer.domElement );

    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
    container.appendChild( stats.domElement );

    window.addEventListener( 'resize', onWindowResize, false );
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

    controls.handleResize();
}

function animate() {
    requestAnimationFrame(animate);
    render();
    stats.update();
}

function render() {
    var delta = clock.getDelta();
    controls.update(delta);
    gravity.update(delta);
    updateCollision();
    renderer.render(scene, camera);
}

function updateCollision() {
    if(camera.position.y < (2 * 128)) {
        camera.position.y = (2 * 128);
        gravity.v = 0;
    }
}

