import { Fragment } from 'react'
import { CategoryPreview } from '../../components/category-preview/category-preview.component'
import { useSelector } from 'react-redux'
import { selectCategoriesMap } from '../../store/categories/category-selectors'

const CategoriesPreview = () => {
    const categoriesMap = useSelector(selectCategoriesMap)

    return (
        <Fragment>
            {Object.keys(categoriesMap).map(title =>
                <CategoryPreview title={title} products={categoriesMap[title]} />
            )}

        </Fragment>
    )
}

export default CategoriesPreview