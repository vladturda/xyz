var CompositeObject = function( components ) {
  this.components = [];

  this.vertices = [];
  this.edges = [];
  this.faces = [];

  this.projection = [];

  this.addObject = function( object = new Object3() ) {
    this.components.push( object );

    var v_i = this.vertices.length;

    for (var v in object.vertices) {
      this.vertices.push( new Point( object.vertices[v].x,
                                     object.vertices[v].y,
                                     object.vertices[v].z ) );
  
      this.projection.push( new Point( object.projection[v].x,
                                       object.projection[v].y,
                                       object.projection[v].z ) );
    }
  
    for (var e in object.edges) {
      var v_a = object.vertices.indexOf( object.edges[e].vertices[0] ) + v_i;
      var v_b = object.vertices.indexOf( object.edges[e].vertices[1] ) + v_i;
  
      this.edges.push( { vertices: [ this.vertices[v_a], this.vertices[v_b] ],
                         projection: [ this.projection[v_a], this.projection[v_b] ] } );
    }
  
    for (var f in object.faces) {
      var vertex_array = [];
      var projection_array = [];
  
      for (var f_v in object.faces[f].vertices) {
        var v = object.vertices.indexOf( object.faces[f].vertices[f_v] ) + v_i;
        vertex_array.push(this.vertices[v]);
        projection_array.push(this.projection[v]);
      }
  
      this.faces.push( { vertices: vertex_array, 
                         projection: projection_array,
                         shader: object.faces[f].shader } );
    }
  };

  for (var o in components) {
    this.addObject( components[o] );
  }
};