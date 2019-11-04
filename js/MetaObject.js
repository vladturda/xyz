var MetaObject = function( metadata ) {
  this.object = metadata.object;

  this.vertices = [];
  this.edges = [];
  this.faces = [];

  for (var v in this.object.vertices) {
    this.vertices.push( { point: new Point( this.object.vertices[v].point.x,
                                            this.object.vertices[v].point.y,
                                            this.object.vertices[v].point.z ),
                          projection: new Point( this.object.vertices[v].projection.x,
                                                 this.object.vertices[v].projection.y,
                                                 this.object.vertices[v].projection.z ),
                          shader: this.object.vertices[v].shader } );
  }

  for (var e in this.object.edges) {
    var vertex_array = [];

    for (var v_i in this.object.edges[e].vertices) {
      var v = this.object.vertices.indexOf( this.object.edges[e].vertices[v_i] );
      vertex_array.push( this.vertices[v] );
    }

    this.edges.push( { vertices: vertex_array, 
                       quadratic: this.object.edges[e].quadratic, 
                       shader: this.object.edges[e].shader } );
  }

  for (var f in this.object.faces) {
    var vertex_array = [];

    for (var v_i in this.object.faces[f].vertices) {
      var v = this.object.vertices.indexOf( this.object.faces[f].vertices[v_i] );
      vertex_array.push(this.vertices[v]);
    }

    this.faces.push( { vertices: vertex_array, 
                       quadratic: this.object.faces[f].quadratic, 
                       stroke: this.object.faces[f].stroke,
                       scan: this.object.faces[f].scan,
                       shader: this.object.faces[f].shader } );
  }

  this.scale = new Vector(1, 1, 1);
  this.rotation = new Vector(0, 0, 0);
  this.position = new Vector(0, 0, 0);
  this.handles = [];

  this.updateMeta = function( meta ) {
    var vertex_array = [[], [], []];
    
    if (meta.scale) {
      this.scale.x *= meta.scale.x;
      this.scale.y *= meta.scale.y;
      this.scale.z *= meta.scale.z;
    }
    
    if (meta.rotation) {
      this.rotation.x += meta.rotation.x;
      this.rotation.y += meta.rotation.y;
      this.rotation.z += meta.rotation.z;

      var rotation_matrix = new Matrix();
      var degrees = 0;
    }

    if (meta.position) {
      this.position.x += meta.position.x;
      this.position.y += meta.position.y;
      this.position.z += meta.position.z;
    }

    if (meta.handles) {
      this.handles.length = 0;
      for ( var v in this.vertices ) {
        this.handles.push( new Handle( this.vertices[v], meta.handles ) );
      }
    }
    
    
    for (var v in this.vertices) {
      vertex_array[0][0] = this.vertices[v].point.x;
      vertex_array[1][0] = this.vertices[v].point.y;
      vertex_array[2][0] = this.vertices[v].point.z;

      if (meta.scale) {
        vertex_array[0][0] *= meta.scale.x;
        vertex_array[1][0] *= meta.scale.y;
        vertex_array[2][0] *= meta.scale.z;
      }

      if (meta.rotation) {
        if (meta.rotation.x) {
          degrees = meta.rotation.x * Math.PI / 180;
          rotation_matrix.rows[0] = [1, 0, 0];
          rotation_matrix.rows[1] = [0, Math.cos( degrees ), Math.sin( degrees )];
          rotation_matrix.rows[2] = [0, -Math.sin( degrees ), Math.cos( degrees )];
          vertex_array = rotation_matrix.multiply_array(vertex_array);
        }

        if (meta.rotation.y) {
          degrees = meta.rotation.y * Math.PI / 180;
          rotation_matrix.rows[0] = [Math.cos( degrees ), 0, -Math.sin( degrees )];
          rotation_matrix.rows[1] = [0, 1, 0];
          rotation_matrix.rows[2] = [Math.sin( degrees ), 0, Math.cos( degrees )];
          vertex_array = rotation_matrix.multiply_array(vertex_array);
        }

        if (meta.rotation.z) {
          degrees = meta.rotation.z * Math.PI / 180;
          rotation_matrix.rows[0] = [Math.cos( degrees ), Math.sin( degrees ), 0];
          rotation_matrix.rows[1] = [-Math.sin( degrees ), Math.cos( degrees ), 0];
          rotation_matrix.rows[2] = [0, 0, 1];
          vertex_array = rotation_matrix.multiply_array(vertex_array);
        }
      }

      if (meta.position) {
        vertex_array[0][0] += meta.position.x;
        vertex_array[1][0] += meta.position.y;
        vertex_array[2][0] += meta.position.z;
      }

      this.vertices[v].point.x = vertex_array[0][0];
      this.vertices[v].point.y = vertex_array[1][0];
      this.vertices[v].point.z = vertex_array[2][0];
    }
  };

  this.sortFaces = function() {
    this.faces.sort(function(a, b) {
      a_max = Math.max(a.vertices[0].projection.z, a.vertices[1].projection.z, a.vertices[2].projection.z, a.vertices[3].projection.z);
      b_max = Math.max(b.vertices[0].projection.z, b.vertices[1].projection.z, b.vertices[2].projection.z, b.vertices[3].projection.z);
      return b_max - a_max; 
    });
  };

  this.sortEdges = function() {
    this.edges.sort(function(a, b) {
      a_max = Math.max(a.vertices[0].projection.z, a.vertices[1].projection.z);
      b_max = Math.max(b.vertices[0].projection.z, b.vertices[1].projection.z);
      return b_max - a_max; 
    });
  };

  this.sortVertices = function() {
    this.vertices.sort(function(a, b) {
      return b.projection.z - a.projection.z; 
    });
  };
  
  if (metadata) {
    this.updateMeta( metadata );
  }
};
