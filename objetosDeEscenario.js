class objetosDeEscenario {
    constructor(name,x,y,app,juego,imagenDir){
        this.juego = juego;
        this.x = x ;
        this.y = y ;
        this.app = app ;
        this.name = name; 
        this.sprite = null;
        this.listo = false;
        this.animaciones = {};  
        this.imagenDir = imagenDir
        this.cargarSpritesAnimados(); 
        this.crearContainer();
    }

    crearContainer() {
        this.container = new PIXI.Container();   
        
        this.juego.escena.addChild(this.container)
    }

    async cargarSpritesAnimados() {
        let json = await PIXI.Assets.load('arbol/texture.json');
        this.animaciones['idle'] = json.animations["idle"];
        this.sprite = new PIXI.AnimatedSprite(this.animaciones['idle']); //cargo la animacion
        this.sprite.anchor.set(0.5, 1);
        this.sprite.animationSpeed = 0.1;
        this.sprite.loop = true;
        this.sprite.x = this.x;
        this.sprite.y = this.y;
        this.sprite.play();
        this.listo = true;
        this.container.addChild(this.sprite)

    }

    cambiarAnimacion(nombre, haciaIzquierda = false) {
        if (this.animaciones[nombre]) {
            this.sprite.textures = this.animaciones[nombre];
            this.sprite.play();

            if (haciaIzquierda) {
                this.sprite.scale.x = -1;
                this.sprite.anchor.x = 1;
            } else {
                this.sprite.scale.x = 1;
                this.sprite.anchor.x = 0.5;
            }
        }
    }

    seleccionar() {
        // Podés mostrar un borde, sombra, o simplemente marcarlo como seleccionado
        console.log("objeto seleccionado");
        this.sprite.tint = 0x00ff00; // Lo tiñe de verde al seleccionarlo
    }
    
    deseleccionar() {
        this.sprite.tint = 0xFFFFFF; // Color original (sin tinte)
    }
    

        
}