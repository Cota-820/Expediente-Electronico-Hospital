import "./botonHorario.css";

export default function BotonHorario( { contenido }) {
    return (
        <button className="btn-animated">
            
            <span className="arrow"> {contenido} </span>
        </button>
    );
}
