import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const Header = ({ onLogout, nombreTerapeuta }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleAgregarRegistro = () => {
    navigate("/agregar-registro");
  };

  return (
    <HeaderContainer>
      <InstitutionLogo
        src="./LogoOficial_HIC_Horizontal.png"
        alt="Institución"
      />
      <ProfileContainer>
        <ProfileName onClick={toggleMenu}>
          Bienvenid@, {nombreTerapeuta}
        </ProfileName>
        {menuOpen && (
          <DropdownMenu>
            <MenuItem>Ver horario</MenuItem>
          </DropdownMenu>
        )}
      </ProfileContainer>
      <ButtonGroup>
        <ActionButton onClick={handleAgregarRegistro}>
          Agregar Registro
        </ActionButton>
        <LogoutButton onClick={onLogout}>Cerrar Sesión</LogoutButton>
      </ButtonGroup>
    </HeaderContainer>
  );
};

export default Header;

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #f5f5f5;
  border-bottom: 1px solid #ddd;
`;

const InstitutionLogo = styled.img`
  height: 50px;
`;

const ProfileContainer = styled.div`
  position: relative;
`;

const ProfileName = styled.div`
  cursor: pointer;
  font-weight: bold;
  font-size: 1.2rem;
  color: #333;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
  transition: color 0.3s ease;

  &:hover {
    color: #007bff;
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 30px;
  right: 0;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  z-index: 1000;
`;

const MenuItem = styled.div`
  padding: 10px 20px;
  cursor: pointer;

  &:hover {
    background-color: #f5f5f5;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
`;

const ActionButton = styled.button`
  padding: 10px 20px;
  border: none;
  background-color: #4caf50;
  color: white;
  cursor: pointer;
  border-radius: 5px;

  &:hover {
    background-color: #45a049;
  }
`;

const LogoutButton = styled.button`
  padding: 10px 20px;
  border: none;
  background-color: #ff4d4d;
  color: white;
  cursor: pointer;
  border-radius: 5px;

  &:hover {
    background-color: #ff1a1a;
  }
`;
