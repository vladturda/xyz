var Object3 = function( vertices = [], edges = [], faces = [] ) {
  this.vertices = [];
  this.edges = [];
  this.faces = [];

  for (var v in vertices) {
    this.vertices.push( { point: new Point( vertices[v].x, vertices[v].y, vertices[v].z ),
                          projection: new Point(),
                          shader: vertices[v].shader } );

  }

  for (var e in edges) {
    var vertex_array = [];
    for (var v_i in edges[e].vertices) {
      vertex_array.push( this.vertices[edges[e].vertices[v_i]] );
    }

    this.edges.push( { vertices: vertex_array,
                       quadratic: edges[e].quadratic,
                       shader: edges[e].shader } );
  }

  for (var f in faces) {
    var vertex_array = [];
    for (var v_i in faces[f].vertices) {
      vertex_array.push( this.vertices[faces[f].vertices[v_i]] );
    }

    this.faces.push( { vertices: vertex_array,
                       quadratic: faces[f].quadratic,
                       stroke: faces[f].stroke,
                       scan: faces[f].scan,
                       shader: faces[f].shader } );
  }

  this.makeGrid = function( width, height, columns, rows, shader ) {
    this.vertices.length = 0;
    this.edges.length = 0;
    this.faces.length = 0;
    
    var column_width = width / columns;
    var row_height = height / rows;

    for (var r = 0; r <= height; r+=row_height) {
      for (var c = 0; c <= width; c+=column_width) {
        this.vertices.push( { point: new Point( c - width/2, r - height/2, 0 ),
                              projection: new Point( c - width/2, r - height/2, 0 ),
                              shader: shader } );
      }
    }
    
    for (var r = 0; r <= rows; r++) {
      var vertex_array = [];

      for (var c = 0; c <= columns; c+=2) {
        vertex_array.push( this.vertices[ r * (columns+1) + c ] );
      }

      this.edges.push( { vertices: vertex_array,
                         shader: shader } );
    }

    for (var c = 0; c <= columns; c++) {
      var vertex_array = [];

      for (var r = 0; r <= rows; r++) {
        vertex_array.push( this.vertices[ r * (columns+1) + c ] );
      }

      this.edges.push( { vertices: vertex_array,
                         shader: shader } );
    }
   
    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < columns; c++) {
        var vertex_array = [ this.vertices[r * (columns+1) + c],
                             this.vertices[r * (columns+1) + c + 1],
                             this.vertices[(r+1) * (columns+1) + c + 1],
                             this.vertices[(r+1) * (columns+1) + c] ];

        this.faces.push( { vertices: vertex_array,
                           shader: shader } );
      }
    }
   
  }
};
