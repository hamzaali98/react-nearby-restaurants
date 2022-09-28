import React, { useState } from "react";
import "./Resturants.scss";

export const Restaurants = ({ placesData }) => {
  const [selectedPlace, setSelectedPlace] = useState(0);

  const toggleModal = () => {
    let allReviewsModal = document.querySelector("#all-reviews");
    allReviewsModal.classList.toggle("open");
  };
  const convertTime = (time) => {
    return new Date(time * 1000).toISOString().slice(0, 19).replace("T", " ");
  };

  const showAddReviewModal = () => {
    let addReviewModal = document.querySelector("#add-review");
    addReviewModal.classList.add("open");
  };

  return (
    <div className="restaurants">
      <div className="places">
        {placesData.map((place, index) => (
          <div className="place" key={index}>
            <img
              src={
                place.photos
                  ? place.photos[0].getUrl({
                      maxWidth: 300,
                      maxHeight: 300,
                    })
                  : "https://via.placeholder.com/300"
              }
              alt={place.name}
            />
            <div className="details">
              <h2 className="name">{place.name}</h2>
              <div className="review">
                <ul className={"stars rate-" + Math.round(place.rating)}>
                  <li>
                    <i className="fas fa-star"></i>
                  </li>
                  <li>
                    <i className="fas fa-star"></i>
                  </li>
                  <li>
                    <i className="fas fa-star"></i>
                  </li>
                  <li>
                    <i className="fas fa-star"></i>
                  </li>
                  <li>
                    <i className="fas fa-star"></i>
                  </li>
                </ul>
                <strong>{Math.round(place.rating)}</strong>
                <span className="all-reviews">
                  ({place.user_ratings_total})
                </span>
              </div>
              <ul className="info">
                <li>
                  <i className="fas fa-phone-alt"></i>
                  <a href={"tel:" + place.formatted_phone_number}>
                    {place.formatted_phone_number}
                  </a>
                </li>
                <li>
                  <i className="fas fa-phone-alt"></i>
                  <a>{place.formatted_address}</a>
                </li>
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
