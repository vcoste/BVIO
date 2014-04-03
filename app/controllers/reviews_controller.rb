class ReviewsController < ApplicationController

  def index
    category_id = params[:category_id].to_i if params[:category_id]
    if category_id
      reviews = Review.where(:category_id => category_id)
    else
      reviews = Review.all
    end
    render :json => reviews.to_json, :status => 200
  end

  def show
    id = params[:id].to_i
    review = Review.find_by_id(id)
    render :json => review.to_json, :status => 200
  end

end