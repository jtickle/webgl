/**
 * @author jtickle / http://jefftickle.com
 *
 * This applies gravity to a given object.
 */

THREE.Gravity = function(object)
{
    this.object = object;
    this.force = 9.81 * 128;
    this.v = 0;

    this.vector = new THREE.Vector3(0, -1, 0);
    this.vector.normalize();

    this.update = function(delta) {
        this.v += this.force * delta;
        this.object.position.y -= this.v * delta;
    }
}
