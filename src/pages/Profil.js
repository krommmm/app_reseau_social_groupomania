
import MyProfil from "../components/Profil/MyProfil";
import PageAttente from "../components/Profil/PageAttente";

import {useContext} from "react";
import {ThemeContext} from "../context/Theme";


export default function Profil() {

  const [{theme}] = useContext(ThemeContext);

  var isUserConnected = sessionStorage.getItem("state");
//Si l'utilisateur est connecté => myProfil , sinon pageAttente
  return (
    <>
      <section className="profil" style={{filter:theme.filter}}>
        <div className="main">
          {isUserConnected !== null ? <MyProfil /> : <PageAttente />}
        </div>
        <br />
      </section>
    </>
  );
}
