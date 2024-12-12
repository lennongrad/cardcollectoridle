import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, SimpleChange, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { PackType } from '../interfaces';

@Component({
  selector: 'app-pack-model',
  templateUrl: './pack-model.component.html',
  styleUrl: './pack-model.component.less'
})
export class PackModelComponent implements AfterViewInit, OnChanges  {
  @ViewChild("canvasBox")
  canvas?: ElementRef

  @Input() pack?: PackType;

  canvasSizes = {
    width: 160,
    height: 280,
  };

  model?: THREE.Group<THREE.Object3DEventMap>
  
  lastMoveX: number = 0
  lastMoveY: number = 0

  flipPack: boolean = false 
  flipPackDisplacement: number = 0

  mouseIn: boolean = false

  rectLight?: THREE.RectAreaLight

  constructor(private element: ElementRef) {}

  ngAfterViewInit(): void {
   this.createThreeJsBox();
  }
 
  createThreeJsBox(): void {


    const scene = new THREE.Scene();

    
    const loader = new GLTFLoader();
    // Load a glTF resource
    loader.load(
      // resource URL
      'assets/scene.glb',
      // called when the resource is loaded
      ( gltf ) => {
        this.model = gltf.scene
        scene.add( this.model );    
        this.model.scale.set(60,60,60) 
        this.model.rotation.x = Math.PI * .5

        this.updateTexture()

        var box = new THREE.Box3().setFromObject( this.model );
        box.getCenter( this.model.position ); // this re-sets the mesh position
        this.model.position.multiplyScalar( - 1 );
      }
    );

    const ambientLight = new THREE.AmbientLight(0xffffff, .5);
    scene.add(ambientLight);
    
    const width = 15;
    const height = 15;
    this.rectLight = new THREE.RectAreaLight( 0xffffff, 2,  width, height );
    this.rectLight.position.set( 0, 5, 8 );
    this.rectLight.lookAt( 0, 0, 0 );
    scene.add(this.rectLight); 

    const camera = new THREE.PerspectiveCamera(
      75,
      this.canvasSizes.width / this.canvasSizes.height,
      0.001,
      1000
    );
    camera.position.z = 22;
    scene.add(camera);

    if (!this.canvas) {
      return;
    }

    const renderer = new THREE.WebGLRenderer({
      canvas: this.canvas.nativeElement,
      logarithmicDepthBuffer: true
    });
    renderer.setClearColor(0xe232222, 0);
    renderer.setSize(this.canvasSizes.width, this.canvasSizes.height);

    const clock = new THREE.Clock();

    const animateGeometry = () => {
      const elapsedTime = clock.getElapsedTime();

      // Update animaiton objects
      if(this.model != undefined){
        this.model!.rotation.z = (this.flipPackDisplacement - this.lastMoveX * 1/8) * Math.PI
        this.model!.rotation.x = (1/2 + this.lastMoveY * 1/16) * Math.PI
      }

      if(!this.mouseIn){
        this.lastMoveX *= .9
        this.lastMoveY *= .9
      }

      if(this.flipPack){
        this.flipPackDisplacement = Math.min(1, this.flipPackDisplacement += .1)
        this.model!.position.z = 2
      } else if(this.model != undefined) {
        this.flipPackDisplacement *= .9
        this.model!.position.z = -2.7
      }

      // Render
      renderer.render(scene, camera);

      // Call tick again on the next frame
      window.requestAnimationFrame(animateGeometry);
    };

    animateGeometry();
  }

  updateTexture() {
    if(this.model == undefined && this.pack != undefined)
      return;

    this.model!.rotation.order = "XZY";

    var filename: string = `assets/pack_${this.pack?.texture}_${this.pack?.adjustment}_${this.pack?.currentAlternate!+1}.png`

    const texture = new THREE.TextureLoader().load(filename); 
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.flipY = true
    texture.wrapS = 1000
    texture.wrapT = 1000

    this.model!.traverse((o: any) => {
      if (o.isMesh) {
        o.material.alphaToCoverage = true
        o.material.map = texture
      }
    });
  }

  ngOnChanges(changes: any) {
    this.updateTexture()
  }

  onRightClick(event: MouseEvent): false {
    this.flipPack = !this.flipPack
    return false
  }

  onMouseMove(event: MouseEvent) {  
    this.mouseIn = true
    this.lastMoveX = Math.max(-1, Math.min(1, 2 * event.offsetX / this.canvasSizes.width - 1))
    this.lastMoveY = Math.max(-1, Math.min(1, 2 * event.offsetY / this.canvasSizes.height - 1))
  }

  onMouseIn() {
    this.rectLight!.intensity = 6;
  }

  onMouseOut(event: MouseEvent) {
    this.mouseIn = false
    this.flipPack = false
    this.rectLight!.intensity = 2
    //this.lastMoveX = 0
    //this.lastMoveY = 0
  }

}
