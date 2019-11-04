var Viewport = function( config ) {
  this.canvas = document.getElementById( config.canvas_id );
  this.ctx = this.canvas.getContext( '2d' );

  this.origin = { x: Math.round( this.canvas.clientWidth / 2 ), 
                  y: Math.round( this.canvas.clientHeight / 2 ) };

  this.canvas.width = this.canvas.clientWidth;
  this.canvas.height = this.canvas.clientHeight;

  this.shader_buffer = document.createElement('canvas');
  this.shader_ctx = this.shader_buffer.getContext('2d');
  
  this.mode = { type: 'view' };
  this.zoom = 1;
  this.focal_length = config.focal_length;

  //var image_data = this.ctx.getImageData( 0, 0, this.canvas.width, this.canvas.height );

  this.draw = function( object_array ) {
    //this.ctx.clearRect( 0, 0, this.canvas.width, this.canvas.height );
    //for (var i = 0; i < image_data.data.length; i+= 4) {
    //  image_data.data[i] = 255;
    //  image_data.data[i+1] = 255;
    //  image_data.data[i+2] = 255;
    //}

    this.ctx.fillStyle = config.fill;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    //this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (var o in object_array) {
      for (var f in object_array[o].faces) {
        var face = object_array[o].faces[f];
        var point_count = 0;
        
        if (face.shader[0]) {
          if (face.shader[0].type == 'solid') {
            var r = face.shader[0].data.fill.r;
              
              
            var g = face.shader[0].data.fill.g;
            var b = face.shader[0].data.fill.b;
            var a = face.shader[0].data.fill.a;
            this.ctx.fillStyle = 'rgba('+r+','+g+','+b+','+a+')';
            this.ctx.strokeStyle = 'rgba('+r+','+g+','+b+','+a+')';
            this.ctx.lineWidth = face.shader[0].data.width;
          } else if (face.shader[0].type == 'gradient') {
            var gradient = this.ctx.createLinearGradient( (face.vertices[face.shader[0].data.from].projection.x  + this.origin.x), 
                                                                 (face.vertices[face.shader[0].data.from].projection.y  + this.origin.y), 
                                                                 (face.vertices[face.shader[0].data.to].projection.x + this.origin.x), 
                                                                 (face.vertices[face.shader[0].data.to].projection.y  + this.origin.y) );                                        
            for (var s in face.shader[0].data.stops) {
              gradient.addColorStop( face.shader[0].data.stops[s].p, face.shader[0].data.stops[s].value );
            }
            this.ctx.fillStyle = gradient;
            this.ctx.strokeStyle = gradient;
            this.ctx.lineWidth = face.shader[0].data.width;
          }

          if (face.stroke) {
            var strokes = 0;
            var stroke_increment = [];
            var p_initial = [];
            var p_current = [];

            for (var l = 0; l < face.stroke.to.length; l++) {
              var d_x = face.vertices[face.stroke.to[l]].projection.x - face.vertices[face.stroke.from[l]].projection.x;
              var d_y = face.vertices[face.stroke.to[l]].projection.y - face.vertices[face.stroke.from[l]].projection.y;

              var length = Math.max( Math.abs( d_x ), Math.abs( d_y ) );
              strokes = length > strokes ? length : strokes;
            }
            
            for (var l = 0; l < face.stroke.from.length; l++) {              
              p_initial.push( { x: face.vertices[face.stroke.from[l]].projection.x,
                                y: face.vertices[face.stroke.from[l]].projection.y } );

              stroke_increment.push({ x: (face.vertices[face.stroke.to[l]].projection.x - face.vertices[face.stroke.from[l]].projection.x) / strokes, 
                                      y: (face.vertices[face.stroke.to[l]].projection.y - face.vertices[face.stroke.from[l]].projection.y) / strokes });
            }

            this.ctx.beginPath();
            var s_i = this.ctx.lineWidth - 1 > 0 ? this.ctx.lineWidth - 1 : 1;
            for (var s = 0; s < strokes; s += s_i) {
              p_current.length = 0;

              for (var p = 0; p < p_initial.length; p++) {
                p_current.push( { x: Math.round(p_initial[p].x + stroke_increment[p].x * s), 
                                  y: Math.round(p_initial[p].y + stroke_increment[p].y * s) } );
              }

              for (var p = 0; p < p_current.length; p++) {
                if (p == 0) {
                  this.ctx.moveTo( p_current[p].x + this.origin.x,
                                   p_current[p].y + this.origin.y );
                } else {
                  if (face.quadratic && face.quadratic[p] && p_current[p+1]) {
                    this.ctx.quadraticCurveTo( p_current[p].x + this.origin.x, 
                                               p_current[p].y + this.origin.y, 
                                               p_current[p+1].x + this.origin.x, 
                                               p_current[p+1].y + this.origin.y );
                  } else {
                    this.ctx.lineTo( p_current[p].x + this.origin.x,
                                     p_current[p].y + this.origin.y );
                  }
                }
              }
            }

           this.ctx.stroke();
            
          } else {
            this.ctx.beginPath();

            for (var v = 0; v < face.vertices.length; v++) {
              if (face.vertices[v].projection.z > 0) {
                if (point_count) {
                  if (face.quadratic && face.quadratic[v] && face.vertices[v+1]) {
                    this.ctx.quadraticCurveTo( face.vertices[v].projection.x + this.origin.x, 
                                               face.vertices[v].projection.y + this.origin.y, 
                                               face.vertices[v+1].projection.x + this.origin.x, 
                                               face.vertices[v+1].projection.y + this.origin.y );
                  } else {
                    this.ctx.lineTo( face.vertices[v].projection.x + this.origin.x,
                                     face.vertices[v].projection.y + this.origin.y );
                  }

                } else {
                  this.ctx.moveTo( face.vertices[v].projection.x + this.origin.x,
                                   face.vertices[v].projection.y + this.origin.y );
                }

                point_count++;
              }
            }

            if (point_count > 2) { this.ctx.fill(); }
          }
        }
      }

      for (var e in object_array[o].edges) {
        var edge = object_array[o].edges[e];
        var point_count = 0;

        if (edge.shader[0]) {
          if (edge.shader[0].type == 'solid') {
            var r = edge.shader[0].data.fill.r;
            var g = edge.shader[0].data.fill.g;
            var b = edge.shader[0].data.fill.b;
            var a = edge.shader[0].data.fill.a;

            this.ctx.beginPath();

            this.ctx.strokeStyle = 'rgba('+r+','+g+','+b+','+a+')';
            this.ctx.lineWidth = edge.shader[0].data.width;
          } else if (edge.shader[0].type == 'gradient') {
            var gradient = this.ctx.createLinearGradient( edge.vertices[edge.shader[0].data.from].projection.x  + this.origin.x, 
                                                                 edge.vertices[edge.shader[0].data.from].projection.y  + this.origin.y, 
                                                                 edge.vertices[edge.shader[0].data.to].projection.x + this.origin.x, 
                                                                 edge.vertices[edge.shader[0].data.to].projection.y  + this.origin.y );       
            for (var s in edge.shader[0].data.stops) {
              gradient.addColorStop( edge.shader[0].data.stops[s].p, edge.shader[0].data.stops[s].value );
            }

            this.ctx.strokeStyle = gradient;
            this.ctx.lineWidth = edge.shader[0].data.width;
          }

          for (var v = 0; v < edge.vertices.length; v++) {
            var vertex = edge.vertices[v];

            if (vertex.projection.z > 0) {
              if (point_count) {
                if (edge.quadratic && edge.quadratic[v] && edge.vertices[v + 1]) {
                  this.ctx.quadraticCurveTo( vertex.projection.x + this.origin.x, 
                                             vertex.projection.y + this.origin.y, 
                                             edge.vertices[v + 1].projection.x + this.origin.x, 
                                             edge.vertices[v + 1].projection.y + this.origin.y );
                } else {
                  this.ctx.lineTo( vertex.projection.x + this.origin.x,
                                   vertex.projection.y + this.origin.y );
                }

              } else {
                this.ctx.moveTo( vertex.projection.x + this.origin.x,
                                 vertex.projection.y + this.origin.y );
              }

              point_count++;
            }
          }

          if (point_count > 1) { this.ctx.stroke(); }
        }
      }
      
      
      for (var v in object_array[o].vertices) {
        var vertex = object_array[o].vertices[v];
        
        if (vertex.shader && vertex.shader[0]) {
          if (vertex.shader[0].type == 'solid') {
            var r = vertex.shader[0].data.fill.r;
            var g = vertex.shader[0].data.fill.g;
            var b = vertex.shader[0].data.fill.b;
            var a = vertex.shader[0].data.fill.a;
            this.ctx.fillStyle = 'rgba('+r+','+g+','+b+','+a+')';

            var radius = vertex.shader[0].data.radius * this.focal_length / vertex.projection.z;
            var diameter = radius * 2;
          }

        if (vertex.shader[1]) {
          if (vertex.shader[1].type == 'solid') {
            var r = vertex.shader[1].data.fill.r;
            var g = vertex.shader[1].data.fill.g;
            var b = vertex.shader[1].data.fill.b;
            var a = vertex.shader[1].data.fill.a;

            this.ctx.strokeStyle = 'rgba('+r+','+g+','+b+','+a+')';
            this.ctx.lineWidth = vertex.shader[1].data.width;
          }
        }
          
          if (vertex.projection.z > 0) {
            if (vertex.projection.z > object_array[0].vertices[0].projection.z) {
              this.ctx.fillRect( vertex.projection.x + this.origin.x - radius, 
                                 vertex.projection.y + this.origin.y - radius, 
                                 diameter, diameter);

              this.ctx.beginPath();
              this.ctx.moveTo( object_array[0].vertices[0].projection.x + this.origin.x,
                               object_array[0].vertices[0].projection.y + this.origin.y );
              this.ctx.lineTo( vertex.projection.x + this.origin.x,
                               vertex.projection.y + this.origin.y );
              this.ctx.stroke();
            } else {
              this.ctx.beginPath();
              this.ctx.moveTo( object_array[0].vertices[0].projection.x + this.origin.x,
                               object_array[0].vertices[0].projection.y + this.origin.y );
              this.ctx.lineTo( vertex.projection.x + this.origin.x,
                               vertex.projection.y + this.origin.y );
              this.ctx.stroke();

              this.ctx.fillRect( vertex.projection.x + this.origin.x - radius, 
                                 vertex.projection.y + this.origin.y - radius, 
                                 diameter, diameter);
            }

          }
        }
      }
      
    }
  };

  window.addEventListener('resize', function( event ) { 
    this.canvas.width = this.canvas.clientWidth;
    this.canvas.height = this.canvas.clientHeight;
    this.origin.x = Math.round( this.canvas.clientWidth / 2 );
    this.origin.y = Math.round( this.canvas.clientHeight / 2 );
  }.bind(this));    
};
