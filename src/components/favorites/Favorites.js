import React from 'react';
import './favorites.css';
import Offer from '../offer/Offer';

export default ({ favorites, handleSetFavorite }) => {
	return (
		<div className="favorites-container">
			<h1>Favoritos!</h1>
			{favorites && favorites.length > 0 && (
				<div className="offers-container">
					{favorites.map(favorite => {
						return (
							<Offer
								offer={favorite}
								handleSetFavorite={handleSetFavorite}
								key={favorite.id}
							/>
						);
					})}
				</div>
			)}
			{(!favorites || favorites.length === 0) && (
				<p>
					<i className="fas fa-info-circle"></i> Sem Ofertas!
				</p>
			)}
		</div>
	);
};
