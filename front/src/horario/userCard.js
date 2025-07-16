import "./userCard.css";

function UserCard({ user }) {
  return (
    <article className="user-card-article">
        <header>
            <div>
                <span>Bienvenido, </span>
                <strong>{user.name}</strong>
            </div>
        </header>
    </article>
  );
}
export default UserCard;