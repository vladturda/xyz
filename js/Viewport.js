var Viewport = function( config ) {
  this.canvas = document.getElementById( config.canvas_id );
  this.ctx = this.canvas.getContext( '2d' );
  this.origin = { x: parseInt( this.canvas.clientWidth / 2 ), 
                  y: parseInt( this.canvas.clientHeight / 2 ) };

  this.canvas.width = this.canvas.clientWidth;
  this.canvas.height = this.canvas.clientHeight;

  this.draw = function( object_array ) { 
    this.ctx.clearRect( 0, 0, this.canvas.width, this.canvas.height );
    
    for (var o in object_array) {
      for (var f in object_array[o].faces) {
        var face = object_array[o].faces[f];
        var draw_bool = true;

        this.ctx.fillStyle = face.shader;
        this.ctx.beginPath();

        for (var p in face.projection) {
          var vertex = face.projection[p];
          if (p == 0) {
            this.ctx.moveTo( vertex.x + this.origin.x,
                             vertex.y + this.origin.y );
          } else {
            this.ctx.lineTo( vertex.x + this.origin.x,
                             vertex.y + this.origin.y );
          }

          if (vertex.z < 0) {
            draw_bool = false;
          }
        }
        
        if (draw_bool) {
          this.ctx.fill();
        }
      }
      
      /*
      this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
      this.ctx.lineWidth = '0.9';
      this.ctx.beginPath();
      for (var e in object_array[o].object.edges) {
        var edge = object_array[o].object.edges[e];
        var p_a = edge.projection[0];
        var p_b = edge.projection[1];
        if (p_a.z > 0 && p_b.z > 0) {
          this.ctx.moveTo( p_a.x + this.origin.x, 
                           p_a.y + this.origin.y );
          this.ctx.lineTo( p_b.x + this.origin.x, 
                           p_b.y + this.origin.y );
        }
      }
      this.ctx.stroke();
      */
     
      /*
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      for (var p in object_array[o].projection) {
        var p_a = object_array[o].projection[p];
        if (p_a.z > 0) {
          this.ctx.fillRect( p_a.x + this.origin.x - 1, 
                                p_a.y + this.origin.y - 1, 2, 2);
        }
      }
      */
    }
  };

  window.addEventListener('resize', function( event ) { 
    this.canvas.width = this.canvas.clientWidth;
    this.canvas.height = this.canvas.clientHeight;
    this.origin.x = parseInt( this.canvas.clientWidth / 2 );
    this.origin.y = parseInt( this.canvas.clientHeight / 2 );
  }.bind(this));    
};