class ProductsController < ApplicationController

  def index
    category_id = params[:category_id].to_i if params[:category_id]
    corners = params[:corners]
    if corners.is_a? String
      corners = JSON.parse(corners)
    end
    t_left = corners['NW']
    t_right = corners['NE']
    b_left = corners['SW']
    b_right = corners['SE']
    all_categories = Category.all
    all_products = Product.all
    category = all_categories.select{|c| c.id == category_id}.first
    products = category.get_all_products(t_left, t_right, b_left, b_right, all_categories, all_products)

    render :json => products.to_json, :status => 200
  end

  def show
    id = params[:id].to_i if params[:id]
    corners = params[:corners]
    t_left = corners['NW']
    t_right = corners['NE']
    b_left = corners['SW']
    b_right = corners['SE']
    product = Product.find_by_id(id)
    reviews = product.get_reviews_by_area(t_left, t_right, b_left, b_right)
    average_rating = Review.get_avg_rating(reviews)
    tag_array = Review.tag_count(reviews)
    gender_percentages = Review.get_gender_percent(reviews)
    top_review = Review.get_top_review(reviews)
    is_recommended_location = Review.get_recommended(reviews)

    product = JSON.parse(product.to_json).merge({"avg_rating" => average_rating, "tag_array" => tag_array, "gender_percentages" => gender_percentages, "top_review" => top_review, "is_recommended_location", is_recommended_location})

    render :json => product.to_json, :status => 200

  end

end