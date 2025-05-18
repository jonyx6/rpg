class Personaje {
    constructor(nombre,x, y, app,juego,puntosDeAtaque,puntosDeDefensa,faccion) {
        this.nombre= nombre;
        this.x = x;
        this.y = y;
        this.app = app;
        this.juego = juego;
        this.puntosDeAtaque = puntosDeAtaque;
        this.puntosDeDefensa= puntosDeDefensa;
        this.faccion = faccion;
        this.vida = 100;
        this.animaciones = {};
        this.sprite = null;
        this.listo = false;
        //this.teclas = {}; // innecesario si no usamos teclado
        //this.detectarDeteclas(); // innecesario si no usamos teclado
        this.velocidad = 1 ;
        this.direccion =  { x : 0 , y : 0} ;
        this.destinoX = null;
        this.destinoY = null;
        this.crearContainer();
        
    }

    crearContainer() {
        this.container = new PIXI.Container();
        this.container.x = this.x;
        this.container.y = this.y;
        this.juego.escena.addChild(this.container);
    }

    updateZIndex() {

        this.container.zIndex = this.container.y;
    }

 

    guardarTecla_Apretada(unaTecla) {
        this.teclas[unaTecla.key.toLowerCase()] = true;
    }

    guardarTecla_Levantada(unaTecla) {
        this.teclas[unaTecla.key.toLowerCase()] = false;
    }

    getPositionY() {
        return this.y;
    }

    getPositionX() {
        return this.x;
    }

    setPositionx(unValor) {
        this.x = unValor;
        this.container.x = this.x;
    }


    async cargarSpritesAnimados() {
        let json = await PIXI.Assets.load('parado/idle.json');
        this.animaciones['idle'] = json.animations["idle"];
        this.sprite = new PIXI.AnimatedSprite(this.animaciones['idle']); //cargo la animacion
        this.sprite.anchor.set(0.5, 1);
        this.sprite.animationSpeed = 0.1;
        this.sprite.loop = true;
        this.sprite.x = 0;
        this.sprite.y = 0;
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

    moverALaDerecha(unValor) {
        this.x += unValor;
        if (this.sprite) {
            this.sprite.x = this.x;
        }
    }

    moverALaIzquieda(unValor) {
        this.x -= unValor;
        if (this.sprite) {
            this.sprite.x = this.x ;
        }
    }

    moverAbajo(unValor) {
        this.y += unValor;
        if (this.sprite) {
            this.sprite.y = this.y;
        }
    }

    moverArriba(unValor) {
        this.y -= unValor;
        if (this.sprite) {
            this.sprite.y = this.y;
        }
    }

    moverA(destX, destY) {
    this.destinoX = destX;
    this.destinoY = destY;
    }

    seleccionar() {
        // Podés mostrar un borde, sombra, o simplemente marcarlo como seleccionado
        console.log("Personaje seleccionado");
        this.sprite.tint = 0x00ff00; // Lo tiñe de verde al seleccionarlo
    }
    
    deseleccionar() {
    this.sprite.tint = 0xFFFFFF; // Color original (sin tinte)
    }
    
    update() {
        if (this.destinoX !== null && this.destinoY !== null) {
            const dx = this.destinoX - this.x;
            const dy = this.destinoY - this.y;
            const distancia = Math.sqrt(dx * dx + dy * dy);

            if (distancia > 1) {
                const dirX = dx / distancia;
                const dirY = dy / distancia;
                this.x += dirX * this.velocidad;
                this.y += dirY * this.velocidad;

                // Mover el container, no el sprite directamente
                this.container.x = this.x;
                this.container.y = this.y;
            } else {
                this.x = this.destinoX;
                this.y = this.destinoY;
                this.container.x = this.x;
                this.container.y = this.y;
                this.destinoX = null;
                this.destinoY = null;
            }
        }
    }


}

