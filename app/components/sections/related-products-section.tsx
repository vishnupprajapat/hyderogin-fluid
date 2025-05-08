import type {SectionDefaultProps, SectionOfType} from 'types';
import type {ProductRecommendationsQuery} from 'types/shopify/storefrontapi.generated';

import {Await, useLoaderData} from '@remix-run/react';
import {Suspense} from 'react';

import type {loader} from '~/routes/($locale).products.$productHandle';

import {ProductCardGrid} from '../product/product-card-grid';
import {RelatedProducts} from '../product/related-products';
import {Skeleton} from '../skeleton';

export type RelatedProductsSectionProps =
  SectionOfType<'relatedProductsSection'>;

export function RelatedProductsSection(
  props: SectionDefaultProps & {data: RelatedProductsSectionProps},
) {
  const {data} = props;
  const loaderData = useLoaderData<typeof loader>();
  const relatedProductsPromise = loaderData?.relatedProductsPromise;

  // Todo => Add carousel
  return (
    <div className="container">
      <Suspense
        fallback={
          <Skeleton>
            {data.heading && <h2>{data.heading}</h2>}
            <div className="mt-4">
              <ProductCardGrid
                columns={{
                  desktop: data.desktopColumns,
                }}
                skeleton={{
                  cardsNumber: data.maxProducts || 3,
                }}
              />
            </div>
          </Skeleton>
        }
      >
        <Await
          errorElement={
            <Skeleton isError>
              {data.heading && <h2>{data.heading}</h2>}
              <div className="mt-4">
                <ProductCardGrid
                  columns={{
                    desktop: data.desktopColumns,
                  }}
                  skeleton={{
                    cardsNumber: data.maxProducts || 3,
                  }}
                />
              </div>
            </Skeleton>
          }
          resolve={relatedProductsPromise as Promise<ProductRecommendationsQuery>}
        >
          {(result) => {
            const typedResult = {
              ...result,
              additional: {
                nodes: result.recommended || []
              }
            } as ProductRecommendationsQuery;
            
            return (
              <RelatedProducts
                columns={{
                  desktop: data.desktopColumns,
                }}
                data={typedResult}
                heading={data.heading}
                maxProducts={data.maxProducts || 3}
              />
            );
          }}
        </Await>
      </Suspense>
    </div>
  );
}
