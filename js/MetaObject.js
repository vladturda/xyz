var MetaObject = function( object, metadata ) {
  this.object = object;

  this.vertices = [];
  this.projection = [];

  this.edges = [];
  this.faces = [];

  for (var v in object.vertices) {
    this.vertices.push( new Point( object.vertices[v].x,
                                   object.vertices[v].y,
                                   object.vertices[v].z ) );

    this.projection.push( new Point( object.projection[v].x,
                                     object.projection[v].y,
                                     object.projection[v].z ) );
  }

  for (var e in object.edges) {
    var v_a = object.vertices.indexOf( object.edges[e].vertices[0] );
    var v_b = object.vertices.indexOf( object.edges[e].vertices[1] );

    this.edges.push( { vertices: [ this.vertices[v_a], this.vertices[v_b] ],
                       projection: [ this.projection[v_a], this.projection[v_b] ] } );
  }

  for (var f in object.faces) {
    var vertex_array = [];
    var projection_array = [];

    for (var v_i in object.faces[f].vertices) {
      var v = object.vertices.indexOf( object.faces[f].vertices[v_i] );
      vertex_array.push(this.vertices[v]);
      projection_array.push(this.projection[v]);
    }

    this.faces.push( { vertices: vertex_array, 
                       projection: projection_array,
                       shader: object.faces[f].shader } );
  }

  this.scale = new Vector();
  this.rotation = new Vector();
  this.position = new Vector();

  this.updateMeta = function( meta ) {
    this.scale.x = meta.scale.x;
    this.scale.y = meta.scale.y;
    this.scale.z = meta.scale.z;
    
    this.rotation.x = meta.rotation.x;
    this.rotation.y = meta.rotation.y;
    this.rotation.z = meta.rotation.z;
    
    this.position.x = meta.position.x;
    this.position.y = meta.position.y;
    this.position.z = meta.position.z;
    
    var position_matrix = this.position.matrix();
    var rotation_matrix = new Matrix();
    var vector_matrix = new Matrix();
    var degrees = 0;
    
    for (var v in this.object.vertices) {
      vector_matrix.rows[0][0] = this.object.vertices[v].x * this.scale.x;
      vector_matrix.rows[1][0] = this.object.vertices[v].y * this.scale.y;
      vector_matrix.rows[2][0] = this.object.vertices[v].z * this.scale.z;

      degrees = this.rotation.x * Math.PI / 180;
      rotation_matrix.rows[0] = [1, 0, 0];
      rotation_matrix.rows[1] = [0, Math.cos( degrees ), Math.sin( degrees )];
      rotation_matrix.rows[2] = [0, -Math.sin( degrees ), Math.cos( degrees )];
      vector_matrix = rotation_matrix.multiply(vector_matrix);

      degrees = this.rotation.y * Math.PI / 180;
      rotation_matrix.rows[0] = [Math.cos( degrees ), 0, -Math.sin( degrees )];
      rotation_matrix.rows[1] = [0, 1, 0];
      rotation_matrix.rows[2] = [Math.sin( degrees ), 0, Math.cos( degrees )];
      vector_matrix = rotation_matrix.multiply(vector_matrix);

      degrees = this.rotation.z * Math.PI / 180;
      rotation_matrix.rows[0] = [Math.cos( degrees ), Math.sin( degrees ), 0];
      rotation_matrix.rows[1] = [-Math.sin( degrees ), Math.cos( degrees ), 0];
      rotation_matrix.rows[2] = [0, 0, 1];
      vector_matrix = rotation_matrix.multiply(vector_matrix);
      
      vector_matrix = vector_matrix.add(position_matrix);

      this.vertices[v].x = vector_matrix.rows[0][0];
      this.vertices[v].y = vector_matrix.rows[1][0];
      this.vertices[v].z = vector_matrix.rows[2][0];
    }
  };

  this.updateMeta( metadata );
};