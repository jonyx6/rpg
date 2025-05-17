class Puntero {
    constructor(app, juego) {
        this.app = app;
        this.juego = juego;
        this.personajesSeleccionados = [];
        this.objetoSeleccionados=[];
        this.rectanguloSeleccion = new PIXI.Graphics();
        this.app.stage.addChild(this.rectanguloSeleccion);
        this.iniciandoSeleccion = false;
        this.puntoInicioSeleccion = null;
        this.iniciarEventos();
    }

    iniciarEventos() {
        
        //  quiero que el escenario detecte clics. Y cuando alguien haga clic, ejecutá mi función detectarClicEnPersonaje."
        this.app.stage.eventMode = 'static'; // le decis al stage que escuche eventos.
        this.app.stage.on('pointerdown', this.detectarClicEnPersonaje.bind(this));

        this.app.stage.on('pointerdown', this.iniciarSeleccion.bind(this));
        this.app.stage.on('pointermove', this.actualizarRectanguloSeleccion.bind(this));
        this.app.stage.on('pointerup', this.finalizarSeleccion.bind(this));
        
        // Detectar clic derecho.
        this.app.stage.on('pointerdown', this.detectarClicDerecho.bind(this));
    }

    detectarClicEnPersonaje(evento) {
        const posicion = evento.global;
    
        if (this.juego && this.juego.personajes || this.juego.objetosDeEscenario) {

            this.deseleccionarPersonajes()
            const personajeClickeado = this.juego.personajes.find(p => {
                const areaDelSprite = p.sprite.getBounds();
                return (
                    this.estaDentroDelSprite(posicion,areaDelSprite)
                );
            });

            const objetoClickeado = this.juego.objetosDeEscenario.find(o => {
            const areaDelSpriteDelObjeto = o.sprite.getBounds();
                return (
                    this.estaDentroDelSprite(posicion,areaDelSpriteDelObjeto)
                );
            });
    
            if (personajeClickeado ) {
                this.personajesSeleccionados = [personajeClickeado];
                
                personajeClickeado.seleccionar();
                
            } else if (objetoClickeado){

                this.objetoSeleccionados =[objetoClickeado]

                objetoClickeado.seleccionar();
            }


        } else {
            console.error("No se encontraron personajes en juego.");
        }

    }

    estaDentroDelSprite(unaPosicion, unSprite) {
         return (
            unaPosicion.x >= unSprite.x &&
            unaPosicion.x <= unSprite.x + unSprite.width &&
            unaPosicion.y >= unSprite.y &&
            unaPosicion.y <= unSprite.y + unSprite.height
        );
    }



    deseleccionarPersonajes() {
        if (this.personajesSeleccionados && this.personajesSeleccionados.length > 0 ) {
            this.personajesSeleccionados.forEach(p => p.deseleccionar());
            this.objetoSeleccionados.forEach(o => o.deseleccionar())
        }else if(this.objetoSeleccionados && this.objetoSeleccionados > 0){
            this.objetoSeleccionados.forEach(o => o.deseleccionar())
        }
    }
    
    ordenarMover(posicion) {
        const cantidad = this.personajesSeleccionados.length;
        const radio = 30; // distancia del centro

        for (let i = 0; i < cantidad; i++) {
            const angulo = (2 * Math.PI * i) / cantidad;
            const offsetX = Math.cos(angulo) * radio;
            const offsetY = Math.sin(angulo) * radio;

            const destino = {
                x: posicion.x + offsetX,
                y: posicion.y + offsetY,
            };

            this.personajesSeleccionados[i].moverA(destino.x, destino.y);
        }
    }

    detectarClicDerecho(evento) {
        
    // Verificamos si el clic fue derecho (botón 2 del ratón).
        if (evento.data.originalEvent.button === 2) { // button 2 es el clic derecho
         const posicion = evento.global;
        // Aquí llamamos a ordenarMover sin necesidad de hacer nada con personajes.
            this.ordenarMover(posicion);
        }
        
    }

    iniciarSeleccion(evento) {
    // Solo si es clic izquierdo
    if (evento.data.originalEvent.button !== 0) return;

        this.iniciandoSeleccion = true;
        this.puntoInicioSeleccion = evento.global.clone();
        this.rectanguloSeleccion.clear();
    }

    actualizarRectanguloSeleccion(evento) {
        if (!this.iniciandoSeleccion) return;

        const actual = evento.global;
        const inicio = this.puntoInicioSeleccion;

        const x = Math.min(inicio.x, actual.x);
        const y = Math.min(inicio.y, actual.y);
        const width = Math.abs(inicio.x - actual.x);
        const height = Math.abs(inicio.y - actual.y);

        this.rectanguloSeleccion.clear();
        this.rectanguloSeleccion.lineStyle(1, 0x00ff00);
        this.rectanguloSeleccion.beginFill(0x00ff00, 0.1);
        this.rectanguloSeleccion.drawRect(x, y, width, height);
        this.rectanguloSeleccion.endFill();
    }

   finalizarSeleccion(evento) {
        if (!this.iniciandoSeleccion) return;
            this.iniciandoSeleccion = false;
            this.rectanguloSeleccion.clear();

            const actual = evento.global;
            const inicio = this.puntoInicioSeleccion;

            const deltaX = Math.abs(actual.x - inicio.x);
            const deltaY = Math.abs(actual.y - inicio.y);

            const umbralArrastre = 5; // Si se mueve menos de 5px, lo consideramos un clic

        if (deltaX < umbralArrastre && deltaY < umbralArrastre) {
        // Es un clic, no hacemos selección múltiple.
            return;
        }

       // Arrastre válido: continuar con selección múltiple.
            const x = Math.min(inicio.x, actual.x);
            const y = Math.min(inicio.y, actual.y);
            const width = Math.abs(inicio.x - actual.x);
            const height = Math.abs(inicio.y - actual.y);
            const rectSeleccion = new PIXI.Rectangle(x, y, width, height);

            this.deseleccionarPersonajes();
            this.personajesSeleccionados = [];

            if (this.juego && this.juego.personajes) {
                for (let p of this.juego.personajes) {
                    const bounds = p.sprite.getBounds();
                    if (rectSeleccion.contains(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2)) {
                     this.personajesSeleccionados.push(p);
                     p.seleccionar();
                    }
                }
            }
    }



}
