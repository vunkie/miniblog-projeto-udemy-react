import styles from "./Home.module.css";

import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";

const Home = () => {
	const [query, setQuery] = useState("");
	const [posts] = useState([]);

	const handleSubmit = (e) => {
		e.preventDefault();
		console.log(query);
	};

	return (
		<div className={styles.home} >
			<h1>Veja os nossos posts mais recentes:</h1>
			<form onSubmit={handleSubmit} className={styles.search_form} >
				<input
					type='text'
					placeholder='Pesquisar por tags'
					onChange={(e) => setQuery(e.target.value)}
				/>
				<button className='btn btn-dark'>Pesquisar</button>
			</form>
			<div>
				<h1>Posts....</h1>
				{posts && posts.length === 0 && (
					<div className={styles.noposts}>
						<p>Nenhum post encontrado</p>
						<Link to='/posts/create' className='btn'>
							Criar primeiro post
						</Link>
					</div>
				)}
			</div>
		</div>
	);
};

export default Home;
