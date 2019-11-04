var Line = function( vector = new Vector(), position = new Point() ) {
  this.vector = new Vector( vector.x, vector.y, vector.z );
  this.position = new Point( position.x, position.y, position.z );
  this.magnitude = this.vector.magnitude();
  this.identity = this.vector.normalize();
};