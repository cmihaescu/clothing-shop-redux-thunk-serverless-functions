import { ReactComponent as ShoppingIcon } from '../../assets/shopping-bag.svg';
import './cart-icon.styles.scss'
import { useDispatch, useSelector } from 'react-redux';
import { cartDropdownSelector, cartTotalItemsSelector } from '../../store/cart/cart-selectors';
import { setCartDropdown } from '../../store/cart/cart-actions';

export const CartIcon = () => {
    const dispatch = useDispatch()
    const totalItems = useSelector(cartTotalItemsSelector)
    const cartDropdown = useSelector(cartDropdownSelector)

    const toggleCartDropdown = () => { dispatch(setCartDropdown(!cartDropdown)) }

    return (
        <div className='cart-icon-container' onClick={toggleCartDropdown}>
            <ShoppingIcon className='shopping-icon'></ShoppingIcon>
            <span className='item-count'>{totalItems}</span>
        </div>
    )
}