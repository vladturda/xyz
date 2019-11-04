var Vector = function( x = 0, y = 0, z = 0 ) { 
    this.x = x;
    this.y = y;
    this.z = z;
    
    this.magnitude = function() {
      return Math.sqrt( this.x * this.x + this.y * this.y + this.z * this.z );
    };

    this.normalize = function() {
      var magnitude = this.magnitude();
      return new Vector( this.x / magnitude, this.y / magnitude, this.z / magnitude );
    };

    this.matrix = function() {
      return new Matrix( [[this.x], [this.y], [this.z]] );
    };

    this.zero = function() {
      return new Vector( 0, 0, 0 );
    }
};