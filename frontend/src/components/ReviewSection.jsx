import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FiThumbsUp, FiTrash2, FiStar } from 'react-icons/fi';
import { FaStar } from 'react-icons/fa';
import './ReviewSection.css';

const StarRating = ({ value, onChange, readonly = false }) => {
  const [hovered, setHovered] = useState(0);

  return (
    <div className={`star-rating ${readonly ? 'readonly' : 'interactive'}`}>
      {[1, 2, 3, 4, 5].map(star => (
        <span
          key={star}
          className={`star ${star <= (hovered || value) ? 'filled' : ''}`}
          onClick={() => !readonly && onChange && onChange(star)}
          onMouseEnter={() => !readonly && setHovered(star)}
          onMouseLeave={() => !readonly && setHovered(0)}
        >
          <FaStar />
        </span>
      ))}
    </div>
  );
};

const RatingBar = ({ label, count, total }) => {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="rating-bar-row">
      <span className="rating-bar-label">{label} ⭐</span>
      <div className="rating-bar-track">
        <div className="rating-bar-fill" style={{ width: `${pct}%` }} />
      </div>
      <span className="rating-bar-count">{count}</span>
    </div>
  );
};

const ReviewSection = ({ productId }) => {
  const { user } = useContext(AuthContext);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [helpfulClicked, setHelpfulClicked] = useState({});

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      const { data } = await axios.get(`/api/products/${productId}/reviews`);
      setReviews(data);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) return toast.error('Please select a rating');
    if (!comment.trim()) return toast.error('Please write a comment');

    setSubmitting(true);
    try {
      const { data } = await axios.post(
        `/api/products/${productId}/reviews`,
        { rating, comment },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setReviews(prev => [data, ...prev]);
      setRating(0);
      setComment('');
      toast.success('Review submitted!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleHelpful = async (reviewId) => {
    if (helpfulClicked[reviewId]) return;
    try {
      const { data } = await axios.put(
        `/api/products/${productId}/reviews/${reviewId}/helpful`,
        {},
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setReviews(prev => prev.map(r => r._id === reviewId ? { ...r, helpful: data.helpful } : r));
      setHelpfulClicked(prev => ({ ...prev, [reviewId]: true }));
    } catch {
      toast.error('Failed to mark helpful');
    }
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm('Delete your review?')) return;
    try {
      await axios.delete(
        `/api/products/${productId}/reviews/${reviewId}`,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setReviews(prev => prev.filter(r => r._id !== reviewId));
      toast.success('Review deleted');
    } catch {
      toast.error('Failed to delete review');
    }
  };

  // Rating breakdown
  const breakdown = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => r.rating === star).length
  }));
  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  // Sort reviews
  const sorted = [...reviews].sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortBy === 'highest') return b.rating - a.rating;
    if (sortBy === 'lowest') return a.rating - b.rating;
    if (sortBy === 'helpful') return b.helpful - a.helpful;
    return 0;
  });

  const userReview = user ? reviews.find(r => r.user?._id === user._id || r.user === user._id) : null;

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  };

  return (
    <div className="review-section">
      <div className="container">
        <h2 className="review-section-title">Ratings & Reviews</h2>

        {/* Summary */}
        {reviews.length > 0 && (
          <div className="review-summary">
            <div className="avg-rating-block">
              <span className="avg-number">{avgRating}</span>
              <StarRating value={Math.round(avgRating)} readonly />
              <span className="total-reviews">{reviews.length} review{reviews.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="rating-breakdown">
              {breakdown.map(({ star, count }) => (
                <RatingBar key={star} label={star} count={count} total={reviews.length} />
              ))}
            </div>
          </div>
        )}

        {/* Write Review Form */}
        {user && !userReview && (
          <form className="review-form" onSubmit={handleSubmit}>
            <h3>Write a Review</h3>
            <div className="form-rating">
              <label>Your Rating</label>
              <StarRating value={rating} onChange={setRating} />
              {rating > 0 && (
                <span className="rating-label">
                  {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][rating]}
                </span>
              )}
            </div>
            <div className="form-comment">
              <label>Your Review</label>
              <textarea
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="Share your experience with this product..."
                rows={4}
                maxLength={500}
              />
              <span className="char-count">{comment.length}/500</span>
            </div>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        )}

        {!user && (
          <div className="review-login-prompt">
            <FiStar />
            <span>Please <a href="/login">login</a> to write a review</span>
          </div>
        )}

        {userReview && (
          <div className="already-reviewed">
            ✓ You have already reviewed this product
          </div>
        )}

        {/* Reviews List */}
        {reviews.length > 0 && (
          <div className="reviews-list-section">
            <div className="reviews-list-header">
              <span>{reviews.length} Review{reviews.length !== 1 ? 's' : ''}</span>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="sort-select">
                <option value="newest">Newest First</option>
                <option value="highest">Highest Rating</option>
                <option value="lowest">Lowest Rating</option>
                <option value="helpful">Most Helpful</option>
              </select>
            </div>

            <div className="reviews-list">
              {sorted.map(review => (
                <div key={review._id} className="review-card">
                  <div className="review-header">
                    <div className="reviewer-info">
                      <div className="reviewer-avatar">
                        {review.user?.name?.[0]?.toUpperCase() || 'U'}
                      </div>
                      <div>
                        <span className="reviewer-name">{review.user?.name || 'User'}</span>
                        <span className="review-date">{formatDate(review.createdAt)}</span>
                      </div>
                    </div>
                    <StarRating value={review.rating} readonly />
                  </div>

                  <p className="review-comment">{review.comment}</p>

                  <div className="review-footer">
                    <button
                      className={`helpful-btn ${helpfulClicked[review._id] ? 'clicked' : ''}`}
                      onClick={() => user && handleHelpful(review._id)}
                      disabled={!user || helpfulClicked[review._id]}
                      title={!user ? 'Login to mark helpful' : ''}
                    >
                      <FiThumbsUp />
                      Helpful {review.helpful > 0 && `(${review.helpful})`}
                    </button>

                    {user && (user._id === review.user?._id || user._id === review.user) && (
                      <button className="delete-review-btn" onClick={() => handleDelete(review._id)}>
                        <FiTrash2 /> Delete
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && reviews.length === 0 && (
          <div className="no-reviews">
            <FiStar size={32} />
            <p>No reviews yet. Be the first to review!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewSection;
