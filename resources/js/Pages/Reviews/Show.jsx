import { Head, Link } from '@inertiajs/react';
import { Card } from 'primereact/card';
import { Rating } from 'primereact/rating';
import { Button } from 'primereact/button';

export default function Show({ review }) {
  return (
    <>
      <Head title={`Review #${review.id}`} />
      <div className="py-6">
        <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
          <Card className="shadow-3 p-6">
            <h2 className="text-xl font-bold mb-4">Review Detail</h2>

            <p><strong>ID:</strong> #{review.id}</p>
            <p><strong>User:</strong> {review.user?.name}</p>
            <p><strong>Product:</strong> {review.product?.name}</p>
            <p><strong>Rating:</strong></p>
            <Rating value={review.rating} readOnly cancel={false} />
            <p className="mt-2"><strong>Comment:</strong> {review.comment || '-'}</p>
            <p><strong>Created At:</strong> {new Date(review.created_at).toLocaleString()}</p>

            <div className="mt-6 flex gap-3">
              <Button
                label="Back"
                icon="pi pi-arrow-left"
                severity="secondary"
                onClick={() => history.back()}
              />
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
