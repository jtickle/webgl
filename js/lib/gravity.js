/**
 * @author jtickle / http://jefftickle.com
 *
 * This applies gravity to a given object.
 */

THREE.Gravity = function(object, ground)
{
    this.object = object;
    this.ground = ground;
    this.force = 100;
    this.v = 0;

    this.vector = new THREE.Vector3(0, -1, 0);
    this.vector.normalize();

    this.update = function(delta) {
        this.v += this.force * delta;
        this.object.position.y -= this.v * delta;
    }
}
