
var PCG = {
    init: function()
    {
        this.type = 1;
    },
    next: function( width, height )
    {
        var grid = new PF.Grid( width, height );

        switch( this.type )
        {
            case 0:
                this.generateMaze( grid );
                break;
            case 1:
                this.generateRooms( grid );
                break;
            case 2:
                this.generateArea( grid );
                break;
        }

        this.type += 1;
        this.type %= 2;

        return grid;
    },

    generateMaze: function( grid )
    {
        var cN = [[0,0],[0,0],[0,0],[0,0]];
        var size = 15,x,y,cx,cy;
        var map = new Array(size);
        var randomDir,intDone=0;
        for (var i = 0; i <= size * size; ++i){
            map[i] = new Array(size);
        }
        // Initialize the Map Array to Zeros
        for (x=1;x<=size;++x){
            for (y=1;y<=size;++y){
                map[x][y]=0;
            } //end for
        } //end for
        do {
            // Roll random x's and y's and make sure the value is odd
            x=2+Math.floor(Math.random()*(size-1));if (x%2!=0) --x;
            y=2+Math.floor(Math.random()*(size-1));if (y%2!=0) --y;
            // Ensure that the first random map location starts the process
            if (intDone==0) map[x][y]=1;
            if (map[x][y]==1){
                //Randomize Directions
                randomDir=Math.floor(Math.random()*4)
                if (randomDir==0){
                    cN = [[-1,0],[1,0],[0,-1],[0,1]];
                    } else if (randomDir==1){
                    cN = [[0,1],[0,-1],[1,0],[-1,0]];
                    } else if (randomDir==2){
                    cN = [[0,-1],[0,1],[-1,0],[1,0]];
                    } else if (randomDir==3){
                    cN = [[1,0],[-1,0],[0,1],[0,-1]];
                } //end if
                blnBlocked=1;
                do {
                    blnBlocked++;
                    for (var intDir=0; intDir<=3; ++intDir){
                        // Determine which direction the tile is
                        cx=x+cN[intDir][0]*2;
                        cy=y+cN[intDir][1]*2;
                        //Check to see if the tile can be used
                        if (cx<size && cy<size && cx>1 && cy>1){
                            if (map[cx][cy]!=1){
                                //create destination location
                                map[cx][cy]=1;
                                //create current location
                                map[x][y]=1
                                //create inbetween location
                                map[x+cN[intDir][0]][y+cN[intDir][1]]=1;
                                //set destination location to current
                                x=cx;y=cy;
                                blnBlocked=0;
                                intDone++;
                                intDir=4
                            } //end if
                        } //end if
                    } //end for
                    //recursive, no directions found, loop back a node
                } while (blnBlocked==1) //end do
            } //end if
        } while (intDone+1<((size-1)*(size-1))/4) //end do


        for (x=1;x<=size;++x){
            for (y=1;y<=size;++y){
                grid.setWalkableAt(x,y, map[x][y] == 1);
            }
        }
    },

    generateRooms: function( grid )
    {
        var split = function( node, depth )
        {
            if( Math.random() > 0.5 )
            {
                var left = Math.floor(node.width * (Math.random() * .2 + .4));
                var right = node.width - left;
                node.t = 0; // horizontal
                node.a = {x: node.x, y: node.y, width: left, height: node.height, a: null, b: null, p: null};
                node.b = {x: node.x + left, y: node.y, width: right, height: node.height, a: null, b: null, p: null};
            } else {
                var left = Math.floor(node.height * (Math.random() * .2 + .4));
                var right = node.height - left;
                node.t = 1;
                node.a = {x: node.x, y: node.y, width: node.width, height: left, a: null, b: null, p: null};
                node.b = {x: node.x, y: node.y + left, width: node.width, height: right, a: null, b: null, p: null};
            }
            node.a.p = node;
            node.b.p = node;
            node.a.s = node.b;
            node.b.s = node.a;
            if( depth > 1 )
            {
                split( node.a, depth-1 );
                split( node.b, depth-1 );
            }
        }
        var findleaf = function( node, leafs )
        {
            if( node.a == null && node.b == null )
            {
                leafs.push( node );
            } else {
                findleaf( node.a, leafs );
                findleaf( node.b, leafs );
            }
        }
        var breakwalls = function( node )
        {
            if( node.b == null )
                return;
            if( node.t == 0 )
            {
                var y = 2;
                grid.setWalkableAt(node.b.x, node.b.y+y, true);
            } else {
                var x = 2;
                grid.setWalkableAt(node.b.x+x, node.b.y, true);
            }
            breakwalls(node.a);
            breakwalls(node.b);
        }

        var width = grid.width;
        var height = grid.height;

        var dungeon = { x: 0, y: 0, width: width-1, height: height-1, a: null, b: null, p: null, s: null};
        split( dungeon, 3 );
        var leafs = [];
        findleaf( dungeon, leafs );

        for( var x = 0; x < width; x++ )
            grid.setWalkableAt(x, height-1, false);
        for( var y = 0; y < height; y++ )
            grid.setWalkableAt(width-1, y, false);

        leafs.forEach(function(e){
            for( var x = 0; x < e.width; x++ )
                grid.setWalkableAt(e.x+x, e.y, false);
            for( var y = 0; y < e.height; y++ )
                grid.setWalkableAt(e.x, e.y + y, false);
        });

        breakwalls( dungeon );


    },


    generateArea: function( grid )
    {
    }

};
