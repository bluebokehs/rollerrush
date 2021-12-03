class Stage {
    constructor (scene1, camera1, playerPosition1) {
        this.scene1 = scene1;
        this.camera1 = camera1;
        this.playerPosition1 = playerPosition1;
    }
    add () {
        let speed1 = [0, 0, 0, 0];
			let speed2 = [0, 0, 0, 0];
			const scene = this.scene1;
			const camera = this.camera1;
			
			// orthographic camera
			//const theHeight = 10 * (window.innerHeight / window.innerWidth);
			//const camera = new THREE.OrthographicCamera(-5, 5, theHeight/ 2, theHeight / -2, 0.1, 1000);

			const renderer = new THREE.WebGLRenderer();
			renderer.setSize( window.innerWidth, window.innerHeight );
			renderer.shadowMap.enabled = true;
			document.body.appendChild( renderer.domElement );

			window.addEventListener('resize', function() {
				var width = window.innerWidth;
				var height = window.innerHeight;
				renderer.setSize(width, height);
				camera.aspect = width / height;
				camera.updateProjectionMatrix();
			});

			// intitialize CannonJS
			const world = new CANNON.World();
			world.gravity.set(0, -10, 0); // gravity pulls things down

			// create the cylinder
			const geometry = new THREE.CylinderGeometry(3, 3, 2, 60);
			const material = new THREE.MeshLambertMaterial( { color: 0x77ccff } );
			const cylinder = new THREE.Mesh( geometry, material );
			cylinder.receiveShadow = true;
			scene.add( cylinder );

			// create physics for cylinder
			const cylinderShape = new CANNON.Cylinder(3, 3, 2, 30);
			const cylinderMaterial = new CANNON.Material();
			const cylinderBody = new CANNON.Body({mass: 0, material: cylinderMaterial})
			cylinderBody.addShape(cylinderShape);
			cylinderBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2)
			world.add(cylinderBody);

			// create player 1
			const player1Geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
			const player1Material = new THREE.MeshLambertMaterial({color:0xff9999});
			const player1 = new THREE.Mesh(player1Geometry, player1Material);
			player1.castShadow = true;
			player1.position.set(-1, 3, 0);
			scene.add(player1);

			// create physics for player 1
			const shape = new CANNON.Box(
				new CANNON.Vec3(0.25, 0.25, 0.25)
			);
			const body = new CANNON.Body({mass: 2});
			body.addShape(shape);
			body.position.set(-1, 3, 0);
			world.addBody(body);

			// create player 2
			const player2Geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
			const player2Material = new THREE.MeshLambertMaterial({color:0x99ff99});
			const player2 = new THREE.Mesh(player2Geometry, player2Material);
			player2.castShadow = true;
			player2.position.set(1, 3, 0);
			scene.add(player2);

			// create physics for player 2
			const shape2 = new CANNON.Box(
				new CANNON.Vec3(0.25, 0.25, 0.25)
			);
			const body2 = new CANNON.Body({mass: 2});
			body2.addShape(shape2);
			body2.position.set(1, 3, 0);
			world.addBody(body2);

			// create contact material behavior
			const material_ground = new CANNON.ContactMaterial(cylinderMaterial, player1Material, {
				friction: 0.0, restitution: 0.3
			});
			world.addContactMaterial(material_ground);

			// create skybox
			const cubeGeometry = new THREE.BoxGeometry(1000, 1000, 1000);
			const cubeMaterials = [
				new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("images/skybox_nx.jpg"), side: THREE.DoubleSide}),
				new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("images/skybox_px.jpg"), side: THREE.DoubleSide}),
				new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("images/skybox_nz.jpg"), side: THREE.DoubleSide}),
				new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("images/skybox_ny.jpg"), side: THREE.DoubleSide}),
				new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("images/skybox_py.jpg"), side: THREE.DoubleSide}),
				new THREE.MeshBasicMaterial({map: new THREE.TextureLoader().load("images/skybox_pz.jpg"), side: THREE.DoubleSide})
			];
			const cubeMaterial = new THREE.MeshFaceMaterial(cubeMaterials);
			const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
			scene.add(cube);

			// add fog
			//const fog = new THREE.Fog(0x666666, 1000, 5000);
			//scene.add(fog);

			// set up the lights
			const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
			scene.add(ambientLight);

			const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
			directionalLight.position.set(10, 20, 0);
			directionalLight.castShadow = true;
			scene.add(directionalLight);

			// move the camera
			camera.position.z = 5;
			camera.position.y = 3;
			camera.position.x = 0;
			camera.lookAt(0, 0, 0);
    };
}