import './product-card.styles.scss'
import Button from '../button/button.component'
import { useDispatch, useSelector } from 'react-redux'
import { currencySelector, cartItemsSelector } from '../../store/cart/cart-selectors'
import { addItemToCart } from '../../store/cart/cart-reducer'
import { updateCartItemsReducer } from '../../store/cart/cart-reducer'

export const ProductCard = ({ product }) => {
    const { name, price, imageUrl } = product
    const dispatch = useDispatch();
    const currency = useSelector(currencySelector)
    const cartItems = useSelector(cartItemsSelector)
    const addProductToCart = () => dispatch(updateCartItemsReducer(addItemToCart(cartItems, product)))

    return (
        <div className='product-card-container'>
            <img src={imageUrl} alt={`${name}`}></img>
            <div className='footer'>
                <span className='name'>{name}</span>
                <span className='price-and-currency'> {price} &nbsp; {currency}</span>
            </div>
            <Button buttonType="inverted" onClick={addProductToCart} >Add to cart</Button>
        </div>
    )
}