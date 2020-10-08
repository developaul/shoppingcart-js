import '../css/normalize.css';
import '../css/skeleton.css';


// Referencias
const listaCursos       = document.querySelector( '#lista-cursos' ),
      contenedorCarrito = document.querySelector( '#lista-carrito tbody' ),
      carrito           = document.querySelector( '#carrito' ),
      vaciarCarritoBtn  = document.querySelector( '#vaciar-carrito' );


// Variables
let articulosCarrito = [];


// Funciones
// Sincroniza el Local Storage
const sincronizarStorage = () => {
    localStorage.setItem( 'carrito', JSON.stringify( articulosCarrito ) );    
}

// Limpia el HTml del carrito
const limpiarHTML = () => {
    while( contenedorCarrito.firstChild ) {
        contenedorCarrito.removeChild( contenedorCarrito.firstChild );
    }
}

// Muestra el carrito de compras en el HTML
const carritoHTML = () => {
    // Limpiar el HTML
    limpiarHTML();

    articulosCarrito.forEach( course => {
        const { image, title, price, quantity, id } = course;

        const row = document.createElement( 'tr' );
        row.innerHTML = `
            <td><img src="${ image }" width="100"/></td>
            <td><h4>${ title }</h4></td>
            <td><p>${ price }</p></td>
            <td><p>${ quantity }</p></td>
            <td><a href="#" class="borrar-curso" data-id="${ id }"> X </a></td>
        `;

        contenedorCarrito.appendChild( row );
    });

    sincronizarStorage();
}

// Esta función lee los datos de un curso
const leerDatosCurso = course => {
    // Almacenando información en un objeto
    const infoCourse = {
        image       : course.querySelector( 'img' ).src,
        title       : course.querySelector( 'h4' ).textContent,
        price       : course.querySelector( '.precio span' ).textContent,
        id          : course.querySelector( 'a' ).getAttribute( 'data-id' ),
        quantity    : 1
    }

    // Revisa si un elemento ya existe en el carrito
    const exists = articulosCarrito.some( course => course.id === infoCourse.id );

    if( exists ) {
        // Actualizando la cantidad
        const courses = articulosCarrito.map( course => {
            if( course.id === infoCourse.id ) { 
                course.quantity++; 
            }
            return course;
        });

        articulosCarrito = [ ...courses ];
    } else {
        // Agrega un nuevo curso al carrito
        articulosCarrito = [ ...articulosCarrito, infoCourse ];
    }

    carritoHTML();
}

// Agrega un curso al carrito
const agregarCurso = event => {
    event.preventDefault();
    
    if( event.target.classList.contains( 'agregar-carrito' ) ) {
        const cursoSeleccionado = event.target.parentElement.parentElement;
        leerDatosCurso( cursoSeleccionado );
    }
}

// Elimina un curso del carrito
const eliminarCurso = event => {
    event.preventDefault();

    if( event.target.classList.contains( 'borrar-curso' ) ) {
        const courseId = event.target.getAttribute( 'data-id' );

        // Verificando si la cantidad no es mayor que 1 para luego eliminarlo
        articulosCarrito.forEach( ( course, index, array ) => {
            if( course.id === courseId ) {
                ( course.quantity > 1 ) ?  course.quantity-- : array.splice( index, 1 );
            }
        });

        carritoHTML();
    }
}


// Eventos
export function cargarEventListeners() {
    // Agrega un curso al carrito
    listaCursos.addEventListener( 'click',  agregarCurso );

    // Elimina un curso del carrito
    carrito.addEventListener( 'click', eliminarCurso );

    // Varciar el carrito
    vaciarCarritoBtn.addEventListener( 'click', () => {
        articulosCarrito = [];
        carritoHTML();
    });

    // Muestra los cursos del Local Storage
    document.addEventListener( 'DOMContentLoaded', () => {
        articulosCarrito = ( localStorage.getItem( 'carrito' ) ) 
                                ? JSON.parse( localStorage.getItem( 'carrito' ) )
                                : [];
        carritoHTML();
    });
}