import "./cabecera.css";

function Cabecera ( { mes } ) {
    return (
        <header className='cabecera'>
            <strong>{mes}</strong>
        </header>
    );
}

export default Cabecera;