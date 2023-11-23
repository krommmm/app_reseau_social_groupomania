import React from 'react';
import { useEffect, useState } from 'react';
import Comments from './Comments';
import PostDelete from './PostDelete';

import Likes from './Likes';
import varGlobal from '../varGlobal';

import { NavLink } from 'react-router-dom';

import TimeAgo from 'javascript-time-ago';

import en from 'javascript-time-ago/locale/en.json';
import ru from 'javascript-time-ago/locale/ru.json';
import ReactTimeAgo from '../Thread/ReactTimeAgo';

TimeAgo.addDefaultLocale(en);
TimeAgo.addLocale(ru);

export default function PostCard(props) {
	const [list, setList] = useState([]);

	var identifiant = sessionStorage.getItem('state');
	//Transformation de identifiant en objet pour avoir accès à token et userId
	var identifiantObjet = JSON.parse(identifiant);
	//Récupération de l'id de l'objet
	var id = identifiantObjet.userId;

	useEffect(() => {
		props.updateList(list); // dès que list remonte (de likes ou comments, renvoie les données à jour à index)
	}, [list]);

	//Accès à un post selon son id
	function handleSoloPost(e, r) {
		//Ajout de l'_id du post et de l'utilisateur dans le sessionStorage
		sessionStorage.setItem('idDuPost', e);
		sessionStorage.setItem('posterId', r);
	}

	return (
		<>
			{console.log(props.postData)}
			{/*Mappage antéchronologique du state objet */}
			<div className="display-post">
				{props.postData
					.slice(0)
					.reverse()
					.map((todo, index) => (
						<div key={index} style={{ width: '100%' }}>
							<div className="display-englober">
								<article className="display-container">
									<div className="head-container">
										<div className="profil_post">
											<p>
												<img
													className="image-profil"
													alt={
														todo.name +
														todo.firstName
													}
													src={
														varGlobal +
														'/images/' +
														todo.imageProfil
													}
												/>

												<div className="name_and_date">
													<span className="en-gras">
														{todo.name}{' '}
														{todo.firstName}
													</span>
													<div className="grey">
														<ReactTimeAgo
															date={todo.date}
															locale="en-US"
															timeStyle="twitter"
														/>
													</div>
												</div>
											</p>
										</div>
									</div>
									<p className="postMessage black_grey">
										{todo.posterMessage}
									</p>
									<br />
									{/*Si objet contient une image alors affiche l'image (pour le pas afficher le alt) */}
									<div className="posts_image_container">
										{todo.isImage && (
											<img
												src={
													varGlobal +
													'/images/' +
													todo.imageUrl
												}
												alt={
													'image du post de ' +
													todo.name +
													' ' +
													todo.firstName +
													' n°: ' +
													index
												}
												className="images"
											/>
										)}
									</div>
                  <br/>
                  <div className="ligne-séparation"></div>
									<div className="likes-modif-container">
										{/*Envoie du state objet à son enfant likes en prop */}
										<Likes
											myUserValues={todo}
											changeDisplayPostLikes={(todo) =>
												setList(todo)
											}
										/>

										<div aria-label="first link">
											<div
												type="button"
												onClick={(e) =>
													handleSoloPost(
														todo._id,
														todo.posterId
													)
												}
											>
												{(id === todo.posterId ||
													identifiantObjet.isAdmin ===
														true) && (
													<NavLink
														aria-label="first link"
														to="/User"
														className={({
															isActive,
														}) =>
															isActive
																? 'activeLink'
																: undefined
														}
													>
														{' '}
														<i className="fa-solid fa-ellipsis" /> <span class="grey bold">Modifier</span>
													</NavLink>
												)}
											</div>
										</div>

										{(id === todo.posterId ||
											identifiantObjet.isAdmin ===
												true) && (
											<PostDelete
												idDuPost={todo._id}
												updateList={(todo) =>
													setList(todo)
												}
											/>
										)}
									</div>
                  <div className="ligne-séparation"></div>
									<br />

									{/*console.log("la props postUser que je passe contient : " + "nom : "+ users[2].name + "----- avatar : " + users[2].imageProfil)*/}
									<Comments
										postData={todo}
										postUsers={props.users}
										updatePost={(todo) => setList(todo)}
									/>
								</article>
							</div>
						</div>
					))}
			</div>
		</>
	);
}
