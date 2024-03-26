import { ReactComponent as ArrowRight } from '../../assets/round-alt-arrow-right-svgrepo-com.svg'
import { ReactComponent as ArrowLeft } from '../../assets/round-alt-arrow-left-svgrepo-com.svg'
import { ReactComponent as RemoveIcon } from '../../assets/remove.svg'
import './checkout-item.styles.scss'
import { useDispatch, useSelector } from 'react-redux'
import { currencySelector, cartItemsSelector } from '../../store/cart/cart-selectors'
import { removeItemFromCart, updateCartItemsReducer, addItemToCart, decreaseItemFromCart } from '../../store/cart/cart-reducer'

export const CheckoutItem = ({ product }) => {
    const { name, imageUrl, price, quantity } = product
    const currency = useSelector(currencySelector)
    const cartItems = useSelector(cartItemsSelector)
    const dispatch = useDispatch()
    const handleAmountIncrease = () => dispatch(updateCartItemsReducer(addItemToCart(cartItems, product)))
    const handleAmountDecrease = () => dispatch(updateCartItemsReducer(decreaseItemFromCart(cartItems, product)))
    const handleRemoveFromCart = () => dispatch(updateCartItemsReducer(removeItemFromCart(cartItems, product)))

    return (
        <div className="checkout-item-container">
            <span><img src={imageUrl} alt={name}></img></span>
            <span>{name}</span>
            <div className='quantity-container'>
                <ArrowLeft onClick={handleAmountDecrease} className="quantity-svg" />
                <span>
                    {quantity}
                </span>
                <ArrowRight onClick={handleAmountIncrease} className="quantity-svg" />
            </div>
            <span>{price} &nbsp; {currency}</span>
            <span onClick={handleRemoveFromCart}><RemoveIcon className='removeIcon' /></span>
        </div>
    )
}