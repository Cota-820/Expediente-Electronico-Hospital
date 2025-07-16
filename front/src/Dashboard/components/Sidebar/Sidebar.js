/*eslint-disable*/
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";

export default function Sidebar() {
  const [collapseShow, setCollapseShow] = React.useState("hidden");
  const location = useLocation();
  const navigate = useNavigate();

  const [token] = useState(
    location.state?.token || localStorage.getItem("token")
  );
  const [user] = useState(
    location.state?.user || JSON.parse(localStorage.getItem("user"))
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login-sign-in-up");
  };

  const AnimatedButton = styled(Button)({
    transition: "all 0.3s ease-in-out",
    backgroundColor: "transparent",
    color: "blue",
    border: "2px solid blue",
    fontWeight: "bold",
    width: "fit-content",
    alignSelf: "center",
    "&:hover": {
      backgroundColor: "red",
      color: "white",
    },
    "&:active": {
      transform: "scale(0.95)",
    },
  });

  return (
    <>
      <nav className="md:left-0 md:block md:fixed md:top-0 md:bottom-0 md:overflow-y-auto md:flex-row md:flex-nowrap md:overflow-hidden shadow-xl bg-white flex flex-wrap items-center justify-between relative md:w-64 z-10 py-4 px-6">
        <div className="md:flex-col md:items-stretch md:min-h-full md:flex-nowrap px-0 flex flex-wrap items-center justify-between w-full mx-auto">
          {/* Toggler */}
          <button
            className="cursor-pointer text-black opacity-50 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent"
            type="button"
            onClick={() => setCollapseShow("bg-white m-2 py-3 px-6")}>
            <i className="fas fa-bars"></i>
          </button>
          {/* Brand */}
          <div className="md:block text-left md:pb-2 text-blueGray-600 mr-0 inline-block whitespace-nowrap text-sm uppercase font-bold p-4 px-0">
            <img
              alt="Hospital Infantil de las Californias"
              className="w-full inline-block align-middle border-none"
              src={require("../../../public/LogoOficial_HIC_horizontal.png")}
            />
          </div>
          {/* Collapse */}
          <div
            className={
              "md:flex md:flex-col md:items-stretch md:opacity-100 md:relative md:mt-4 md:shadow-none shadow absolute top-0 left-0 right-0 z-40 overflow-y-auto overflow-x-hidden h-auto items-center flex-1 rounded " +
              collapseShow
            }>
            {/* Collapse header */}
            <div className="md:min-w-full md:hidden block pb-4 mb-4 border-b border-solid border-blueGray-200">
              <div className="flex flex-wrap">
                <div className="w-6/12">
                  <Link className="md:block text-left md:pb-2 text-blueGray-600 mr-0 inline-block whitespace-nowrap text-sm uppercase font-bold p-4 px-0">
                    Hospital Infantil de las Californias
                  </Link>
                </div>
                <div className="w-6/12 flex justify-end">
                  <button
                    type="button"
                    className="cursor-pointer text-black opacity-50 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent"
                    onClick={() => setCollapseShow("hidden")}>
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              </div>
            </div>

            {/* Divider */}
            <hr className="my-4 md:min-w-full" />
            {/* Heading */}
            <h6 className="md:min-w-full text-blueGray-500 text-xs uppercase font-bold block pt-1 pb-4 no-underline">
              Admin Layout Pages
            </h6>
            {/* Navigation */}

            <ul className="md:flex-col md:min-w-full flex flex-col list-none">
              <li className="items-center">
                <Link
                  className={
                    "text-xs uppercase py-3 font-bold block " +
                    (location.pathname.indexOf("/admin") !== -1
                      ? "text-lightBlue-500 hover:text-lightBlue-600"
                      : "text-blueGray-700 hover:text-blueGray-500")
                  }
                  to="/admin">
                  <i
                    className={
                      "fas fa-tv mr-2 text-sm " +
                      (location.pathname.indexOf("/admin") !== -1
                        ? "opacity-75"
                        : "text-blueGray-400")
                    }></i>{" "}
                  Dashboard
                </Link>
              </li>

              <li className="items-center">
                <Link
                  className={
                    "flex items-center text-xs uppercase py-3 font-bold block " +
                    (location.pathname.indexOf("/admin/settings") !== -1
                      ? "text-lightBlue-500 hover:text-lightBlue-600"
                      : "text-blueGray-700 hover:text-blueGray-500")
                  }
                  to="/admin/settings">
                  <i
                    className={
                      "fas fa-tools mr-2 text-sm " +
                      (location.pathname.indexOf("/admin/settings") !== -1
                        ? "opacity-75"
                        : "text-blueGray-400")
                    }></i>{" "}
                  Ajustes
                </Link>
              </li>
            </ul>

            {/* Divider */}
            <hr className="my-4 md:min-w-full" />
            {/* Heading */}
            <h6 className="md:min-w-full text-blueGray-500 text-xs uppercase font-bold block pt-1 pb-4 no-underline">
              Gestion de Usuarios
            </h6>
            {/* Navigation */}

            <ul className="md:flex-col md:min-w-full flex flex-col list-none">
              <li className="items-center">
                <Link
                  className={
                    "flex items-center text-xs uppercase py-3 font-bold block " +
                    (location.pathname.indexOf("/admin/tables") !== -1
                      ? "text-lightBlue-500 hover:text-lightBlue-600"
                      : "text-blueGray-700 hover:text-blueGray-500")
                  }
                  to="/admin/tables">
                  <i
                    className={
                      "fas fa-users mr-2 text-sm " +
                      (location.pathname.indexOf("/admin/tables") !== -1
                        ? "opacity-75"
                        : "text-blueGray-400")
                    }></i>
                  Usuarios
                </Link>
              </li>

              <li className="items-center">
                <Link
                  className={
                    "flex items-center text-xs uppercase py-3 font-bold block " +
                    (location.pathname === "/admin/new-user"
                      ? "text-lightBlue-500 bg-blue-100 rounded-lg"
                      : "text-blueGray-700 hover:text-lightBlue-500")
                  }
                  to="/admin/new-user">
                  <i
                    className={
                      "fas fa-user-plus mr-2 text-sm " +
                      (location.pathname.indexOf("/admin/tables") !== -1
                        ? "opacity-75"
                        : "text-blueGray-400")
                    }></i>
                  Nuevo registro
                </Link>
              </li>
            </ul>

            {/* Divider */}
            <hr className="my-4 md:min-w-full" />
            {/* Heading */}
            <h6 className="md:min-w-full text-blueGray-500 text-xs uppercase font-bold block pt-1 pb-4 no-underline">
              Documentación
            </h6>
            {/* Navigation */}
            <ul className="md:flex-col md:min-w-full flex flex-col list-none">
              <li className="inline-flex">
                <a
                  href=""
                  target="_blank"
                  className="text-blueGray-700 hover:text-blueGray-500 text-sm block mb-4 no-underline font-semibold">
                  <i className="fas fa-book mr-2 text-blueGray-400 text-base"></i>
                  Manual de usuario
                </a>
              </li>

              <li className="inline-flex">
                <a
                  href=""
                  target="_blank"
                  className="text-blueGray-700 hover:text-blueGray-500 text-sm block mb-4 no-underline font-semibold">
                  <i className="fas fa-file-code mr-2 text-blueGray-400 text-base"></i>
                  Documentación Expedientes
                </a>
              </li>

              <li className="inline-flex">
                <a
                  href="https://docs.google.com/document/d/1tc99Fa6b1d7vU4W2Q6aLPolYete8amP2107ne-vey-M/edit?tab=t.0"
                  target="_blank"
                  className="text-blueGray-700 hover:text-blueGray-500 text-sm block mb-4 no-underline font-semibold">
                  <i className="fas fa-network-wired mr-2 text-blueGray-400 text-base"></i>
                  Documentación de API
                </a>
              </li>
            </ul>

            {/* Divider */}
            <hr className="my-4 md:min-w-full" />
            <AnimatedButton variant="outlined" onClick={handleLogout}>
              Cerrar sesión
            </AnimatedButton>
          </div>
        </div>
      </nav>
    </>
  );
}
