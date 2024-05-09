import { CategoryPreview } from "../../components/category-preview/category-preview.component";
import { useSelector } from "react-redux";
import { selectCategoriesMap } from "../../store/categories/category-selectors";
import "./categories-preview.styles.scss";

const CategoriesPreview = () => {
  const categoriesMap = useSelector(selectCategoriesMap);

  return (
    <div className="categories-preview-container">
      {Object.keys(categoriesMap).map((title, i) => (
        <CategoryPreview
          key={i}
          title={title}
          products={categoriesMap[title]}
        />
      ))}
    </div>
  );
};

export default CategoriesPreview;
