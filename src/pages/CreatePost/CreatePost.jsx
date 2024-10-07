import styles from "./CreatePost.module.css";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthValue } from "../../context/AuthContext";
import { useInsertDocument } from "../../hooks/useInsertDocument";

const CreatePost = () => {
	const [title, setTitle] = useState("");
	const [image, setImage] = useState("");
	const [body, setBody] = useState("");
	const [tags, setTags] = useState([]);
	const [formError, setFormError] = useState("");

	const { user } = useAuthValue();
	const { insertDocument, response } = useInsertDocument("posts");

	const handleSubmit = (e) => {
		e.preventDefault();
		setFormError("");

		// validar url da imagem

		// criar array de tags

		// checar todos os valores

		insertDocument({
			title,
			image,
			body,
			tags,
			uid: user.uid,
			createdBy: user.displayName,
		});
	};

	return (
		<div className={styles.create_post}>
			<h2>Criar Post</h2>
			<p>Escreva sobre o que quiser e compartilhe o seu conhecimento!</p>
			<form onSubmit={handleSubmit}>
				<label>
					<span>Título: </span>
					<input
						type='text'
						name='title'
						required
						placeholder='Título do post'
						value={title}
						onChange={(e) => setTitle(e.target.value)}
					/>
				</label>
				<label>
					<span>Imagem: </span>
					<input
						type='text'
						name='image'
						required
						placeholder='Imagem do post'
						value={image}
						onChange={(e) => setImage(e.target.value)}
					/>
				</label>
				<label>
					<span>Corpo: </span>
					<textarea
						name='body'
						required
						placeholder='Corpo do post'
						value={body}
						onChange={(e) => setBody(e.target.value)}
					/>
				</label>
				<label>
					<span>Tags: </span>
					<input
						type='text'
						name='tags'
						required
						placeholder='Tags do post separadas por virgula'
						value={tags}
						onChange={(e) => setTags(e.target.value)}
					/>
				</label>
				{!response.loading && (
					<button className='btn'>Criar post!</button>
				)}
				{response.loading && (
					<button className='btn' disabled>
						Aguarde.. .
					</button>
				)}
				{(response.error || formError) && (
					<p className='error'>{response.error || formError}</p>
				)}
			</form>
		</div>
	);
};

export default CreatePost;
