/**
 * @author jtickle / http://jefftickle.com
 *
 * NOTE: This kind of sucks because unfortunately, there is no support
 * for "capturing" the mouse and getting deltas in the way you would
 * expect from a first person shooter type game.  Looks like some
 * browsers are working on that, but until the API gets ironed out,
 * we will leave this as follows:
 *
 *    WASD are for translation (walk forward/back, strafe)
 *    Arrow Keys are for looking
 *
 * TODO: Jumping
 */

THREE.FPSControls = function(object, domElement)
{
    this.object = object;
    this.target = new THREE.Vector3(0, 0, 0);

    this.movementSpeed = 100;
    this.lookSpeed = 100;

    this.lookUp = false;
    this.lookLeft = false;
    this.lookDown = false;
    this.lookRight = false;
    this.moveForward = false;
    this.moveLeft = false;
    this.moveBackward = false;
    this.moveRight = false;

    this.lat = 0;
    this.lon = 0;
    this.phi = 0;
    this.theta = 0;

    this.Xaxis = new THREE.Vector3(1, 0, 0);
    this.Yaxis = new THREE.Vector3(0, 1, 0);
    this.Zaxis = new THREE.Vector3(0, 0, 1);

    this.domElement = (domElement !== undefined) ? domElement : document;

    this.handleResize = function() {
        if(this.domElement === document) {
            this.viewHalfX = window.innerWidth / 2;
            this.viewHalfY = window.innerHeight / 2;
        } else {
            this.viewHalfX = this.domElement.offsetWidth / 2;
            this.viewHalfY = this.domElement.offsetHeight / 2;
        }
    };

    this.onKeyDown = function(event) {
        switch(event.keyCode) {
            case 38: // up
                this.lookUp = true; prevent(event); break;
            case 37: // left
                this.lookLeft = true; prevent(event); break;
            case 40: // down
                this.lookDown = true; prevent(event); break;
            case 39: // right
                this.lookRight = true; prevent(event); break;
            case 87: // W
                this.moveForward = true; prevent(event); break;
            case 65: // A
                this.moveLeft = true; prevent(event); break;
            case 83: // S
                this.moveBackward = true; prevent(event); break;
            case 68: // D
                this.moveRight = true; prevent(event); break;
        }
    };

    var prevent = function(event) {
        event.preventDefault();
        event.stopPropagation();
    }

    this.onKeyUp = function(event) {
        switch(event.keyCode) {
            case 38: // up
                this.lookUp = false; prevent(event); break;
            case 37: // left
                this.lookLeft = false; prevent(event); break;
            case 40: // down
                this.lookDown = false; prevent(event); break;
            case 39: // right
                this.lookRight = false; prevent(event); break;
            case 87: // W
                this.moveForward = false; prevent(event); break;
            case 65: // A
                this.moveLeft = false; prevent(event); break;
            case 83: // S
                this.moveBackward = false; prevent(event); break;
            case 68: // D
                this.moveRight = false; prevent(event); break;
        }

    };
                
    this.update = function(delta) {
        var actualMoveSpeed = 0;
        var actualLookSpeed = 0;

        actualMoveSpeed = delta * this.movementSpeed;

        var actualLookSpeed = delta * this.lookSpeed;

        if(this.lookUp)    this.lat += actualLookSpeed;
        if(this.lookDown)  this.lat -= actualLookSpeed;
        if(this.lookRight) this.lon += actualLookSpeed;
        if(this.lookLeft)  this.lon -= actualLookSpeed;

        this.lat = Math.max(-85, Math.min(85, this.lat));

        this.phi   = THREE.Math.degToRad(90 - this.lat);
        this.theta = THREE.Math.degToRad(this.lon);

        var targetPosition = this.target, position = this.object.position;

        targetPosition.x = position.x + 100 * Math.sin(this.phi) * Math.cos(this.theta);
        targetPosition.y = position.y + 100 * Math.cos(this.phi);
        targetPosition.z = position.z + 100 * Math.sin(this.phi) * Math.sin(this.theta);

        this.object.lookAt(targetPosition);

        if(!this.moveForward && !this.moveBackward && !this.moveLeft && !this.moveRight)
            return;

        var moveTheta;
        if( this.moveForward && !this.moveBackward && !this.moveLeft && !this.moveRight)
            moveTheta = 0;
        if( this.moveForward && !this.moveBackward && !this.moveLeft &&  this.moveRight)
            moveTheta = 45;
        if(!this.moveForward && !this.moveBackward && !this.moveLeft &&  this.moveRight)
            moveTheta = 90;
        if(!this.moveForward &&  this.moveBackward && !this.moveLeft &&  this.moveRight)
            moveTheta = 135;
        if(!this.moveForward &&  this.moveBackward && !this.moveLeft && !this.moveRight)
            moveTheta = 180;
        if(!this.moveForward &&  this.moveBackward &&  this.moveLeft && !this.moveRight)
            moveTheta = 225;
        if(!this.moveForward && !this.moveBackward &&  this.moveLeft && !this.moveRight)
            moveTheta = 270;
        if( this.moveForward && !this.moveBackward &&  this.moveLeft && !this.moveRight)
            moveTheta = 315;

        moveTheta = THREE.Math.degToRad((moveTheta + this.lon) % 360);

        this.object.position.x += actualMoveSpeed * Math.cos(moveTheta);
        this.object.position.z += actualMoveSpeed * Math.sin(moveTheta);
    }

    this.domElement.addEventListener('keydown', bind(this, this.onKeyDown), false);
    this.domElement.addEventListener('keyup', bind(this, this.onKeyUp), false);

    function bind(scope, fn) {
        return function() {
            fn.apply(scope, arguments);
        };
    };

    this.handleResize();
}
