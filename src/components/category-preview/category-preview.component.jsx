import { ProductCard } from '../product-card/product-card.component'
import { Link } from 'react-router-dom'
import './category-preview.styles.scss'
import { selectCategoriesIsLoading } from '../../store/categories/category-selectors';
import { Spinner } from '../spinner/spinner.component';
import { useSelector } from 'react-redux';

export const CategoryPreview = ({ title, products }) => {
const categoriesIsLoading = useSelector(selectCategoriesIsLoading)

    return (
        <div className='category-preview-container'>
            <h2><Link to={title} className='title'>{title.toUpperCase()}</Link></h2>
            {
            categoriesIsLoading?
            <Spinner />:
            <div className='preview'>
                {products
                    .filter((_, idx) => { return idx < 4 })
                    .map((product) => {
                        return <ProductCard key={product.id} product={product} />
                        
                    })}
            </div>
            }
        </div>
    )
}