import CommentModif from './CommentModif';
import CommentDelete from './CommentDelete';
import { useState, useEffect } from 'react';
import CommentImgProfil from './CommentImgProfil';

import TimeAgo from 'javascript-time-ago';

import en from 'javascript-time-ago/locale/en.json';
import ru from 'javascript-time-ago/locale/ru.json';
import ReactTimeAgo from '../Thread/ReactTimeAgo';

TimeAgo.addDefaultLocale(en);
TimeAgo.addLocale(ru);

export default function CommentCard(props) {
	const [post, setPost] = useState([]);
	const [users, setUsers] = useState();

	useEffect(() => {
		props.updateState(post);
	}, [post]);

	var identifiant = sessionStorage.getItem('state');
	//Transformation de identifiant en objet pour avoir accès à token et userId
	var identifiantObjet = JSON.parse(identifiant);
	//Récupération de l'id de l'objet
	var id = identifiantObjet.userId;

	return (
		<>
			{props.postData.comments.map((all, index) => (
				<div key={index}>
					<div className="comment-head">
						<div className="profil_and_name">
							<CommentImgProfil
								monCommentaire={all}
								user={props.postUsers}
								updateUsers={(users) => setUsers(users)}
							/>

							<div className="comment-container">
								<div className="comment_container-header">
									<div className="nomPrenomModifSuppr">
										<span className="en-gras">
											{all.commenterName}{' '}
											{all.commenterFirstName}
										</span>
									</div>
								</div>
								<div className="comment_container-body">
									{all.text}{' '}
								</div>
							</div>
						</div>

						<div className="modifAndDelete">
							<div className="grey">
								<ReactTimeAgo
									date={all.date}
									locale="en-US"
									timeStyle="twitter"
								/>
							</div>
              &nbsp; &nbsp; &nbsp;
							{(id === all.commenterId ||
								identifiantObjet.isAdmin === true) && (
								<CommentModif
									postInfo={props.postData}
									commentaireInfo={all}
									updateState={(post) => setPost(post)}
								/>
							)}

							{(id === all.commenterId ||
								identifiantObjet.isAdmin === true) && (
								<CommentDelete
									postInfo={props.postData}
									commentaireInfo={all}
									updateState={(post) => setPost(post)}
								/>
							)}
						</div>
					</div>
					<br />
				</div>
			))}
		</>
	);
}
