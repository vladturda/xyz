var Matrix = function( rows = [] ) {
  this.rows = [[], [], []];
  for (var row in rows) {
    for (var column in rows[row]) {
      this.rows[row].push( rows[row][column] );
    }
  }

  this.dot = function( m_2 = new Matrix() ) {
    var result = [[0], [0], [0]];
    for (var r_r in this.rows) {
      for (var r_c in this.rows[r_r]) {
        for (var c in m_2.rows[r_c]) {
          result[r_r][r_c] += this.rows[r_r][r_c] * m_2.rows[r_c][c];
        }
      }
    }
    
    return new Matrix( result );
  };
  
  this.multiply = function( m2 = new Matrix() ) {
    var dotproduct = (a, b) => a.map((x, i) => a[i] * b[i]).reduce((m, n) => m + n);
    var transpose = a => a[0].map((x, i) => a.map(y => y[i]));
    var a = this.rows;
    var b = m2.rows;
    
    var result = a.map( function( x,i ) {
      return transpose( b ).map( function( y,k ) {
        return dotproduct( x, y );
      } );
    } );
    
    return new Matrix( result );
  };
  
  this.multiply_array = function( m2 = [[], [], []] ) {
    var dotproduct = (a, b) => a.map((x, i) => a[i] * b[i]).reduce((m, n) => m + n);
    var transpose = a => a[0].map((x, i) => a.map(y => y[i]));
    var a = this.rows;
    var b = m2;
    
    var result = a.map( function( x,i ) {
      return transpose( b ).map( function( y,k ) {
        return dotproduct( x, y );
      } );
    } );
    
    return result;
  };

  this.cross = function( m2 = new Matrix() ) {
    var result = [[], [], []];
    for (var r in this.rows) {
      for (var c in this.rows[r]) {
        result[r][c] = this.rows[(r+1)%3][c] * m2.rows[(r+2)%3][c] - 
                       this.rows[(r+2)%3][c] * m2.rows[(r+1)%3][c];
      }
    }
    
    return new Matrix( result );
  };

  this.cross_array = function( m2 = [[], [], []] ) {
    var result = [[], [], []];
    for (var r in this.rows) {
      for (var c in this.rows[r]) {
        result[r][c] = this.rows[(r+1)%3][c] * m2.rows[(r+2)%3][c] - 
                       this.rows[(r+2)%3][c] * m2.rows[(r+1)%3][c];
      }
    }
    
    return result;
  };

  this.add = function( m2 = new Matrix() ) {
    var result = [[], [], []];
    for (var r in this.rows) {
      for (var c in this.rows[r]) {
        result[r].push( this.rows[r][c] + m2.rows[r][c] );
      }
    }

    return new Matrix( result );
  };

  this.add_array = function( m2 = [[], [], []] ) {
    var result = [[], [], []];
    for (var r in this.rows) {
      for (var c in this.rows[r]) {
        result[r].push( this.rows[r][c] + m2.rows[r][c] );
      }
    }

    return result;
  };

  this.subtract = function( m2 = new Matrix() ) {
    var result = [[], [], []];
    for (var r in this.rows) {
      for (var c in this.rows[r]) {
        result[r].push( this.rows[r][c] - m2.rows[r][c] );
      }
    }

    return new Matrix( result );
  };

  this.subtract_array = function( m2 = [[], [], []] ) {
    var result = [[], [], []];
    for (var r in this.rows) {
      for (var c in this.rows[r]) {
        result[r].push( this.rows[r][c] - m2[r][c] );
      }
    }

    return result;
  };

  this.transpose = function() {
    var result = [[], [], []];
    for (var r in this.rows) {
      for (var c in this.rows[r]) {
        result[c][r] = this.rows[r][c];
      }
    }

    return new Matrix( result );
  };

  this.normalize = function() {
    var result = [[], [], []];
    for (var c in this.rows[0]) {
      var total = 0;
      for (var r in this.rows) {
        total += this.rows[r][c] * this.rows[r][c];
      }
      var magnitude = Math.sqrt(total);
      for (var r in this.rows) {
        result[r].push( this.rows[r][c] / magnitude );
      }
    }
    
    return new Matrix( result );
  };

  this.normalize_array = function() {
    var result = [[], [], []];
    for (var c in this.rows[0]) {
      var total = 0;
      for (var r in this.rows) {
        total += this.rows[r][c] * this.rows[r][c];
      }
      var magnitude = Math.sqrt(total);
      for (var r in this.rows) {
        result[r].push( this.rows[r][c] / magnitude );
      }
    }
    
    return result;
  };

  this.vector = function() {
    return new Vector(this.rows[0][0], this.rows[1][0], this.rows[2][0]);
  };
};