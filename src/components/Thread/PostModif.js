import { useState, useEffect } from "react";
import varGlobal from "../varGlobal";
import { NavLink } from "react-router-dom";

export default function FormModif() {
  //Enlèvement de l'item modif dans le sessionStorage pour indiquer que <OnePost/> doit être choisit au lieu de <FormModif/> quand on retourne sur <User/>
  sessionStorage.removeItem("modif");

  const [soloPost, setSoloPost] = useState(""); //Post selon id
  const [image, setImage] = useState();
  const [post, setPost] = useState(""); //Contient les info envoyé à la bdd
  const [isImage, setIsImage] = useState(); //Y a t-il un image ?
  const [isText, setIsText] = useState(); //Y a t-il un message ?

  useEffect(() => {
    setPost(soloPost.posterMessage);
    setImage(soloPost.imageUrl);
  }, [soloPost]);

  useEffect(() => {
    RécupérationDuPost();
  }, []);

  function RécupérationDuPost() {
    //Récupération de l'id du post pour le GET POSTS/:id
    var idDuPoste = sessionStorage.getItem("idDuPost");

    //Réupération du token de l'identifiant pour authorization
    var identifiant = sessionStorage.getItem("state");
    var identifiantObjet = JSON.parse(identifiant);

    //---------FETCH GET---------------
    fetch(`${varGlobal}/api/posts/${idDuPoste}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${identifiantObjet.token}`, // On doit envoyer ça pour le backend middleware/auth.js qui recup req.headers.authorization
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setSoloPost(data);
        //Si pas de msg => isText = true et inversement
        if (data.posterMessage !== "undefined") {
          setIsText(true);
        } else {
          setIsText(false);
        }

        if (data.imageUrl === undefined) {
          setIsImage(false);
        } else {
          setIsImage(true);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }

  //Modification du post
  function HandleModif(e) {
    e.preventDefault();
    //Réupération du token de l'identifiant pour authorization
    var identifiant = sessionStorage.getItem("state");
    var identifiantObjet = JSON.parse(identifiant);

    //Récupération de l'id du post pour le GET POSTS/:id
    var idDuPoste = sessionStorage.getItem("idDuPost");

    // Transformation des données en FormData
    const data = new FormData();
    data.append("image", image);
    data.append("posterMessage", post);

    fetch(`${varGlobal}/api/posts/${idDuPoste}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${identifiantObjet.token}`, // On doit envoyer ça pour le backend middleware/auth.js qui recup req.headers.authorization
      },
      body: data,
    })
      .then((response) => response.json())
      .then((donnée) => {
    
        alert("Post modifié");
      })

      .catch((e) => {
        console.log(e);
      });
  }

  //Prévisualisation de l'image
  function handleImage(e) {
    document.getElementById("blah").src = window.URL.createObjectURL(e);
    document.querySelector("#blah").classList.remove("hidden");
    document.querySelector("#blah").classList.add("reveal");
  }

  return (
    <>
      <div className="form-modif-container">
        <div className="display-container">
          <form method="PUT" id="modif-post-form" onSubmit={HandleModif}>
            <br />
            <img class="imgModif hidden" id="blah" width="200" height="100" alt="" />
            {isText && (
              <h1>
                <span className="en-gras">Modifier le texte ?</span>
              </h1>
            )}
            <br />
            <br />
            <label htmlFor="my-post" name="my-post" id="postMyText">
              dfdf
            </label>
            {isText && (
              <textarea
                className="post"
                name="post"
                id="my-post"
                placeholder="Ecrivez un post"
                spellCheck="false"
                onChange={(e) => setPost(e.target.value)}
                defaultValue={soloPost.posterMessage}
              />
            )}
            <br />
            <br />
            <div >
              <label htmlFor="image">
                <span className="en-gras">Modifier l'image ?...</span>{" "}
                <i className="fa-regular fa-image" />
                <br />
                <br />
              </label>
            </div>
            <br />
            <br />
            {isImage && (
              <img
                className="img-Form-modif"
                alt="truc du post"
                src={varGlobal + "/images/" + soloPost.imageUrl}
              />
            )}
            <br />
            <input
              type="file"
              id="image"
              name="image"
              onChange={(e) => {
                
                  setImage(e.target.files[0]);
                
                
                  handleImage(e.target.files[0]);
                }
              }
            />
            <br />
            <br />
            <br />
            <div>
              <input
                className="bouton-rouge"
                type="submit"
                value="Modifier"
                id="oks"
                name="posters"
              />
            </div>
            <br /> <br />
            <NavLink
              aria-label="first link"
              to="/"
              className={({ isActive }) =>
                isActive ? "activeLink" : undefined
              }
            >
              <input className="bouton-rouge" type="submit" value="retour" />
            </NavLink>
          </form>
        </div>
      </div>
    </>
  );
}
