var XYZ = function() {
  var camera_target_distance = 800;
  var camera_velocity = new Vector( 0, 0, 0 );
  var camera_rotation = new Vector( 0, 0, 0 );
  var camera = new Observer( { x: -100, y: 50, z: -600 }, 
                             { x: -100, y: 50, z: 0 }, 800, 'perspective' );

  var viewport = new Viewport( { canvas_id: 'Viewport', 
                                 fill: 'rgba(255, 255, 255, 0.3)', 
                                 focal_length: camera.focal_length } );

  var origin = new Point(0, 0, 0);
  var origin_object = new Object3( [ { x: origin.x, y: origin.y, z: origin.z } ] );

  var random_vectors = [];
  var random_trajectories = [];
  var point_objects = [];
  var rotation_vectors = [];

  // centered to viewport origin, range [-1, 1]
  var mouse_coord_x = 0;
  var mouse_coord_y = 0;

  for (var i = 0; i < 400; i++) {

    // generate random vectors
    var random_vector = new Vector( (((1-Math.random())-0.5)*2),
                                    (((1-Math.random())-0.5)*2),
                                    (((1-Math.random())-0.5)*2) );
 
    var vector_identity = random_vector.normalize();
    var vector_magnitude = Math.min(viewport.origin.x, viewport.origin.y) / 2;
    random_vectors.push(vector_identity);


    var rotation_vector = new Vector( (((1-Math.random())-0.5)*2),
                                      (((1-Math.random())-0.5)*2),
                                      (((1-Math.random())-0.5)*2) );

    var rotation_identity = rotation_vector.normalize();
    var rotation_magnitude = 0.3;

    random_trajectories.push(rotation_identity);




    //var red = 255 * Math.random();
    //var green = 255 * Math.random();
    //var blue = 255 * Math.random();

    var vertex_shader = { type: 'solid', data: { fill: { r: 200, g: 100, b: 100, a: 1 }, radius: 2 } };
    var edge_shader = { type: 'solid', data: { fill: { r: 0, g: 0, b: 0, a: 0.03 }, width: 1 } };

    var point_object = new Object3( [ { x: vector_identity.x * (1-Math.random()/10)*vector_magnitude,
                                        y: vector_identity.y * (1-Math.random()/10)*vector_magnitude,
                                        z: vector_identity.z * (1-Math.random()/10)*vector_magnitude,
                                        shader: [vertex_shader, edge_shader] } ] );

    var meta_point_object = new MetaObject( { object: point_object } );

    point_objects.push( meta_point_object );

    var factors = { o: { x: 0, y: 0, z: 0 },
                    a: { x: 0, y: 0, z: 0},
                    r: { x: 0, y: 0, z: 0  } };

    var rotation_magnitude = 1;

    var rotation_vector = new Vector( ((factors.o.x*rotation_identity.x) + (factors.a.x*vector_identity.x) + factors.r.x),
                                       ((factors.o.y*rotation_identity.y) + (factors.a.y*vector_identity.y) + factors.r.y),
                                       ((factors.o.z*rotation_identity.z) + (factors.a.z*vector_identity.z) + factors.r.z) );

    var rotation_identity = rotation_vector;//.normalize();

    rotation_vectors.push( { x: rotation_identity.x * rotation_magnitude,
                             y: rotation_identity.y * rotation_magnitude,
                             z: rotation_identity.z * rotation_magnitude } );


/*

    rotation_vectors.push( { x: ((factors.o.x*rotation_identity.x) + (factors.a.x*vector_identity.x) + factors.r.x) * rotation_magnitude,
                             y: ((factors.o.y*rotation_identity.y) + (factors.a.y*vector_identity.y) + factors.r.y) * rotation_magnitude,
                             z: ((factors.o.z*rotation_identity.z) + (factors.a.z*vector_identity.z) + factors.r.z) * rotation_magnitude } );
*/
  }


  var point_composite = new CompositeObject( point_objects );

  var object_set = [ origin_object, point_composite ];

  console.log(object_set);


  var animate = function() { 
    var resort = false;

    
    for (var p in point_composite.components) {
      point_composite.components[p].updateMeta( { rotation: rotation_vectors[p] } );
    }

    rotation_vectors.length = 0;
    for (var r in random_vectors) {
      
    rotation_vectors.push( { x: ((factors.o.x*random_trajectories[r].x) + (factors.a.x*random_vectors[r].x) + mouse_coord_y) * rotation_magnitude,
                             y: ((factors.o.y*random_trajectories[r].y) + (factors.a.y*random_vectors[r].y) + mouse_coord_x) * rotation_magnitude,
                             z: ((factors.o.z*random_trajectories[r].z) + (factors.a.z*random_vectors[r].z)) * rotation_magnitude } );

/*
    var rotation_vector = new Vector( ((factors.o.x*random_trajectories[r].x) + (factors.a.x*random_vectors[r].x) + factors.r.x*mouse_coord_y),
                                       ((factors.o.y*random_trajectories[r].y) + (factors.a.y*random_vectors[r].y) + factors.r.y*mouse_coord_x),
                                       ((factors.o.z*random_trajectories[r].z) + (factors.a.z**random_vectors[r].z) + factors.r.z) );

    var rotation_identity = rotation_vector.normalize();

    rotation_vectors.push( { x: rotation_vector.x * rotation_magnitude,
                             y: rotation_vector.y * rotation_magnitude,
                             z: rotation_vector.z * rotation_magnitude } );
                             */
   }

    point_composite.sortVertices();

    if (camera_velocity.x || camera_velocity.y || camera_velocity.z) {
      camera.moveRelative( camera_velocity );
    }

    if (camera_rotation.x || camera_rotation.y || camera_rotation.z) {
      camera.rotateProjection( camera_rotation );
      resort = true;
    }

    for (var o in object_set) {
      for (var v in object_set[o].vertices) {
        var projection = camera.project_array( [[object_set[o].vertices[v].point.x],
                                                [object_set[o].vertices[v].point.y],
                                                [object_set[o].vertices[v].point.z]] ); 

        object_set[o].vertices[v].projection.x = Math.round(projection[0][0]);
        object_set[o].vertices[v].projection.y = Math.round(projection[1][0]);
        object_set[o].vertices[v].projection.z = Math.round(projection[2][0]);

        if (resort) { object_set[o].sortFaces() }
      }
    }


    viewport.draw( object_set );

    requestAnimationFrame( animate );
  };

  this.animate = function() { animate(); };





  
  var mouse_handler = function( input ) {
    mouse_coord_x = (input.mouse.position.real.x - viewport.origin.x) / viewport.origin.x;
    mouse_coord_y = (input.mouse.position.real.y - viewport.origin.y) / viewport.origin.y;

    if (document.pointerLockElement == viewport.canvas) {
      camera.rotateRelative( { x: -input.mouse.delta.position.y / 10, 
                               y: input.mouse.delta.position.x / 10 } );
    }
  }.bind(this);

  var keyboard_handler = function( input ) {
    if (input.keyboard.delta.down[0]) {
      var key_down = input.keyboard.delta.down[0].toLowerCase();
      //console.log(key_down);
      switch (key_down) { 

        case 'w': 
          camera_velocity.z += 20;
          break;
        case 's':
          camera_velocity.z += -20;
          break;
        case 'a':
            camera_velocity.x += -20;
          break;
        case 'd':
          camera_velocity.x += 20;
          break;
        case 'q': 
          camera_velocity.y += -20;
          break;
        case 'e':
          camera_velocity.y += 20;
          break;

        case '+': 
          camera.focal_length += 100;
          viewport.focal_length = camera.focal_length;
          break;
        case '-':
          camera.focal_length -= 100;
          viewport.focal_length = camera.focal_length;
          break;

        case ' ':
          if (document.pointerLockElement) {
            document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock;
            document.exitPointerLock();
          } else {
            viewport.canvas.requestPointerLock = viewport.canvas.requestPointerLock || viewport.canvas.mozRequestPointerLock;
            viewport.canvas.requestPointerLock();
          }
        break;
      }
    }

    if (input.keyboard.delta.up[0]) {
      var key_up = input.keyboard.delta.up[0].toLowerCase();
      switch (key_up) {

        case 'w': 
          camera_velocity.z -= 20;
          break;
        case 's':
          camera_velocity.z -= -20;
          break;
        case 'a':
          camera_velocity.x -= -20;
          break;
        case 'd':
          camera_velocity.x -= 20;
          break;
        case 'q': 
          camera_velocity.y -= -20;
          break;
        case 'e':
          camera_velocity.y -= 20;
          break;
      }
    }
  };

  var input = new InputJS( { 
    mouse: { delta: { callbacks: [ mouse_handler ] } },
    keyboard: { delta: { callbacks: [ keyboard_handler ] } } 
  } );   
  
};
