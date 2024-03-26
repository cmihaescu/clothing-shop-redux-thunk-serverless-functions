import { ReactComponent as RemoveIcon } from '../../assets/remove.svg'
import './cart-item.styles.scss'
import { useSelector, useDispatch } from 'react-redux'
import { currencySelector, cartItemsSelector } from '../../store/cart/cart-selectors'
import { removeItemFromCart, updateCartItemsReducer } from '../../store/cart/cart-reducer'

export const CartItem = ({ cartItem }) => {
    const { name, quantity, imageUrl, price } = cartItem
    const currency = useSelector(currencySelector)
    const cartItems = useSelector(cartItemsSelector)
    const dispatch = useDispatch()

    const handleRemoveFromCart = () => dispatch(updateCartItemsReducer(removeItemFromCart(cartItems, cartItem)))

    return (
        <div className='cart-item-container'>
            <img src={imageUrl} alt={name}></img>
            <div className='item-details'>
                <span className='name'>{name}</span>
                <span className='price'>{quantity} x {price}&nbsp;{currency}</span>
                <span onClick={handleRemoveFromCart}><RemoveIcon className='removeIcon' /></span>
            </div>
        </div>
    )
}