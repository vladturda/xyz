var Plane = function( origin = new Vector(), normal = new Vector() ) {
  this.origin = new Point( origin.x, origin.y, origin.z );
  this.normal = new Vector( normal.x, normal.y, normal.z );
};