var XYZ = function() {
  var camera = new Observer( { x: 3200, y: 600, z: -3200 }, { x: 0, y: 1500, z: 0 }, 800 );
  var camera_velocity = new Vector( 0, 0, 0 );
  var camera_rotation = new Vector( 0, 0, 0 );

  var viewport = new Viewport( { canvas_id: 'Viewport' } );
  
  var object_array = [];
  var scene = new CompositeObject();

  var animate = function() {
    for (var o in scene.components) {
      
      for (var v in scene.components[o].vertices) {
        var projection = camera.project( scene.components[o].vertices[v].matrix() ); 

        scene.components[o].projection[v].x = projection.rows[0][0];
        scene.components[o].projection[v].y = projection.rows[1][0];
        scene.components[o].projection[v].z = projection.rows[2][0];
      }
    }

    if (camera_velocity.x || camera_velocity.y || camera_velocity.z) {
      camera.moveRelative( camera_velocity );
    }

    if (camera_rotation.x || camera_rotation.y || camera_rotation.z) {
      camera.rotateProjection( camera_rotation );
    }

    viewport.draw( scene.components );

    requestAnimationFrame( animate );
  };

  this.animate = function() {
    animate();
  };

  var input = new InputJS( { 
    mouse: { delta: { callbacks: [ function( input_object ) {
        if (input_object.mouse.delta.down.indexOf(0) != -1) {
          viewport.canvas.requestPointerLock = viewport.canvas.requestPointerLock || 
                                               viewport.canvas.mozRequestPointerLock;

          viewport.canvas.requestPointerLock();
        }

        if (document.pointerLockElement == viewport.canvas) {
          camera.rotateRelative( { x: -input_object.mouse.delta.position.y / 10, 
                                   y: input_object.mouse.delta.position.x / 10 } );
        }
      } ] } },
    keyboard: { delta: { callbacks: [ function( input_object ) {
        if (input_object.keyboard.delta.down[0]) {
          var key_down = input_object.keyboard.delta.down[0].toLowerCase();
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
          }
        }
        if (input_object.keyboard.delta.up[0]) {
          var key_up = input_object.keyboard.delta.up[0].toLowerCase();
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
      } ] } } 
  } );    

  var box = new Object3(
    [ {x: -100, y: 200, z: 100}, {x: 100, y: 200, z: 100}, {x: 100, y: 200, z: -100}, {x: -100, y: 200, z: -100},
      {x: -100, y: 0, z: 100}, {x: 100, y: 0, z: 100}, {x: 100, y: 0, z: -100}, {x: -100, y: 0, z: -100} ],

    [ [0, 1], [1, 2], [2, 3], [3, 0],
      [0, 4], [1, 5], [2, 6], [3, 7],
      [4, 5], [5, 6], [6, 7], [7, 4] ],

    [ { vertices: [0, 1, 2, 3], shader: 'rgba(255, 0, 255, 1)' }, 
      { vertices: [4, 5, 6, 7], shader: 'rgba(0, 0, 255, 1)' },
      { vertices: [0, 1, 5, 4], shader: 'rgba(255, 0, 0, 1)' },
      { vertices: [1, 2, 6, 5], shader: 'rgba(255, 255, 0, 1)' },
      { vertices: [2, 3, 7, 6], shader: 'rgba(0, 255, 0, 1)' },
      { vertices: [3, 0, 4, 7], shader: 'rgba(0, 255, 255, 1)' } ]
  );

  var ground = new Object3(
    [ {x: -500, y: 0, z: 500}, {x: 500, y: 0, z: 500}, 
      {x: 500, y: 0, z: -400}, {x: -500, y: 0, z: -500} ],
    [],
    [ { vertices: [0, 1, 2, 3], shader: 'rgba(255, 247, 175, 0.8)' } ]
  );

  var tree_trunk = new Object3(
    [ {x: 100, y: 0, z: 0}, {x: 70, y: 0, z: 70}, {x: 0, y: 0, z: 100}, {x: -70, y: 0, z: 70}, {x: -100, y: 0, z: 0}, {x: -70, y: 0, z: -70}, {x: 0, y: 0, z: -100}, {x: 70, y: 0, z: -70},
      {x: 110, y: 250, z: 0}, {x: 80, y: 250, z: 80}, {x: 0, y: 250, z: 110}, {x: -80, y: 250, z: 80}, {x: -110, y: 250, z: 0}, {x: -80, y: 250, z: -80}, {x: 0, y: 250, z: -110}, {x: 80, y: 250, z: -80} ],
    [],
    [ { vertices: [0, 1, 9, 8], shader: 'rgba(140, 113, 36, 0.5)' }, 
      { vertices: [1, 2, 10, 9], shader: 'rgba(140, 113, 36, 0.5)' }, 
      { vertices: [2, 3, 11, 10], shader: 'rgba(140, 113, 36, 0.5)' }, 
      { vertices: [3, 4, 12, 11], shader: 'rgba(140, 113, 36, 0.5)' }, 
      { vertices: [4, 5, 13, 12], shader: 'rgba(140, 113, 36, 0.5)' }, 
      { vertices: [5, 6, 14, 13], shader: 'rgba(140, 113, 36, 0.5)' }, 
      { vertices: [6, 7, 15, 14], shader: 'rgba(140, 113, 36, 0.5)' }, 
      { vertices: [7, 0, 8, 15], shader: 'rgba(140, 113, 36, 0.5)' }, 
    ]
  );

  var tree_leaf = new Object3(
    [ {x: -50, y: 0, z: 10}, {x: 0, y: 0, z: 0}, {x: 50, y: 0, z: 10},
      {x: -50, y: 300, z: 15}, {x: 0, y: 300, z: 0}, {x: 50, y: 300, z: 15},
      {x: -100, y: 550, z: 70}, {x: 0, y: 550, z: 0}, {x: 100, y: 550, z: 70},
      {x: -150, y: 800, z: 180}, {x: 0, y: 800, z: 30}, {x: 150, y: 800, z: 180},
      {x: -120, y: 1100, z: 230}, {x: 0, y: 1100, z: 80}, {x: 120, y: 1100, z: 230},
      {x: -80, y: 1300, z: 200}, {x: 0, y: 1400, z: 140}, {x: 80, y: 1300, z: 200}, ],
    [],
    [ { vertices: [0, 1, 4, 3], shader: 'rgba(0, 113, 36, 0.5)' },
      { vertices: [1, 2, 5, 4], shader: 'rgba(0, 113, 36, 0.5)' },
      { vertices: [3, 4, 7, 6], shader: 'rgba(0, 113, 36, 0.5)' },
      { vertices: [4, 5, 8, 7], shader: 'rgba(0, 113, 36, 0.5)' },
      { vertices: [6, 7, 10, 9], shader: 'rgba(0, 113, 36, 0.5)' },
      { vertices: [7, 8, 11, 10], shader: 'rgba(0, 113, 36, 0.5)' },  
      { vertices: [9, 10, 13, 12], shader: 'rgba(0, 113, 36, 0.5)' },
      { vertices: [10, 11, 14, 13], shader: 'rgba(0, 113, 36, 0.5)' },  
      { vertices: [12, 13, 16, 15], shader: 'rgba(0, 113, 36, 0.5)' },
      { vertices: [13, 14, 17, 16], shader: 'rgba(0, 113, 36, 0.5)' },      
    ]
  );

  var tree = new CompositeObject();

  tree.addObject( new MetaObject( ground, 
                  { position: {x: 0, y: 0, z: 0},
                    rotation: {x: 0, y: 0, z: 0},
                    scale: {x: 1, y: 1, z: 1} } ) );

  tree.addObject( new MetaObject( tree_trunk,
                     { position: {x: 0, y: 0, z: 0},
                       rotation: {x: 0, y: 0, z: 0},
                       scale: {x: 1, y: 1, z: 1} } ) );

  tree.addObject( new MetaObject( tree_trunk,
                     { position: {x: 0, y: 240, z: 0},
                       rotation: {x: 0, y: 0, z: 0},
                       scale: {x: 0.9, y: 1, z: 0.9} } ) );

  tree.addObject( new MetaObject( tree_trunk,
                     { position: {x: 0, y: 480, z: 0},
                       rotation: {x: 0, y: 0, z: 0},
                       scale: {x: 0.85, y: 1, z: 0.9} } ) );             

  tree.addObject( new MetaObject( tree_trunk,
                     { position: {x: 0, y: 720, z: 0},
                       rotation: {x: 0, y: 0, z: 0},
                       scale: {x: 0.8, y: 1, z: 0.8} } ) );     

  tree.addObject( new MetaObject( tree_trunk,
                     { position: {x: 0, y: 960, z: 0},
                       rotation: {x: 5, y: 0, z: 0},
                       scale: {x: 0.7, y: 1, z: 0.7} } ) );     

  tree.addObject( new MetaObject( tree_trunk,
                     { position: {x: 0, y: 1200, z: -30},
                       rotation: {x: 10, y: 0, z: 0},
                       scale: {x: 0.6, y: 1, z: 0.6} } ) );     

  tree.addObject( new MetaObject( tree_trunk,
                     { position: {x: 0, y: 1440, z: -70},
                       rotation: {x: 15, y: 0, z: 0},
                       scale: {x: 0.55, y: 1, z: 0.55} } ) );     
                       
  tree.addObject( new MetaObject( tree_trunk,
                     { position: {x: 0, y: 1680, z: -130},
                       rotation: {x: 20, y: 0, z: 0},
                       scale: {x: 0.5, y: 1, z: 0.5} } ) );


  tree.addObject( new MetaObject( tree_leaf,
                     { position: {x: 0, y: 1930, z: -220},
                       rotation: {x: -10, y: 0, z: 0},
                       scale: {x: 1, y: 1, z: 1} } ) );
                       
  tree.addObject( new MetaObject( tree_leaf,
                     { position: {x: 0, y: 1930, z: -220},
                       rotation: {x: -10, y: 70, z: 0},
                       scale: {x: 1, y: 1, z: 1} } ) );        

  tree.addObject( new MetaObject( tree_leaf,
                     { position: {x: 0, y: 1930, z: -220},
                       rotation: {x: -40, y: 140, z: 0},
                       scale: {x: 1, y: 1, z: 1} } ) );  
                       
  tree.addObject( new MetaObject( tree_leaf,
                     { position: {x: 0, y: 1930, z: -220},
                       rotation: {x: -30, y: 210, z: 0},
                       scale: {x: 1, y: 1, z: 1} } ) );        
                       
  tree.addObject( new MetaObject( tree_leaf,
                     { position: {x: 0, y: 1930, z: -220},
                       rotation: {x: -10, y: 280, z: 0},
                       scale: {x: 1, y: 1, z: 1} } ) );     
                       

  tree.addObject( new MetaObject( tree_leaf,
                     { position: {x: 0, y: 1930, z: -220},
                       rotation: {x: -40, y: 20, z: 0},
                       scale: {x: 1, y: 1, z: 1} } ) );
                       
  tree.addObject( new MetaObject( tree_leaf,
                     { position: {x: 0, y: 1930, z: -220},
                       rotation: {x: -40, y: 100, z: 0},
                       scale: {x: 1, y: 1, z: 1} } ) );        

  tree.addObject( new MetaObject( tree_leaf,
                     { position: {x: 0, y: 1930, z: -220},
                       rotation: {x: -70, y: 150, z: 0},
                       scale: {x: 1, y: 1, z: 1} } ) );  
                       
  tree.addObject( new MetaObject( tree_leaf,
                     { position: {x: 0, y: 1930, z: -220},
                       rotation: {x: -60, y: 250, z: 0},
                       scale: {x: 1, y: 1, z: 1} } ) );        
                       
  tree.addObject( new MetaObject( tree_leaf,
                     { position: {x: 0, y: 1930, z: -220},
                       rotation: {x: -40, y: 340, z: 0},
                       scale: {x: 1, y: 1, z: 1} } ) );         
                       

  tree.addObject( new MetaObject( tree_leaf,
                     { position: {x: 0, y: 1930, z: -220},
                       rotation: {x: -80, y: 60, z: 0},
                       scale: {x: 1, y: 1, z: 1} } ) );
                       
  tree.addObject( new MetaObject( tree_leaf,
                     { position: {x: 0, y: 1930, z: -220},
                       rotation: {x: -80, y: 120, z: 0},
                       scale: {x: 1, y: 1, z: 1} } ) );        

  tree.addObject( new MetaObject( tree_leaf,
                     { position: {x: 0, y: 1930, z: -220},
                       rotation: {x: -90, y: 170, z: 0},
                       scale: {x: 1, y: 1, z: 1} } ) );  
                       
  tree.addObject( new MetaObject( tree_leaf,
                     { position: {x: 0, y: 1930, z: -220},
                       rotation: {x: -90, y: 210, z: 0},
                       scale: {x: 1, y: 1, z: 1} } ) );        
                       
  tree.addObject( new MetaObject( tree_leaf,
                     { position: {x: 0, y: 1930, z: -220},
                       rotation: {x: -80, y: 300, z: 0},
                       scale: {x: 1, y: 1, z: 1} } ) );      


  tree.addObject( new MetaObject( tree_leaf,
                     { position: {x: 0, y: 1930, z: -220},
                       rotation: {x: -110, y: 60, z: 0},
                       scale: {x: 1, y: 0.8, z: 1} } ) );
                       
  tree.addObject( new MetaObject( tree_leaf,
                     { position: {x: 0, y: 1930, z: -220},
                       rotation: {x: -110, y: 120, z: 0},
                       scale: {x: 1, y: 0.8, z: 1} } ) );        

  tree.addObject( new MetaObject( tree_leaf,
                     { position: {x: 0, y: 1930, z: -220},
                       rotation: {x: -120, y: 170, z: 0},
                       scale: {x: 1, y: 0.8, z: 1} } ) );  
                       
  tree.addObject( new MetaObject( tree_leaf,
                     { position: {x: 0, y: 1930, z: -220},
                       rotation: {x: -120, y: 210, z: 0},
                       scale: {x: 1, y: 0.8, z: 1} } ) );        
                       
  tree.addObject( new MetaObject( tree_leaf,
                     { position: {x: 0, y: 1930, z: -220},
                       rotation: {x: -110, y: 300, z: 0},
                       scale: {x: 1, y: 0.8, z: 1} } ) );

  scene.addObject( new MetaObject( tree,
                     { position: {x: 0, y: 0, z: 0},
                       rotation: {x: 0, y: 0, z: 0},
                       scale: {x: 1, y: 1, z: 1} } ) );

  scene.addObject( new MetaObject( tree,
                     { position: {x: 100, y: 0, z: 3000},
                       rotation: {x: 0, y: 0, z: 0},
                       scale: {x: 1, y: 1, z: 1} } ) ); 
};