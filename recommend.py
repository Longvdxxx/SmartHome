import pandas as pd
from sqlalchemy import create_engine, text
from sklearn.metrics.pairwise import cosine_similarity

engine = create_engine('mysql+mysqlconnector://root:@127.0.0.1/smarthome')

df_products = pd.read_sql("SELECT id, category_id, brand_id FROM products", engine)
df_orders = pd.read_sql("""
SELECT o.customer_id, oi.product_id
FROM orders o
JOIN order_items oi ON o.id = oi.order_id
""", engine)

if not df_orders.empty:
    matrix = pd.crosstab(df_orders['customer_id'], df_orders['product_id'])
    cf_similarity = cosine_similarity(matrix.T)
    cf_df = pd.DataFrame(cf_similarity, index=matrix.columns, columns=matrix.columns)
else:
    cf_df = pd.DataFrame()

df_encoded = pd.DataFrame()
cols_to_encode = [c for c in ['category_id', 'brand_id'] if c in df_products.columns]
if cols_to_encode:
    df_encoded = pd.get_dummies(df_products[cols_to_encode].fillna(0).astype(str),
                                 prefix=[f"{c}" for c in cols_to_encode])

cbf_df = pd.DataFrame()
if not df_encoded.empty:
    cbf_similarity = cosine_similarity(df_encoded)
    cbf_df = pd.DataFrame(cbf_similarity, index=df_products['id'], columns=df_products['id'])

alpha = 0.6
final_scores = {}

for p1 in df_products['id']:
    scores = {}
    for p2 in df_products['id']:
        if p1 == p2:
            continue
        cf_score = cf_df.loc[p1, p2] if not cf_df.empty and p1 in cf_df and p2 in cf_df else 0
        cbf_score = cbf_df.loc[p1, p2] if not cbf_df.empty and p1 in cbf_df and p2 in cbf_df else 0
        scores[p2] = alpha * cf_score + (1 - alpha) * cbf_score
    top_recs = sorted(scores.items(), key=lambda x: x[1], reverse=True)[:5]
    final_scores[p1] = top_recs

with engine.begin() as conn:
    conn.execute(text("DELETE FROM product_recommendations"))
    for product_id, recs in final_scores.items():
        for rec_id, score in recs:
            conn.execute(
                text("INSERT INTO product_recommendations (product_id, recommended_product_id, score) VALUES (:p1, :p2, :s)"),
                {"p1": int(product_id), "p2": int(rec_id), "s": float(score)}
            )
