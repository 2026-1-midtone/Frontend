import './ProductRecommendationCard.scss'

/**
 * 관심 영양소와 매칭된 추천 제품 카드.
 * matchedNutrients 는 이 제품이 추천된 이유라서 반드시 함께 보여준다.
 *
 * @param {{ productName: string, englishName: string, imageUrl: string, productUrl: string,
 *           matchedNutrients: string[], functions: { functionInfo: string }[], disclaimer: string }} product
 * @param {Record<string, string>} nutrientLabels 영양소 코드 → 한글 이름
 */
function ProductRecommendationCard({ product, nutrientLabels }) {
  const functionInfo = product.functions?.[0]?.functionInfo

  return (
    <article className="product-card">
      {product.imageUrl && (
        <img className="product-card__image" src={product.imageUrl} alt="" loading="lazy" />
      )}

      <div className="product-card__body">
        <h4 className="product-card__name">{product.productName}</h4>
        {product.englishName && (
          <p className="product-card__english">{product.englishName}</p>
        )}

        {product.matchedNutrients?.length > 0 && (
          <ul className="product-card__matches">
            {product.matchedNutrients.map((code) => (
              <li key={code}>{nutrientLabels[code] ?? code}</li>
            ))}
          </ul>
        )}

        {functionInfo && <p className="product-card__function">{functionInfo}</p>}

        {product.productUrl && (
          <a
            className="product-card__link"
            href={product.productUrl}
            target="_blank"
            rel="noreferrer noopener"
          >
            제품 정보 보기 →
          </a>
        )}
      </div>
    </article>
  )
}

export default ProductRecommendationCard
