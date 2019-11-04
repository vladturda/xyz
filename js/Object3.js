var Object3 = function( vertices = [], edges = [], faces = [] ) {
  this.vertices = [];
  this.edges = [];
  this.faces = [];

  this.projection = [];

  for (var v in vertices) {
    this.vertices.push( new Point( vertices[v].x, vertices[v].y, vertices[v].z ) );
    this.projection.push( new Point() );
  }

  for (var e in edges) {
      this.edges.push( { vertices: [ this.vertices[edges[e][0]], 
                                     this.vertices[edges[e][1]] ],
                         projection: [ this.projection[edges[e][0]], 
                                       this.projection[edges[e][1]] ] } );
  }

  for (var f in faces) {
      var vertex_array = [];
      var projection_array = [];

      for (var v_i in faces[f].vertices) {
        vertex_array.push( this.vertices[faces[f].vertices[v_i]] );
        projection_array.push( this.projection[faces[f].vertices[v_i]] );
      }

      this.faces.push( { vertices: vertex_array,
                         projection: projection_array,
                         shader: faces[f].shader } );
  }
};