THREE.Terrain = function(worldWidth, worldDepth) {
    var METER=128;

    this.worldWidth = worldWidth;
    this.worldDepth = worldDepth;
    this.meterWidth = (this.worldWidth / METER);
    this.meterDepth = (this.worldDepth / METER);


    this.width = worldWidth;
    this.height = worldDepth;
    this.widthSegments = this.meterWidth - 1;
    this.heightSegments = this.meterDepth - 1;
    
    this.geometry = new THREE.PlaneGeometry(
            this.width,
            this.height,
            this.widthSegments,
            this.heightSegments);
    
    this.geometry.applyMatrix(new THREE.Matrix4().makeRotationX( -Math.PI / 2 ));

    // Generate data (flat for now)
    var size = this.meterWidth * this.meterDepth, data = new Float32Array(size);
    for(var i = 0; i < size; i++) {
        data[i] = 0;
    }

    // Apply height map to geometry
    for(var i = 0, l = this.geometry.vertices.length; i < l; i++) {
        this.geometry.vertices[i].y = data[i];
    }

    // Generate texture, also responsible for "sun lighting" -- TODO!
    texture = new THREE.Texture(generateTexture(data, this.meterWidth, this.meterDepth), new THREE.UVMapping(), THREE.ClampToEdgeWrapping, THREE.ClampToEdgeWrapping);
    texture.needsUpdate = true;

    // Aaaaand make the mesh
    this.mesh = new THREE.Mesh(this.geometry, new THREE.MeshBasicMaterial({map: texture}));
}

function generateTexture( data, width, height ) {

    var canvas, canvasScaled, context, image, imageData,
    level, diff, vector3, sun, shade;

    vector3 = new THREE.Vector3( 0, 0, 0 );

    sun = new THREE.Vector3( 1, 1, 1 );
    sun.normalize();

    canvas = document.createElement( 'canvas' );
    canvas.width = width;
    canvas.height = height;

    context = canvas.getContext( '2d' );
    context.fillStyle = '#000';
    context.fillRect( 0, 0, width, height );

    image = context.getImageData( 0, 0, canvas.width, canvas.height );
    imageData = image.data;

    for ( var i = 0, j = 0, l = imageData.length; i < l; i += 4, j ++ ) {

        vector3.x = data[ j - 2 ] - data[ j + 2 ];
        vector3.y = 2;
        vector3.z = data[ j - width * 2 ] - data[ j + width * 2 ];
        vector3.normalize();

        shade = vector3.dot( sun );

        imageData[ i ] = ( 96 + shade * 128 ) * ( 0.5 + data[ j ] * 0.007 );
        imageData[ i + 1 ] = ( 32 + shade * 96 ) * ( 0.5 + data[ j ] * 0.007 );
        imageData[ i + 2 ] = ( shade * 96 ) * ( 0.5 + data[ j ] * 0.007 );
    }

    context.putImageData( image, 0, 0 );

    // Scaled 4x

    canvasScaled = document.createElement( 'canvas' );
    canvasScaled.width = width * 4;
    canvasScaled.height = height * 4;

    context = canvasScaled.getContext( '2d' );
    context.scale( 4, 4 );
    context.drawImage( canvas, 0, 0 );

    image = context.getImageData( 0, 0, canvasScaled.width, canvasScaled.height );
    imageData = image.data;

    for ( var i = 0, l = imageData.length; i < l; i += 4 ) {

        var v = ~~ ( Math.random() * 5 );

        imageData[ i ] += v;
        imageData[ i + 1 ] += v;
        imageData[ i + 2 ] += v;

    }

    context.putImageData( image, 0, 0 );

    return canvasScaled;

}
