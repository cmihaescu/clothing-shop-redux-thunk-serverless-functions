import "./directory-item.styles.scss"
import { useNavigate } from "react-router-dom";

const DirectoryItem = ({ category }) => {
    const { imageUrl, title, route } = category
    const navigate = useNavigate();
    const navigateToShop = () => navigate(route) 

    return (

        <div className="directory-item-container">
            <div className="background-image" style={{
                backgroundImage: `url(${imageUrl})`
            }}>
            </div>
            <div onClick={navigateToShop} className="directory-item-body">
                <h2> {title} </h2>
                <p>Shop now</p>
            </div>
        </div>
    )
}

export default DirectoryItem