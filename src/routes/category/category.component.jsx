import { useParams } from 'react-router-dom'
import './category.styles.scss'
import { Fragment, useEffect, useState } from 'react';
import { ProductCard } from '../../components/product-card/product-card.component';
import { useSelector } from 'react-redux';
import { selectCategoriesMap, selectCategoriesIsLoading } from '../../store/categories/category-selectors';
import { Spinner } from '../../components/spinner/spinner.component';

const Category = () => {
    const { category } = useParams();
    const categoriesMap = useSelector(selectCategoriesMap)
    const categoriesIsLoading = useSelector(selectCategoriesIsLoading)
    const [products, setProducts] = useState([])
    
    useEffect(() => {
        setProducts(categoriesMap[category])
    }, [category, categoriesMap])

    return (
        <Fragment>
            <h2 className='category-title'>{category.toUpperCase()}</h2>
            {
            categoriesIsLoading?
            <Spinner />:    
            <div className='category-div'>
                {products &&
                    products.map(product => <ProductCard key={product.id} product={product}></ProductCard>)}
            </div>
            }
        </Fragment>
    )
}

export default Category