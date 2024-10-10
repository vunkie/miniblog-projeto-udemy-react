import styles from "./EditPost.module.css";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthValue } from "../../context/AuthContext";
import { useUpdateDocument } from "../../hooks/useUpdateDocument";
import { useFetchDocument } from "../../hooks/useFetchDocument";

const EditPost = () => {
	const { id } = useParams();
	const { document: post } = useFetchDocument("posts", id);

	const [title, setTitle] = useState("");
	const [image, setImage] = useState("");
	const [body, setBody] = useState("");
	const [tags, setTags] = useState([]);
	const [formError, setFormError] = useState("");

	useEffect(() => {
		if (post) {
			setTitle(post.title);
			setImage(post.image);
			setBody(post.body);
			const textTags = post.tagsArray.join(", ");
			setTags(textTags);
		}
	}, [post]);

	const { user } = useAuthValue();
	const { updateDocument, response } = useUpdateDocument("posts");
	const navigate = useNavigate();

	const handleSubmit = (e) => {
		e.preventDefault();
		setFormError("");

		// validar url da imagem
		try {
			new URL(image);
		} catch (error) {
			setFormError("URL da imagem inválida");
		}

		// criar array de tags
		const tagsArray = tags
			.split(",")
			.map((tag) => tag.trim().toLowerCase());

		// checar todos os valores
		if (!title || !image || !body || !tags) {
			setFormError("Preencha todos os campos");
		}
		if (formError) return;

		const data = {
			title,
			image,
			body,
			tagsArray,
			uid: user.uid,
			createdBy: user.displayName,
		}

		updateDocument(id, data);

		navigate("/dashboard");
	};

	return (
		<div className={styles.edit_post}>
			{post && (
				<>
					<h2>Editando Post: {post.title}</h2>
					<p>Altere os dados do post como desejar</p>
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
						<p className={styles.preview_title} >Preview da Imagem atual:</p>
						<img className={styles.image_preview} src={post.image} />
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
							<button className='btn'>Editar</button>
						)}
						{response.loading && (
							<button className='btn' disabled>
								Aguarde.. .
							</button>
						)}
						{(response.error || formError) && (
							<p className='error'>
								{response.error || formError}
							</p>
						)}
					</form>
				</>
			)}
		</div>
	);
};

export default EditPost;
