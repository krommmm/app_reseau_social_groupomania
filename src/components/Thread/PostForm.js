import React from 'react';
import { useState, useEffect } from 'react';
import varGlobal from '../varGlobal';

export default function Post(props) {
	const [image, setImage] = useState();
	const [post, setPost] = useState(); // contient le msg
	const [infoPost, setInfoPost] = useState([]); // contient le post plus l'id du post
	const [trigger, setTrigger] = useState(false);
	const [user, setUser] = useState([]);

	var posterId = sessionStorage.getItem('img-profil');

	useEffect(() => {
		//Vérification du type de identifiant(sessionStorage)
		var identifiant = sessionStorage.getItem('state');
		//Transformation de identifiant en objet pour avoir accès à token et userId
		var identifiantObjet = JSON.parse(identifiant);

		fetch(`${varGlobal}/api/posts`, {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				Authorization: `Bearer ${identifiantObjet.token}`,
			},
		})
			.then((response) => response.json())
			.then((donnée) => {
				props.updatePost(donnée);
			})
			.catch((e) => {
				console.log(e);
			});
	}, [trigger]);

	//Pour afficher ou non le alt de l'image en preview

	var time = new Date();

	//Vérification du type de identifiant(sessionStorage)
	var identifiant = sessionStorage.getItem('state');
	//Transformation de identifiant en objet pour avoir accès à token et userId
	var identifiantObjet = JSON.parse(identifiant);
	//Récupération de l'id de l'objet
	var id = identifiantObjet.userId;

	//function HandlePost qui envoie données à l'api
	function HandlePost(e) {
		e.preventDefault();

		//Transformation des donnes en objet pour pouvoir effectuer une condition dessus(!= formData)
		var objetData = {
			image: image,
			posterMessage: post,
			date: time,
			posterId: id,
		};

		// Si l'image et le texte sont absent alors on ne post pas
		if (objetData.image == null && objetData.posterMessage == null) {
			setTimeout(() => {
				document.querySelector('.msg-error-post').style.visibility =
					'hidden';
			}, 3000);
			document.querySelector('.msg-error-post').style.visibility =
				'visible';
		} else {
			// Transformation des données en FormData
			const data = new FormData();
			data.append('image', image);
			data.append('posterMessage', post);
			data.append('date', time);
			data.append('posterId', id);

			document.querySelector('.modal').classList.remove('reveal');
			document.querySelector('.modal').classList.add('hidden');
			//Enregistrement de l'id du post dans le localStorage
			localStorage.setItem('infoPost', infoPost);

			fetch(`${varGlobal}/api/posts`, {
				method: 'POST',
				//mode: 'no-cors', // no-cors, *cors, same-origin
				//suppression   Accept: "application/json",  "Content-Type": "application/json",  "Content-Type":"multipart/form-data"
				'Content-Type': 'multipart/form-data',
				headers: {
					Authorization: `Bearer ${identifiantObjet.token}`, // pour le backend middleware/auth.js qui recup req.headers.authorization
				},
				body: data,
			})
				.then((response) => response.json())
				.then((donnée) => {
					setInfoPost(donnée); //Envoit dans le state l'_id du post

					setTrigger(true);
					setPost(undefined); // et non pas setPost("") ou setPost("undefined") car sinon unpty string au lieu de undefined
				})
				.catch((e) => {
					console.log(e);
				});
			setPost(''); //Une fois envoyé setInfoPost(undefined) ) la base de donnée, on reset l'input
			document.getElementById('blah').src = ''; //Reset image preview
			setTrigger(false);
		}
	}
	//Prévisualisation de l'image
	function handleImage(e) {
		document.querySelector('.modal').classList.remove('hidden');
		document.querySelector('.modal').classList.add('reveal');
		document.getElementById('blah').src = window.URL.createObjectURL(e);
	}

	//Return formulaire, submit lance la fonction HandlePost
	return (
		<>
			<div className="post-container">
				<form method="POST" onSubmit={HandlePost}>
					<div className="modal hidden">
						<div className="modal_content">
							<div className="preview">
								<img
									id="blah"
									alt=""
									width="100"
									height="100"
								/>
							</div>
							<label
								htmlFor="post"
								className="preview"
								aria-label="image"
							>
								{' '}
							</label>
						</div>
					</div>

					<div className="input_et_imageProfil">
						<img
							className="image-profil"
							alt=""
							src={varGlobal + '/images/' + posterId}
						/>
						<textarea
							name="post"
							id="post"
							value={post}
							placeholder={`Que voulez-vous dire,  ${identifiantObjet.name}`}
							onChange={(e) => setPost(e.target.value)}
						/>
					</div>

					<br />

					<div className="post-buttons">
						<div className="espace-bouton">
							<p className="image_space"></p>
							<label
								htmlFor="image"
								id="btn-image"
								aria-label="image"
							>
								{' '}
								<span className="black_grey bold">Image :</span>{' '}
								&nbsp; &nbsp;
								<i class="fa-solid fa-photo-film" />
								<br />
								<input
									type="file"
									id="image"
									name="image"
									onChange={(e) => {
										{
											setImage(e.target.files[0]);
										}
										{
											handleImage(e.target.files[0]);
										}
									}}
								/>
							</label>
						</div>
						<br />
						<br />
						<div className="espace-bouton">
							<p className="envoyer_space"></p>
							<label
								htmlFor="envoyer-image"
								aria-label="envoyer image"
							>
								<span className="black_grey bold">Envoyer :</span>
								&nbsp; &nbsp;
								<i className="fa-solid fa-paper-plane" />
							</label>
							<input
								type="submit"
								id="envoyer-image"
								value="Postez"
							/>
						</div>
					</div>
					<div className="msg-error-post">
						Veuillez au moins écrire un message ou poster une image
					</div>
				</form>
			</div>
		</>
	);
}
