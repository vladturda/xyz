var CompositeObject = function( components ) {
  this.components = [];

  this.vertices = [];
  this.edges = [];
  this.faces = [];

  this.handles = [];

  this.addObject = function( object = new Object3() ) {
    this.components.push( object );

    var v_i = this.vertices.length;

    for (var v in object.vertices) {
      this.vertices.push( object.vertices[v] );
    }
  
    for (var h in object.handles) {
      this.handles.push( object.handles[h] );
    }
  
    for (var e in object.edges) {
      var vertex_array = [];

      for (var e_v in object.edges[e].vertices) {
        var v = object.vertices.indexOf( object.edges[e].vertices[e_v] ) + v_i;
        vertex_array.push( this.vertices[v] );
      }

      this.edges.push( { vertices: vertex_array, 
                         quadratic: object.edges[e].quadratic, 
                         shader: object.edges[e].shader } );
    }
  
    for (var f in object.faces) {
      var vertex_array = [];
  
      for (var f_v in object.faces[f].vertices) {
        var v = object.vertices.indexOf( object.faces[f].vertices[f_v] ) + v_i;
        vertex_array.push(this.vertices[v]);
      }
  
      this.faces.push( { vertices: vertex_array, 
                         quadratic: object.faces[f].quadratic,
                         stroke: object.faces[f].stroke,
                         scan: object.faces[f].scan,
                         shader: object.faces[f].shader } );
    }
  };

  for (var o in components) {
    this.addObject( components[o] );
  }

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
};
