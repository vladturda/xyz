var Point = function( x = 0, y = 0, z = 0 ) {
    this.x = x;
    this.y = y;
    this.z = z;

    this.getLineToPoint = function( p2 = new Point() ) {
      return new Line( { x: p2.x - this.x, y: p2.y - this.y, z: p2.z - this.z },
                       { x: this.x, y: this.y, z: this.z } );
    };

    this.vector = function() {
      return new Vector( this.x, this.y, this.z );
    };

    this.matrix = function() {
      return new Matrix( [[this.x], 
                          [this.y], 
                          [this.z]] );
    };
  };