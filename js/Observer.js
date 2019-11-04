var Observer = function( position = new Point(), target = new Vector(), focal_length = 0, projection_mode = 'perspective' ) {
  this.position = new Point( position.x, position.y, position.z );
  this.target = new Point( target.x, target.y, target.z );
  this.target_line = this.position.getLineToPoint( this.target );
  this.focal_length = focal_length;
  this.projection_mode = projection_mode;
  this.projection_matrix = new Matrix();

  var UP = new Matrix( [[0], [1], [0]] );
  var rotation_matrix = new Matrix();

  this.updateProjectionMatrix = function() {
    this.target_line = this.position.getLineToPoint( this.target );
    
    var z_axis = this.target_line.identity.matrix();
    var x_axis = z_axis.cross( UP ).normalize();
    var y_axis = x_axis.cross( z_axis );

    this.projection_matrix.rows = [[ x_axis.rows[0][0], x_axis.rows[1][0], x_axis.rows[2][0] ],
                                   [ y_axis.rows[0][0], y_axis.rows[1][0], y_axis.rows[2][0] ],
                                   [ z_axis.rows[0][0], z_axis.rows[1][0], z_axis.rows[2][0] ]];
  };
  
  this.setPosition = function( position = new Vector() ) {
    this.position.x = position.x;
    this.position.y = position.y;
    this.position.z = position.z;
    
    this.updateProjectionMatrix();
  };
  
  this.setTarget = function( target = new Vector() ) {
    this.target.x = target.x;
    this.target.y = target.y;
    this.target.z = target.z;
    
    this.updateProjectionMatrix();
  };
  
  this.moveAxis = function( direction = new Vector() ) {
    this.position.x += direction.x;
    this.position.y += direction.y;
    this.position.z += direction.z;

    this.target.x += direction.x;
    this.target.y += direction.y;
    this.target.z += direction.z;
  };

  this.moveRelative = function( direction = new Vector() ) {
    var x_axis = this.projection_matrix.rows[0];
    var y_axis = [ 0, 1, 0 ]; // this.projection_matrix.rows[1];
    var z_axis = this.projection_matrix.rows[2];
    
    var relative_direction = { x: -direction.x*x_axis[0] + direction.y*y_axis[0] + direction.z*z_axis[0], 
                               y: -direction.x*x_axis[1] + direction.y*y_axis[1] + direction.z*z_axis[1], 
                               z: -direction.x*x_axis[2] + direction.y*y_axis[2] + direction.z*z_axis[2] };

    this.moveAxis(relative_direction);
  };

  this.rotateAxis = function( rotation = new Vector() ) {
    var pi_180 = Math.PI / 180;
    var target_vector = [[this.target.x - this.position.x], 
                         [this.target.y - this.position.y], 
                         [this.target.z - this.position.z]];

    if(rotation.x) {
      var degrees = rotation.x * pi_180;
      rotation_matrix.rows[0] = [1, 0, 0];
      rotation_matrix.rows[1] = [0, Math.cos( degrees ), Math.sin( degrees )];
      rotation_matrix.rows[2] = [0, -Math.sin( degrees ), Math.cos( degrees )];

      target_vector = rotation_matrix.multiply_array(target_vector);
    }

    if(rotation.y) {
      var degrees = rotation.y * pi_180;
      rotation_matrix.rows[0] = [Math.cos( degrees ), 0, -Math.sin( degrees )];
      rotation_matrix.rows[1] = [0, 1, 0];
      rotation_matrix.rows[2] = [Math.sin( degrees ), 0, Math.cos( degrees )];

      target_vector = rotation_matrix.multiply_array(target_vector);
    }

    if(rotation.z) {
      var degrees = rotation.z * pi_180;
      rotation_matrix.rows[0] = [Math.cos( degrees ), Math.sin( degrees ), 0];
      rotation_matrix.rows[1] = [-Math.sin( degrees ), Math.cos( degrees ), 0];
      rotation_matrix.rows[2] = [0, 0, 1];

      target_vector = rotation_matrix.multiply_array(target_vector);
    }

    this.setTarget( { x: target_vector[0][0], y: target_vector[1][0], z: target_vector[2][0] });
  };

  this.rotateRelative = function( rotation = new Vector() ) {
    var pi_180 = Math.PI / 180;
    var target_vector = [[this.target.x - this.position.x], 
                         [this.target.y - this.position.y], 
                         [this.target.z - this.position.z]];

    var updateRotationMatrix = function( angle, axis ) {
      var a_x = axis[0];
      var a_y = axis[1];
      var a_z = axis[2];
      var a_x2 = a_x * a_x;
      var a_y2 = a_y * a_y;
      var a_z2 = a_y * a_y;

      rotation_matrix.rows[0] = [ Math.cos(angle) + a_x2*(1 - Math.cos(angle)), 
                                  a_x*a_y*(1 - Math.cos(angle)) - a_z*Math.sin(angle), 
                                  a_x*a_z*(1 - Math.cos(angle)) + a_y*Math.sin(angle) ];
      rotation_matrix.rows[1] = [ a_y*a_x*(1 - Math.cos(angle)) + a_z*Math.sin(angle), 
                                  Math.cos(angle) + a_y2*(1 - Math.cos(angle)), 
                                  a_y*a_z*(1 - Math.cos(angle)) - a_x*Math.sin(angle) ];
      rotation_matrix.rows[2] = [ a_z*a_x*(1 - Math.cos(angle)) - a_y*Math.sin(angle), 
                                  a_z*a_y*(1 - Math.cos(angle)) + a_x*Math.sin(angle), 
                                  Math.cos(angle) + a_z2*(1 - Math.cos(angle)) ];
    };

    if(rotation.x) {
      var angle = rotation.x * pi_180;
      var axis = this.projection_matrix.rows[0];

      updateRotationMatrix( angle, axis );

      target_vector = rotation_matrix.multiply_array(target_vector);
    }

    if(rotation.y) {
      var angle = rotation.y * pi_180;
      var axis = this.projection_matrix.rows[1];

      updateRotationMatrix( angle, axis );

      target_vector = rotation_matrix.multiply_array(target_vector);
    }

    if(rotation.z) {
      var angle = rotation.z * pi_180;
      var axis = this.projection_matrix.rows[2];

      updateRotationMatrix( angle, axis );

      target_vector = rotation_matrix.multiply_array(target_vector);
    }

    this.setTarget( { x: target_vector[0][0], y: target_vector[1][0], z: target_vector[2][0] });
  };

  this.rotateProjection = function( rotation = new Vector() ) {
    var pi_180 = Math.PI / 180;

    if(rotation.x) {
      var degrees = rotation.x * pi_180;
      rotation_matrix.rows[0] = [1, 0, 0];
      rotation_matrix.rows[1] = [0, Math.cos( degrees ), Math.sin( degrees )];
      rotation_matrix.rows[2] = [0, -Math.sin( degrees ), Math.cos( degrees )];

      this.projection_matrix = rotation_matrix.multiply(this.projection_matrix);
    }

    if(rotation.y) {
      var degrees = rotation.y * pi_180;
      rotation_matrix.rows[0] = [Math.cos( degrees ), 0, -Math.sin( degrees )];
      rotation_matrix.rows[1] = [0, 1, 0];
      rotation_matrix.rows[2] = [Math.sin( degrees ), 0, Math.cos( degrees )];

      this.projection_matrix = rotation_matrix.multiply(this.projection_matrix);
    }

    if(rotation.z) {
      var degrees = rotation.z * pi_180;
      rotation_matrix.rows[0] = [Math.cos( degrees ), Math.sin( degrees ), 0];
      rotation_matrix.rows[1] = [-Math.sin( degrees ), Math.cos( degrees ), 0];
      rotation_matrix.rows[2] = [0, 0, 1];

      this.projection_matrix = rotation_matrix.multiply(this.projection_matrix);
    }
  };

  this.project = function( point_matrix = new Matrix(), z_scale = -1 ) {
    var camera_point_matrix = point_matrix.subtract( this.position.matrix() );
    var projection_point = this.projection_matrix.multiply( camera_point_matrix );

    var z_scale = this.projection_mode == 'perspective' ? -this.focal_length / projection_point.rows[2][0] : -1;
    z_scale = projection_point[2][0] > 0 ? z_scale : -z_scale;

    return new Matrix( [[projection_point.rows[0][0] * z_scale], 
                        [projection_point.rows[1][0] * z_scale], 
                        [projection_point.rows[2][0]]] );
  };

  this.project_array = function( point_matrix = [[], [], []], z_scale = -1 ) {
    var camera_point_matrix = [[point_matrix[0][0] - this.position.x], 
                               [point_matrix[1][0] - this.position.y], 
                               [point_matrix[2][0] - this.position.z]];

    var projection_point = this.projection_matrix.multiply_array( camera_point_matrix );

    var z_scale = this.projection_mode == 'perspective' ? -this.focal_length / projection_point[2][0] : -1;
    z_scale = projection_point[2][0] > 0 ? z_scale : -z_scale;

    return [[projection_point[0][0] * z_scale], 
            [projection_point[1][0] * z_scale], 
            [projection_point[2][0]]];
  };

  this.updateProjectionMatrix();
};