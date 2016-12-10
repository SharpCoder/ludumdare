// 2014-08-22
// SharpCoder
// This is the core bootstrapper for my ludum dare 30 entry.

function doBootstrap() {

	Assets.Initialize(function() {

		// Initialize the scnees.
		Framework.Initialize();
		Scenes.Initialize();
		// document.getElementById("canvas_container").addEventListener("mousedown", function(evt){
		// 	Framework.DoMouseDown( evt.offsetX, evt.offsetY );
		// });


		document.getElementById("canvas_container").onmousedown = function(evt){
			if ( evt.offsetX === undefined || evt.offsetY === undefined ) {
				var rect = document.getElementById("canvas_container").getBoundingClientRect();
				Framework.DoMouseDown( evt.clientX - rect.left, evt.clientY - rect.top );
			} else {
				Framework.DoMouseDown( evt.offsetX, evt.offsetY );
			}
		};

		document.getElementById("canvas_container").addEventListener("mousemove", function(evt) {
			if ( evt.offsetX === undefined || evt.offsetY === undefined ) {
				var rect = document.getElementById("canvas_container").getBoundingClientRect();
				Framework.DoMouseMove( evt.clientX - rect.left, evt.clientY - rect.top );
			} else {
				Framework.DoMouseMove( evt.offsetX, evt.offsetY );
			}
		});

    // function game_loop() {
    //   Framework.doUpdate();
    //   Framework.doDraw();
    //   requestAnimationFrame(game_loop);
    // }
    //
    // requestAnimationFrame(game_loop);
    //
		function update_loop() {
			Framework.doUpdate();
			setTimeout( update_loop, 20 );
		}

		function draw_loop() {
			Framework.doDraw();
			setTimeout( draw_loop, 20 );
		}

		update_loop();
		draw_loop();

	});

}
